const Discord = require("discord.js");
const { get_stats } = require("../db");

exports.run = (bot, message, args) => {
  const author_id = message.author.id;
  const guild_id = message.guild.id;
  const joined_at = new Date(message.member.joinedAt);
  const last_msg = message.member.lastMessage.createdAt;
  const color = bot.guilds.resolve(guild_id).members.resolve(author_id).roles
    .color.color;
  const avatar = bot.guilds
    .resolve(guild_id)
    .members.resolve(author_id)
    .user.avatarURL();

  const stats = get_stats(bot, author_id, guild_id);

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields(
      { name: "joined:", value: joined_at.toLocaleString() },
      { name: "messages sent:", value: stats.points },
      { name: "last message:", value: last_msg.toLocaleString() },
      { name: "level:", value: stats.level }
    )
    .setImage(avatar)
    .setColor(color);

  message.channel.send(embed);
};
