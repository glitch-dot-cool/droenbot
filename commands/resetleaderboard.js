const Discord = require("discord.js");
const role_check = require("../utils/role_check");
const service = require("../api/services/invaders-service");

exports.run = async (bot, message, args) => {
  const is_mod = role_check(bot, message);
  const superadmin_id = "254686973766139904";

  if (is_mod && message.author.id === superadmin_id) {
    const collector = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id,
      { max: 1 }
    );

    message.reply("are you sure you want to do that? y/N");

    collector.on("collect", (message) => {
      if (
        message.content.toLowerCase() === "y" ||
        (message.content.toLowerCase() === "yes" &&
          message.author.id === superadmin_id)
      ) {
        service._delete_all_scores();
        message.channel.send("💥 nuked the leaderboards 💥");
      } else if (message.author.id !== superadmin_id) {
        message.reply(
          "Sorry, you don't have sufficient privileges to use this command."
        );
      } else {
        message.channel.send("phew, that was close 😅");
      }
    });
  } else {
    message.reply(
      "Sorry, you don't have sufficient privileges to use this command."
    );
  }
};
