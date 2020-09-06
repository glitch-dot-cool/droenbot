const Discord = require("discord.js");
const yargs = require("yargs");
const axios = require("axios");

exports.run = async (bot, message, args) => {
  const arguments = yargs.parse(args);
  let { _: query, $0: self, ...params } = arguments;
  query = query.join(" ");

  // --info help text
  if (arguments.info) {
    const info_embed = new Discord.MessageEmbed()
      .setTitle("Info for `!image` command:")
      .setDescription("Fetches images via the Creative Commons API")
      .addField("Basic Usage:", "`!image birds`")
      .addField("Filter by Format:", "`!image birds --extension jpg`")
      .addField(
        "Filter by Size:",
        "`!image birds --size large`\n valid sizes:\n`small`, `medium`, `large`"
      )
      .addField(
        "Filter by License Type:",
        "`!image birds --license_type commercial`\n valid license types:\n`commercial`, `modification`, `all-cc`, `all`"
      )
      .addField(
        "Filter by Category:",
        "`!image birds --categories illustration`\n valid categories:\n`illustration`, `photograph`, or `digitized_artwork`"
      );

    message.channel.send(info_embed);
    return;
  }

  // warn if no query provided
  if (!query) {
    message.reply(
      "You must provide a search term!\nTry calling `!image --info` for usage information."
    );
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
