const db = require("../db/db-model");

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
      `Error adding challenge. Please try again and double check your input syntax. Properly formatted inputs should contain a command (add, edit, etc), a name, an optional description, and a due date (MM/DD/YYYY).\nEx:\n${input_syntax_example}`
    );
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
