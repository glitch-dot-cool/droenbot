const Discord = require("discord.js");
const yargs = require("yargs");
let vsts = require("../data/vsts.json");

exports.run = async (bot, message, args) => {
  const valid_platforms = ["windows", "mac", "linux"];
  const arguments = yargs.parse(args);
  vsts = Object.values(vsts);

  // help options
  if (arguments.info) {
    const info_embed = new Discord.MessageEmbed()
      .setTitle("Info for `!vst` command:")
      .setDescription(
        "Draws a random VST from a static collection of around 1,400 random VSTs from KVR. You can supply flags to narrow down the selection."
      )
      .addField("Basic Usage:", "`!vst`")
      .addField("Filter by Operating System:", "`!vst --platform linux`")
      .addField("Filter by Tag:", "`!vst --tag flanger`")
      .setFooter(
        "Note: there are not that many VSTs, so obscure tags will likely not produce results"
      );

    message.channel.send({ embeds: [info_embed] });
    return;
  }

  // if a platform is given, attempt to filter by it
  if (arguments.platform) {
    // warn if platform is invalid
    if (!valid_platforms.includes(arguments.platform)) {
      const invalid_platform_embed = new Discord.MessageEmbed()
        .setTitle("Invalid Platform")
        .setDescription("Call `!vst --info` for command options and syntax.")
        .addField("Valid Platforms:", "`windows`, `mac`, or `linux`")
        .addField("Syntax:", "`!vst --platform linux`");

      message.channel.send({ embeds: [invalid_platform_embed] });
      return;
    }

    // if platform is valid, filter for it
    vsts = vsts.filter((vst) =>
      vst.platforms.some((platform) =>
        platform.includes(title_case(arguments.platform))
      )
    );
  }

  // if a tag is provided, filter for it
  if (arguments.tag) {
    vsts = vsts.filter((vst) =>
      vst.tags.some((tag) =>
        tag.toLowerCase().includes(arguments.tag.toLowerCase())
      )
    );
  }

  // no results found condition
  if (!vsts.length) {
    message.reply("No VSTs found with your search parameters.");
    return;
  }

  // select random vst
  const random_index = Math.floor(Math.random() * vsts.length);
  const vst = vsts[random_index];

  // generate & send result embed
  const embed = new Discord.MessageEmbed()
    .setTitle("Here's your random VST:")
    .setDescription(vst.description)
    .addField("Platforms:", make_list(vst.platforms))
    .addField("Formats:", make_list(vst.formats))
    .addField("Tags:", make_list(vst.tags))
    .addField("Download:", `[download](${vst.downloadLinks[0]})`)
    .setFooter(`Developed by ${vst.developer}`);

  message.channel.send({ embeds: [embed] });
};

// utility for making comma-separated lists
function make_list(array) {
  let string = "";
  array.forEach((item, idx) => {
    if (idx < array.length - 1) {
      return (string += `${item}, `);
    } else {
      return (string += item);
    }
  });

  return string;
}

// utility for title-casing strings
function title_case(string) {
  return string
    .toLowerCase()
    .split("")
    .map((char, idx) => {
      if (idx === 0) {
        return char.toUpperCase();
      } else return char;
    })
    .join("");
}
