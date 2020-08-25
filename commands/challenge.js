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
        select(message);
        break;
      default:
        warn_invalid_command(message);
    }
  } else {
    message.reply("You do not have sufficient privileges to use this command.");
  }
};

async function add(arguments, message) {
  const input_syntax_example = `\`!challenge add make a track underwater\nscuba is prohibited but snorkles are permitted\``;
  const args = parse_arguments(arguments);

  try {
    if (args.name && args.name !== " ") {
      await db.insert("challenges", {
        challenge_name: args.name,
        challenge_description: args.description || "N/A",
        due_by: "N/A",
      });
      message.reply("Successfully added challenge");
    } else throw "Challenge must have a name!";
  } catch (error) {
    message.reply(
      `Error adding challenge. Please try again and double check your input syntax. Properly formatted inputs should contain a command (add), a name, and an optional description.\nEx:\n${input_syntax_example}`
    );
    console.error(error);
  }
}

async function remove(arguments, message) {
  const input_syntax_example = `\`!challenge delete make a track slower than 60bpm\``;
  const args = parse_arguments(arguments);

  try {
    const id = await db.remove("challenges", { challenge_name: args.name });
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
    const embed = new Discord.MessageEmbed()
      .setTitle("List of Challenges:")
      .addFields(
        challenges.map((challenge) => {
          return {
            name: challenge.challenge_name,
            value: challenge.challenge_description,
          };
        })
      );
    message.channel.send(embed);
  } catch (error) {
    console.error(error);
  }
}

async function select(message) {
  try {
    // pull random challenge
    const challenges = await db.findBy("challenges", { due_by: "N/A" });
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
      .setTitle("This month's challenge is:")
      .addField(
        selected_challenge.challenge_name,
        selected_challenge.challenge_description
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
    "Invalid command. Valid commands are `add`, `update`, `delete`, `select`, and `list`"
  );
}

function parse_arguments(args) {
  const [name, description] = args.slice(1).join(" ").split("\n");
  return { name, description };
}
