const Discord = require("discord.js");
const role_check = require("../utils/role_check");
const { get_server_stats } = require("../db/user-model");

exports.run = async (bot, message, args) => {
  const is_mod = role_check(bot, message, "glitch.cool");

  if (is_mod) {
    const stats = await get_server_stats();
    const top_channels = make_list(stats, "top_channels");
    const top_users = make_list(stats, "top_users");
    const media_types = make_list(stats, "media_counts");

    const embed = new Discord.MessageEmbed()
      .setTitle("Server-wide Stats:")
      .setDescription("Stats are as of August 30th, 2020")
      .addFields(
        {
          name: "Top Channels by Message Count:",
          value: top_channels,
        },
        {
          name: "Top Users by Message Count:",
          value: top_users,
        },
        {
          name: "Total Messages Sent:",
          value: stats.total_messages.toLocaleString(),
        },
        {
          name: "Media Types in Messages:",
          value: media_types,
        }
      );

    message.channel.send({ embeds: [embed] });
  } else {
    message.reply(
      "Sorry, you don't have sufficient privileges to use this command."
    );
  }
};

function make_list(stats, category, label = "") {
  let result = "";
  if (Array.isArray(stats[category])) {
    stats[category].forEach((entry, idx) => {
      const category = entry[0];
      const value = entry[1];
      result += `${idx + 1}. ${category}: ${value.toLocaleString()} ${label}\n`;
    });
  } else {
    for (let key in stats[category]) {
      const value = stats[category][key];
      result += `${key}: ${value.toLocaleString()}\n`;
    }
  }
  return result;
}
