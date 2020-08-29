const db = require("../db/db-model");
const infractions = require("../db/infraction-model");
const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
  const [mode] = args;

  switch (mode) {
    case "list":
    case "view":
      view_infractions(args, message);
      break;

    default:
      lodge_infraction(args, message);
  }
};

async function view_infractions(args, message) {
  const [mode, userID] = args;

  const user_infractions = await infractions.fetch(userID);
  console.log(user_infractions);

  if (user_infractions.length) {
    const infraction_embed = new Discord.MessageEmbed()
      .setTitle(`${user_infractions[0].username}'s infractions:`)
      .addFields(
        user_infractions.map((infraction) => {
          return {
            name: infraction.description,
            value: `reported by: ${infraction.reported_by}`,
          };
        })
      )
      .setFooter(`${user_infractions[0].infractions} total infraction(s)`);

    message.channel.send(infraction_embed);
  } else {
    message.reply("This user has no infractions!");
  }
}

async function lodge_infraction(args, message) {
  const userID = args[0];
  const description = args.slice(1).join(" ");

  try {
    // lookup user in infractions table
    const [user_infractions] = await db.findBy("infractions", {
      user_fk: userID,
    });

    // if no user_infractions, initialize infraction count
    if (!user_infractions) {
      await db.update("users", { infractions: 1 }, { id: userID });
    } else {
      const [user] = await db.findBy("users", { id: userID });

      await db.update(
        "users",
        { infractions: user.infractions + 1 },
        { id: userID }
      );
    }

    const infraction_data = {
      user_fk: userID,
      reported_by: message.author.username,
      description,
    };

    await db.insert("infractions", infraction_data);

    message.reply("Infraction successfully lodged");
  } catch (error) {
    console.error(error);
    message.reply("Error lodging infraction");
  }
}
