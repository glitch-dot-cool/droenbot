const Discord = require("discord.js");
const axios = require("axios");
const yargs = require("yargs");
const { freesound_token } = require("../config.json");

exports.run = async (bot, message, args) => {
  const arguments = yargs.parse(args);
  const query = arguments._.join(" ");
  const limit = arguments.limit || 15;
  const page = arguments.page || 1;
  const group = arguments.group ? 1 : 0;

  const {
    data: { results },
  } = await axios.get(
    `https://freesound.org/apiv2/search/text/?query=${query}&token=${freesound_token}&page=${page}&group_by_pack=${group}`
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
    .setDescription("Try calling `!sample --help` for options")
    .addFields(
      results.slice(0, limit).map((sample) => {
        return { name: sample.name, value: `[download](${sample.url})` };
      })
    )
    .setFooter("results from freesound.org");

  message.channel.send(embed);
};
