const { public_bot_channel_id } = require("../config.json");

async function get_restricted_channels(message) {
  // if the call isn't coming from public bot channel,
  // assume it's coming from a private channel and don't filter.
  // note: only admins would have restricted channels,
  // i.e. this function doesn't affect non-admins
  if (message.channel.id !== public_bot_channel_id) {
    return [];
  }

  const channels = await message.guild.channels.fetch();

  const restricted_channels = channels.filter((channel) => {
    return !channel
      .permissionsFor(channel.guild.roles.everyone)
      .has("VIEW_CHANNEL");
  });

  const restricted_channels_array = Array.from(
    restricted_channels,
    ([_, value]) => Number(value.id)
  );

  return restricted_channels_array;
}

module.exports = get_restricted_channels;
