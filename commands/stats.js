const Discord = require("discord.js");
const { get_user_message_count } = require("../db/user-model");
const get_restricted_channels = require("../utils/get_restricted_channels");

exports.run = async (bot, message, args) => {
  const restricted_channels = await get_restricted_channels(message);
  const { user, message_details } = await get_user_message_count(
    message.author.id,
    restricted_channels
  );
  const author_id = message.author.id;
  const guild_id = message.guild.id;
  const joined_at = new Date(message.member.joinedAt);

  const color =
    bot.guilds.resolve(guild_id).members.resolve(author_id)?.roles?.color
      ?.color || "#1a1a1a";

  const avatar = bot.guilds
    .resolve(guild_id)
    .members.resolve(author_id)
    .user.avatarURL();

  const top_channels = message_details
    .sort((a, b) => b.total_count - a.total_count)
    // limit to top 5 channels
    .slice(0, 5);

  const channels_to_display = top_channels.map((channel, idx) => {
    return {
      name: `#${idx + 1} channel`,
      value: `${
        channel.channel_name
      } (${channel.total_count.toLocaleString()} msgs)`,
    };
  });

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields([
      { name: "messages sent:", value: user.messages_sent.toLocaleString() },
      ...channels_to_display,
      { name: "joined:", value: joined_at.toLocaleString() },
    ])
    .setImage(avatar)
    .setColor(color);

  message.channel.send({ embeds: [embed] });
};
