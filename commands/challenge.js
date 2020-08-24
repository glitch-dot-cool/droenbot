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
      default:
        warn_invalid_command(message);
    }
  } else {
    message.reply("You do not have sufficient privileges to use this command.");
  }
};

async function add(arguments, message) {
  const input_syntax_example = `\`!challenge add make a track slower than 60bpm\nno double time!\n01/30/20\``;
  const args = parse_arguments(arguments);

  try {
    await db.insert("challenges", {
      challenge_name: args.name,
      challenge_description: args.description || args.name,
      due_by: new Date(args.due_by),
    });
    message.reply("Successfully added challenge");
  } catch (error) {
    message.reply(
      `Error adding challenge. Please try again and double check your input syntax. Properly formatted inputs should contain a command (add), a name, an optional description, and a due date (MM/DD/YYYY).\nEx:\n${input_syntax_example}`
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
    const challenges = await db.find("challenges");
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

function warn_invalid_command(message) {
  message.reply(
    "Invalid command. Valid commands are `add`, `update`, `delete`, `draw`, and `list`"
  );
}

function parse_arguments(args) {
  const [name, due_by, description] = args.slice(1).join(" ").split("\n");
  return { name, due_by, description };
}
