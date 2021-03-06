const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const [command, role_name] = args.map((arg) => arg.toLowerCase());
  const valid_commands = ["add", "remove", "list", "view", "delete"];
  const restricted_roles = [
    "mod",
    "glitch.cool",
    "x",
    "Server Booster",
    "internal-guest",
    "Trello",
    "Taco",
    "@everyone",
    "staff",
  ];

  // check for valid command
  if (!command || !valid_commands.includes(command)) {
    message.reply("You must specify a command of `add`, `remove`, or `list`");
    return;
  }

  // check for role name if adding/removing
  if (!["list", "view"].includes(command) && !role_name) {
    message.reply(`You must specify a role name to ${command}`);
    return;
  }

  if (command === "list") {
    const list = await get_role_list(message, restricted_roles);

    const list_embed = new Discord.MessageEmbed()
      .setTitle("List of Roles:")
      .setDescription(list);

    message.channel.send(list_embed);
  } else if (command === "remove" || command === "delete") {
    const role = message.guild.roles.cache.find(
      (role) => role.name === role_name
    );

    if (!role) {
      await warn_invalid_role(message, restricted_roles);
      return;
    }

    const member = await message.guild.members.fetch(message.author.id);
    member.roles.remove(role);
    message.reply(
      `Successfully removed the ${role_name} role :negative_squared_cross_mark:`
    );
  } else if (
    !restricted_roles.includes(role_name) &&
    !role_name.includes("admin")
  ) {
    const role = message.guild.roles.cache.find(
      (role) => role.name === role_name
    );

    if (!role) {
      await warn_invalid_role(message, restricted_roles);
      return;
    }

    const member = await message.guild.members.fetch(message.author.id);
    member.roles.add(role);
    message.reply(
      `Successfully assigned you the ${role_name} role :white_check_mark:`
    );
  } else {
    message.reply("Sorry, this role is restricted.");
  }
};

async function get_role_list(message, restricted_roles) {
  let list = "";
  const roles = await message.guild.roles.fetch();
  const filtered_roles = roles.cache.filter(
    (role) =>
      !restricted_roles.includes(role.name) && !role.name.includes("admin")
  );

  filtered_roles.forEach((role) => (list += `${role.name}\n`));
  return list;
}

async function warn_invalid_role(message, restricted_roles) {
  const list = await get_role_list(message, restricted_roles);

  await message.reply("Sorry, this role doesn't exist.");

  const list_embed = new Discord.MessageEmbed()
    .setTitle("List of Valid Roles:")
    .setDescription(list);

  await message.channel.send(list_embed);
}
