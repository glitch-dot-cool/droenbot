const db = require("./db-config.js");
const db_model = require("./db-model");
const {
  check_message_type,
  get_top_channels,
  get_top_users,
  get_media_counts,
} = require("../utils/user-model-utils");

const get_user_message_count = async (id) => {
  try {
    const [user] = await db_model.findBy("users", { id });
    const message_details = await db_model.findBy("message_details", {
      user_fk: user.id,
    });
    return { user, message_details };
  } catch (error) {
    console.error(error);
  }
};

const update_user_message_count = async (id, message) => {
  // prevent points from accruing via DMs to bot
  if (message.guild) {
    const message_type = check_message_type(message);
    let [user] = await db_model.findBy("users", { id });

    // if no entry for user, create one
    if (!user) {
      const userData = {
        id: message.author.id,
        username: message.author.username,
        member_since: new Date(message.member.joinedAt),
        messages_sent: 1,
        level: 1,
      };

      [user] = await db_model.insert("users", userData);
    } else {
      await db_model.update(
        "users",
        { messages_sent: user.messages_sent + 1 },
        { id: message.author.id }
      );
    }

    const user_message_details = await db_model.findBy("message_details", {
      user_fk: message.author.id,
    });

    const channel_message_details = user_message_details.filter(
      (channel) => channel.channel_id === Number(message.channel.id)
    );

    // if no user_message_details for the channel, initialize it
    if (!channel_message_details.length) {
      const messageData = {
        user_fk: message.author.id,
        channel_id: message.channel.id,
        channel_name: message.channel.name,
        total_count: 1,
        image_count: message_type.image,
        audio_count: message_type.audio,
        video_count: message_type.video,
        code_count: message_type.code,
      };

      await db_model.insert("message_details", messageData);
    } else {
      const [existing] = channel_message_details;

      await db_model.update(
        "message_details",
        {
          total_count: existing.total_count + 1,
          image_count: existing.image_count + message_type.image,
          audio_count: existing.audio_count + message_type.audio,
          video_count: existing.video_count + message_type.video,
          code_count: existing.code_count + message_type.code,
        },
        { user_fk: message.author.id, channel_id: message.channel.id }
      );
    }
  }
};

const get_server_stats = async () => {
  const message_details = await db("users as u").join("message_details", {
    user_fk: "u.id",
  });

  const total_messages = message_details.reduce(
    (sum, user) => (sum += user.total_count),
    0
  );

  const top_channels = get_top_channels(message_details, 10);
  const top_users = get_top_users(message_details, 10);
  const media_counts = get_media_counts(message_details);

  return {
    top_channels,
    top_users,
    total_messages,
    media_counts,
  };
};

module.exports = {
  get_user_message_count,
  update_user_message_count,
  get_server_stats,
};
