const Discord = require("discord.js");
const axios = require("axios");

exports.run = async (bot, message, args) => {
  const TRUNCATION_MESSAGE = "...[truncated]";
  const MAX_SIZE = 4096 - TRUNCATION_MESSAGE.length;

  try {
    const res = await axios.get("https://poetrydb.org/random");
    const [{ title, author, lines }] = res.data;
    let poem = lines.join("\r\n");

    if (poem.length > MAX_SIZE) {
      poem = `${poem.substring(0, MAX_SIZE)}${TRUNCATION_MESSAGE}`;
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(poem)
      .addFields(link_to_text(title))
      .setFooter(`by ${author}`);

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    message.channel.send("oops, something went wrong");
  }
};

function link_to_text(title) {
  return {
    name: "Full Text",
    value: encodeURI(
      `https://poetrydb.org/title/${title}/author,title,lines.text`
    ),
  };
}
