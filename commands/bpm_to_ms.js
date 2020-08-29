const Discord = require("discord.js");

exports.run = (bot, message, args) => {
  let [subdivision, bpm] = args;
  let list = "";
  let subdivisions = {
    "1/2": 0.5,
    "1/3": 0.33334,
    "1/4": 0.25,
    "1/6": 0.16667,
    "1/8": 0.125,
    "1/12": 0.08333,
    "1/16": 0.0625,
    "1/24": 0.04167,
    "1/32": 0.03125,
    "1/48": 0.02083,
    "1/64": 0.015625,
  };

  if (
    subdivision === "list" ||
    subdivision === "help" ||
    subdivision === undefined
  ) {
    Object.keys(subdivisions).forEach((sub) => (list += `${sub}\n`));

    const list_embed = new Discord.MessageEmbed()
      .setTitle("List of subdivisons:")
      .setDescription(list);

    message.channel.send(list_embed);
  } else if (subdivisions[subdivision] === undefined) {
    message.reply(
      "Please provide a supported subdivision. Call `!bpm_to_ms list` to see a list of valid subdivisions."
    );
  } else {
    const result = (60000 / Number(bpm)) * (subdivisions[subdivision] * 4);
    const result_embed = new Discord.MessageEmbed()
      .setTitle(`A ${subdivision} note at ${bpm} equals:`)
      .setDescription(`${result}ms`);

    message.channel.send(result_embed);
  }
};
