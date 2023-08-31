const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const command = args[0].toLowerCase();
  const role_name = args.slice(1).join(" ").toLowerCase();

  const valid_commands = ["add", "remove", "list", "view", "delete"];
  const restricted_roles = [
    "mod",
    "glitch.cool",
    "x",
    "Server Booster",
    "internal-guest",
    "Trello",
    "Taco", // trello bot
    "@everyone",
    "staff",
    "Zapier", // zapier discord integration.
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

    message.channel.send({ embeds: [list_embed] });
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
  const role_objects = await message.guild.roles.fetch();

  // convert es6 map to array - key, value pairs
  const role_strings = [...role_objects].map(([k, v]) => v.name);

  const filtered_roles = role_strings.filter(
    (role_name) =>
      // not in list of excluded roles and doesn't have 'admin' in name, ex. 'bandcamp-admin'
      !restricted_roles.includes(role_name) && !role_name.includes("admin")
  );

  const formatted_list = filtered_roles
    .sort()
    .reduce((acc, cur) => (acc += `${cur}\n`), "");

  return formatted_list;
}

async function warn_invalid_role(message, restricted_roles) {
  const list = await get_role_list(message, restricted_roles);

  await message.reply("Sorry, this role doesn't exist.");

  const list_embed = new Discord.MessageEmbed()
    .setTitle("List of Valid Roles:")
    .setDescription(list);

  await message.channel.send({ embeds: [list_embed] });
}
