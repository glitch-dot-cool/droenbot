const Discord = require("discord.js");
let vsts = require("../data/vsts.json");

exports.run = async (bot, message, args) => {
  vsts = Object.entries(vsts);
  const random_index = Math.floor(Math.random() * vsts.length);
  const [_, vst] = vsts[random_index];

  const embed = new Discord.MessageEmbed()
    .setTitle("Here's your random VST:")
    .setDescription(vst.description)
    .addField("Platforms:", make_list(vst.platforms))
    .addField("Formats:", make_list(vst.formats))
    .addField("Tags:", make_list(vst.tags))
    .addField("Download:", `[download](${vst.downloadLinks[0]})`)
    .setFooter(`Developed by ${vst.developer}`);

  message.channel.send(embed);
};

function make_list(array) {
  let string = "";
  array.forEach((item, idx) => {
    if (idx < array.length - 1) {
      return (string += `${item},`);
    } else {
      return (string += item);
    }
  });

  return string;
}
