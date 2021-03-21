const db = require("../db/db-model");
const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const command = args[0].toLowerCase();
  const mod_role = message.member.roles.cache.some(
    (role) => role.name === "mod"
  );

  if (mod_role) {
    switch (command) {
      case "add":
        add(args, message);
        break;
      case "remove":
      case "delete":
        remove(args, message);
        break;
      case "list":
      case "view":
        list(message);
        break;
      case "select":
      case "draw":
        select(args, message);
        break;
      default:
        warn_invalid_command(message);
    }
  } else {
    message.reply("You do not have sufficient privileges to use this command.");
  }
};

async function add(arguments, message) {
  const input_syntax_example = `\`!challenge add audio\nmake a track underwater\nscuba is prohibited but snorkles are permitted\``;
  const args = parse_arguments(arguments);

  try {
    if (
      args.name &&
      args.name !== " " &&
      ["audio", "visual", "code"].includes(args.type) // type must be "audio" or "visual" or "code"
    ) {
      await db.insert("challenges", {
        challenge_name: args.name,
        challenge_description: args.description || "",
        due_by: "N/A",
        type: args.type,
      });
      message.reply("Successfully added challenge");
    } else throw "Challenge must have a name and a type!";
  } catch (error) {
    message.reply(
      `Error adding challenge. Please try again and double check your input syntax. Properly formatted inputs should contain a command ("add") and a type ("audio", "visual", or "code") on the same line, a name on the next line, and an optional description on the following line.\nEx:\n${input_syntax_example}\n\nAnother reason this operation may have failed is if the challenge name is not unique.`
    );
    console.error(error);
  }
}

async function remove(arguments, message) {
  const input_syntax_example = `\`!challenge delete make a track slower than 60bpm\``;
  const [name] = arguments.slice(1).join(" ").split("\n");

  try {
    const id = await db.remove("challenges", { challenge_name: name });
    if (id) {
      message.reply("Successfully deleted challenge");
    } else {
      message.reply(
        "The challenge you are trying to delete doesn't exist. \nTry calling `!challenge list`"
      );
    }
  } catch (error) {
    message.reply(
      `Error deleting challenge. Please try again and double check your input syntax. Properly formatted inputs should contain a command (remove) and the name of the challenge you're trying to delete.\nEx:\n${input_syntax_example}`
    );
    console.error(error);
  }
}

async function list(message) {
  try {
    const challenges = await db.findBy("challenges", { due_by: "N/A" });
    const challenge_list = format_challenge_list(challenges);

    const embed = new Discord.MessageEmbed()
      .setTitle("List of Challenges:")
      .setDescription(challenge_list);
    message.channel.send(embed);
  } catch (error) {
    console.error(error);
  }
}

async function select(args, message) {
  try {
    const [type] = args.slice(1).join(" ").split("\n");

    if (!type) {
      message.reply(
        "You must specify a challenge type of `audio`, `visual`, or `code`."
      );
      return;
    }

    // pull random challenge
    const challenges = await db.findBy("challenges", { type, due_by: "N/A" });
    if (!challenges.length) {
      message.reply(
        "There are no remaining challenges of this type! Create some new ones!"
      );
      return;
    }
    const random_index = Math.floor(Math.random() * challenges.length);
    const selected_challenge = challenges[random_index];

    // setup due date
    const now = new Date();
    const due_by =
      now.getMonth() == 11
        ? new Date(now.getFullYear() + 1, 0, 1)
        : new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // update due date in db
    await db.update(
      "challenges",
      {
        due_by,
      },
      { id: selected_challenge.id }
    );

    // setup result embed
    const embed = new Discord.MessageEmbed()
      .setTitle(`This month's ${type} challenge is:`)
      .addField(
        selected_challenge.challenge_name,
        selected_challenge.challenge_description || ""
      )
      .setFooter(
        `Due date: ${new Date(due_by).toISOString().substring(0, 10)}`
      );

    message.channel.send(embed);
  } catch (error) {
    console.error(error);
    message.channel.send("Error selecting challenge");
  }
}

function warn_invalid_command(message) {
  message.reply(
    "Invalid command. Valid commands are `add`, `delete`, `select`, and `list`"
  );
}

function parse_arguments(args) {
  const [type, name, description] = args.slice(1).join(" ").split("\n");
  return { name, description, type };
}

function format_challenge_list(challenges) {
  const audio_challenges = format_challenge_sublist(challenges, "audio");
  const visual_challenges = format_challenge_sublist(challenges, "visual");
  const code_challenges = format_challenge_sublist(challenges, "code");

  return assemble_full_list([
    audio_challenges,
    visual_challenges,
    code_challenges,
  ]);
}

function format_challenge_sublist(challenges, type) {
  const sublist = challenges.filter((challenge) => challenge.type === type);

  // create initial string for reduce, omit if sublist has no entries
  const title = sublist.length
    ? `**${type.charAt(0).toUpperCase() + type.slice(1)} Challenges**\n`
    : "";

  const result = sublist.reduce((acc, cur) => {
    let name = `*${cur.challenge_name}*\n`;
    const desc = cur.challenge_description
      ? `\`${cur.challenge_description}\`\n\n`
      : "";

    // add additional space if no description
    if (!desc) name += "\n";

    return acc + (name + desc);
  }, title);

  return result;
}

function assemble_full_list(sublists) {
  return sublists.map((list) => `${list}`);
}
