const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const role_name = args.join(" ").toLowerCase();

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

  if (role_name === "list") {
    const list = await get_role_list(message, restricted_roles);

    const list_embed = new Discord.MessageEmbed()
      .setTitle("List of Roles:")
      .setDescription(list);

    message.channel.send(list_embed);
  } else if (
    !restricted_roles.includes(role_name) &&
    !role_name.includes("admin")
  ) {
    const role = message.guild.roles.cache.find(
      (role) => role.name === role_name
    );

    if (!role) {
      const list = await get_role_list(message, restricted_roles);

      message.reply("Sorry, this role doesn't exist.");

      const list_embed = new Discord.MessageEmbed()
        .setTitle("List of Valid Roles:")
        .setDescription(list);

      message.channel.send(list_embed);

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
