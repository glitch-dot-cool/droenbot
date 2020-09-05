const Discord = require("discord.js");
const axios = require("axios");
const yargs = require("yargs");
const { freesound_token } = require("../config.json");

exports.run = async (bot, message, args) => {
  const arguments = yargs.parse(args);
  const query = arguments._.join(" ");
  const limit = arguments.limit || 15;

  const {
    data: { results },
  } = await axios.get(
    `https://freesound.org/apiv2/search/text/?query=${query}&token=${freesound_token}`
  );

  // make + append url field
  results.map(
    (sample) =>
      (sample.url = `https://freesound.org/people/${sample.username}/sounds/${
        sample.id
      }/download/${sample.id}__${sample.username}__${encodeURI(sample.name)}`)
  );

  const embed = new Discord.MessageEmbed()
    .setTitle("Search Results:")
    .addFields(
      results.slice(0, limit).map((sample) => {
        return { name: sample.name, value: sample.url };
      })
    )
    .setFooter("results from freesound.org");

  message.channel.send(embed);
};
