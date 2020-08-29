const db = require("../db/db-model");

exports.run = async (bot, message, args) => {
  const userID = args[0];
  const description = args.slice(1).join(" ");

  try {
    // lookup user in infractions table
    const [user] = await db.findBy("users", { discord_id: userID });
    const [user_infractions] = await db.findBy("infractions", {
      user_fk: user.id,
    });

    // if no user_infractions, initialize infraction count
    if (!user_infractions) {
      await db.update("users", { infractions: 1 }, { id: user.id });
    } else {
      await db.update(
        "users",
        { infractions: user.infractions + 1 },
        { id: user.id }
      );
    }

    const infraction_data = {
      user_fk: user.id,
      reported_by: message.author.id,
      description,
    };

    await db.insert("infractions", infraction_data);

    message.reply("Infraction successfully lodged");
  } catch (error) {
    message.reply("Error lodging infraction");
  }
};
