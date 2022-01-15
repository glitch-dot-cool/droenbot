function get_restricted_channels(message) {
  // get all channels that have permissions overrides set (implies private)
  const restricted_channels = message.guild.channels.cache.filter(
    (channel) => channel.permissionOverwrites.size
  );

  const restricted_channels_array = Array.from(
    restricted_channels,
    ([_, value]) => Number(value.id)
  );

  const public_bot_spam_channel_id = "617838975335530507";

  // if the call is coming from the public bot channel, filter out private channels
  if (message.channel.id === public_bot_spam_channel_id) {
    return restricted_channels_array;
  }

  // otherwise assume it originates from a private channel and don't filter
  else return [];
}

module.exports = get_restricted_channels;
