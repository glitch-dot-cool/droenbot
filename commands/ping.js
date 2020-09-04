const Discord = require("discord.js");
const role_check = require("../utils/role_check");

exports.run = (bot, message, args) => {
  const uptime = format(process.uptime());
  const memory_usage = Object.entries(process.memoryUsage());
  const is_mod = role_check(bot, message, "glitch.cool");

  if (is_mod) {
    const embed = new Discord.MessageEmbed()
      .setTitle("pong!")
      .addField("uptime:", uptime)
      .addFields(
        memory_usage.map((entry) => {
          const megabytes = `${(entry[1] * 0.000001).toFixed(2)}MB`;
          return {
            name: entry[0],
            value: megabytes,
          };
        })
      );

    message.channel.send(embed);
  } else {
    message.reply(
      "Sorry, you don't have sufficient permissions to use this command."
    );
  }
};

function format(s) {
  const pad = (s) => {
    return (s < 10 ? "0" : "") + s;
  };
  const hours = pad(Math.floor(s / (60 * 60)));
  const minutes = pad(Math.floor((s % (60 * 60)) / 60));
  const seconds = pad(Math.floor(s % 60));

  return `${hours}:${minutes}:${seconds}`;
}
