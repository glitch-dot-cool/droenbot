const Discord = require("discord.js");
const axios = require("axios");
const yargs = require("yargs");
const { freesound_token } = require("../config.json");

exports.run = async (bot, message, args) => {
  const arguments = yargs.parse(args);
  const limit = arguments.limit || 15;
  const help = arguments.info;

  if (help) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Options for `!sample` command:")
      .setDescription(
        "Searches freesound.org and returns downloads links to samples."
      )
      .addField("Basic Usage:", "`!sample drum machine`")
      .addField(
        "Add tag filters:",
        "`!samples drum machine --tag lofi --tag 808`"
      )
      .addField(
        "Skip to different result pages:",
        "`!sample drum machine --page 2`"
      )
      .addField("Limit results:", "`!sample drum machine --limit 3`")
      .addField("Group results by pack:", "`!sample drum machine --group`")
      .setFooter(
        "Tip: you can combine flags and you can search by multiple tags"
      );

    message.channel.send(embed);
    return;
  }

  const {
    data: { results },
  } = await axios.get(make_url(arguments));

  // make + append url field
  results.map(
    (sample) =>
      (sample.url = `https://freesound.org/people/${sample.username}/sounds/${
        sample.id
      }/download/${sample.id}__${sample.username}__${encodeURI(sample.name)}`)
  );

  const embed = new Discord.MessageEmbed()
    .setTitle("Search Results:")
    .setDescription("Try calling `!sample --info` for options")
    .addFields(
      results.slice(0, limit).map((sample) => {
        return { name: sample.name, value: `[download](${sample.url})` };
      })
    )
    .setFooter("results from freesound.org");

  message.channel.send(embed);
};

function make_url(args) {
  const query = args._.join(" ");
  const page = args.page || 1;
  const group = args.group ? 1 : 0;
  const tags = make_tag_filter(args.tag);

  let url = `https://freesound.org/apiv2/search/text/?query=${query}&token=${freesound_token}&page=${page}&group_by_pack=${group}`;

  if (tags) {
    url += tags;
  }

  return url;
}

function make_tag_filter(tags) {
  if (Array.isArray(tags)) {
    return tags.reduce((str, tag, idx) => {
      if (idx === 0) {
        str += `&filter=tag:${tag}`;
      } else {
        str += `%20tag:${tag}`;
      }
      return str;
    }, "");
  } else {
    return `&filter=tag:${tags}`;
  }
}
