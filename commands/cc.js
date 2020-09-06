const Discord = require("discord.js");
const yargs = require("yargs");
const axios = require("axios");

exports.run = async (bot, message, args) => {
  const arguments = yargs.parse(args);
  let { _: query, $0: self, ...params } = arguments;
  query = query.join(" ");

  // warn if no query provided
  if (!query) {
    message.reply("You must provide a search term!");
    return;
  }

  let url = `https://api.creativecommons.engineering/v1/images/?q=${encodeURI(
    query
  )}`;
  // append filters to query string
  for (const key in params) {
    url = append_to_url(url, `${key}=${params[key]}`);
  }

  const {
    data: { results },
  } = await axios.get(url);

  // notify if no search results
  if (!results.length) {
    message.reply(`No search results found for your query: \`${query}\``);
    return;
  }

  const random_index = Math.floor(Math.random() * results.length);
  const random_image = results[random_index];

  const embed = new Discord.MessageEmbed()
    .setTitle(`Image Result for "${query}"`)
    .setImage(random_image.thumbnail)
    .addField("Title:", random_image.title)
    .addField(
      "Creator:",
      `[${random_image.creator}](${random_image.creator_url})`
    )
    .addField(
      "License:",
      `${random_image.license} v${random_image.license_version}`
    )
    .addField("Full Resolution Image:", random_image.url)
    .setFooter(
      `Image source: ${random_image.source}. Search powered by Creative Commons API.`
    );

  message.channel.send(embed);
};

function append_to_url(url, querystring) {
  return `${url}&${querystring}`;
}
