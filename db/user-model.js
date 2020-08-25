const db = require("./db-model");

const get_user_message_count = async (discord_id) => {
  try {
    const { messages_sent } = await db.findBy("users", { discord_id });
    return messages_sent;
  } catch (error) {
    console.error(error);
  }
};

const update_user_message_count = async (discord_id, message) => {
  // prevent points from accruing via DMs to bot
  if (message.guild) {
    const [user] = await db.findBy("users", { discord_id });
    // if no entry for user, create one
    if (!user) {
      const userData = {
        discord_id: message.author.id,
        username: message.author.username,
        member_since: new Date(message.member.joinedAt),
        messages_sent: 1,
        level: 1,
      };

      await db.insert("users", userData);
    } else {
      await db.update(
        "users",
        { messages_sent: user.messages_sent + 1 },
        { id: user.id }
      );
    }
  }
};

module.exports = {
  get_user_message_count,
  update_user_message_count,
};
