const Discord = require("discord.js");
const { get_user_message_count } = require("../db/user-model");

exports.run = async (bot, message, args) => {
  const msg_count = await get_user_message_count(message.author.id);
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

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields(
      { name: "joined:", value: joined_at.toLocaleString() },
      { name: "messages sent:", value: msg_count },
      { name: "last message:", value: last_msg.toLocaleString() }
    )
    .setImage(avatar)
    .setColor(color);

  message.channel.send(embed);
};
