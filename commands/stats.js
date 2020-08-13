const Discord = require("discord.js");
const { get_stats } = require("../db");

exports.run = (bot, message, args) => {
  const stats = get_stats(bot, message);
  const avatar = bot.guilds
    .resolve(message.guild.id)
    .members.resolve(message.author.id)
    .user.avatarURL();

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields(
      { name: "messages sent:", value: stats.points },
      { name: "level:", value: stats.level }
    )
    .setImage(avatar);

  message.channel.send(embed);
};
