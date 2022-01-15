const Discord = require("discord.js");
const { get_user_message_count } = require("../db/user-model");
const get_restricted_channels = require("../utils/get_restricted_channels");

exports.run = async (bot, message, args) => {
  const restricted_channels = get_restricted_channels(message);
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
  const top_channels = message_details.sort(
    (a, b) => b.total_count - a.total_count
  );

  const embed = new Discord.MessageEmbed()
    .setTitle(`Stats for ${message.member.displayName}`)
    .addFields(
      { name: "messages sent:", value: user.messages_sent.toLocaleString() },
      {
        name: "#1 channel:",
        value: `${
          top_channels[0].channel_name
        } (${top_channels[0].total_count.toLocaleString()} msgs)`,
      },
      {
        name: "#2 channel:",
        value: `${
          top_channels[1].channel_name
        } (${top_channels[1].total_count.toLocaleString()} msgs)`,
      },
      {
        name: "#3 channel:",
        value: `${
          top_channels[2].channel_name
        } (${top_channels[2].total_count.toLocaleString()} msgs)`,
      },
      {
        name: "#4 channel:",
        value: `${
          top_channels[3].channel_name
        } (${top_channels[3].total_count.toLocaleString()} msgs)`,
      },
      {
        name: "#5 channel:",
        value: `${
          top_channels[4].channel_name
        } (${top_channels[4].total_count.toLocaleString()} msgs)`,
      },
      { name: "joined:", value: joined_at.toLocaleString() }
    )
    .setImage(avatar)
    .setColor(color);

  message.channel.send(embed);
};
