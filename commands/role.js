const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const role_name = args.join(" ").toLowerCase();

  const restricted_roles = [
    "mod",
    "glitch.cool",
    "x",
    "Server Booster",
    "@everyone",
  ];

  if (role_name === "list") {
    let list = "";
    const roles = await message.guild.roles.fetch();
    const filtered_roles = roles.cache.filter(
      (role) =>
        !restricted_roles.includes(role.name) && !role.name.includes("admin")
    );

    filtered_roles.forEach((role) => (list += `${role.name}\n`));

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
      message.reply("Sorry, this role doesn't exist.");
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
