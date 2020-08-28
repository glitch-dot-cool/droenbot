const Discord = require("discord.js");
const db = require("../db/db-model");
const role_check = require("../utils/role_check");

exports.run = async (bot, message, args) => {
  const syntax = "`!motion [title]\n[description]\n[duration in hours]`";
  const is_member = role_check(bot, message, "glitch.cool");

  if (!is_member) {
    message.reply("Sorry, you don't have permission to use this command.");
    return;
  }

  // list motions
  if (args[0] === "list") {
    // 25 is the max number of fields in embeds
    const motions = await db.find("votes", 25, "id");

    const embed = new Discord.MessageEmbed()
      .setTitle("List of Motions:")
      .addFields(
        motions.map((motion) => {
          return {
            name: motion.title,
            value: `ID: ${motion.id}`,
          };
        })
      );

    message.channel.send(embed);
  }
  // view a single motion
  else if (args[0] === "view") {
    const [command, id] = args;
    const [motion] = await db.findBy("votes", { id });

    const embed = new Discord.MessageEmbed()
      .setTitle(motion.title)
      .addFields(
        { name: "Description", value: motion.description },
        { name: "Yeas:", value: motion.votes_for },
        { name: "Nays:", value: motion.votes_against },
        {
          name: "Voting Instructions:",
          value: `DM @droenbot w/ the command \`!vote ${motion.id} yea/nay\``,
        }
      )
      .setFooter(`Vote Expiration: ${new Date(motion.expiry).toISOString()}`);

    message.channel.send(embed);
  } else {
    const [title, description, duration] = args.slice(0).join(" ").split("\n");
    // create a motion
    if (description === undefined) {
      message.reply(
        `Please provide a description for the motion. \n Syntax: ${syntax}`
      );
    } else if (isNaN(Number(duration)) || duration === undefined) {
      message.reply(
        `Please provide a duration for the motion in hours.\n Syntax: ${syntax}`
      );
    } else {
      const expiry = add_hours(new Date(), duration);

      const [vote_data] = await db.insert("votes", {
        title,
        description,
        expiry,
        votes_for: 0,
        votes_against: 0,
      });

      const vote_embed = new Discord.MessageEmbed()
        .setTitle(`Motion to ${title}`)
        .setDescription(description)
        .addField(
          "Voting Instructions:",
          `DM @droenbot w/ the command \`!vote ${vote_data.id} yea/nay\``
        )
        .addField("Valid yea/nay commands", "yea, nay, y, n, yes, no")
        .setFooter(`Vote expires at ${expiry.toISOString()}`);

      message.channel.send(vote_embed);
    }
  }
};

function add_hours(date, hours) {
  return new Date(date.getTime() + hours * 3600000);
}
