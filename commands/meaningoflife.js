const Discord = require("discord.js");

exports.run = (bot, message, args) => {
  const embed = new Discord.MessageEmbed().setImage(
    "https://upload.wikimedia.org/wikipedia/commons/5/56/Answer_to_Life.png"
  );

  message.reply({ embeds: [embed] });
};
