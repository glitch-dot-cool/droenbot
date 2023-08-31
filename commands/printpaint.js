const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const timestamp = +new Date();

  const embed = new Discord.MessageEmbed()
    .setTitle("Current state of the canvas 🎨🖌️")
    .setURL(`https://paint.glitch.cool/image/${timestamp}`)
    .setImage(`https://paint.glitch.cool/thumbnail/${timestamp}`)
    .setFooter("Try it out at paint.glitch.cool");

  message.channel.send({ embeds: [embed] });
};
