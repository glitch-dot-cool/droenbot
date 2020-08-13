const Discord = require("discord.js");
const { get_stats } = require("../db");

exports.run = (bot, message, args) => {
  const author_id = message.author.id;
  const guild_id = message.guild.id;
  const joined_at = new Date(message.member.joinedAt);
  const avatar = bot.guilds
    .resolve(guild_id)
    .members.resolve(author_id)
    .user.avatarURL();

  const stats = get_stats(bot, author_id, guild_id);

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields(
      { name: "joined:", value: `${joined_at.toLocaleString()}` },
      { name: "messages sent:", value: stats.points },
      { name: "level:", value: stats.level }
    )
    .setImage(avatar);

  message.channel.send(embed);
};
