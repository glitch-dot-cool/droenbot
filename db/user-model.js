const db = require("./db-model");

const get_user_message_count = async (discord_id) => {
  try {
    const [{ messages_sent }] = await db.findBy("users", { discord_id });
    return messages_sent;
  } catch (error) {
    console.error(error);
  }
};

const update_user_message_count = async (discord_id, message) => {
  // prevent points from accruing via DMs to bot
  if (message.guild) {
    const message_type = check_message_type(message);
    let [user] = await db.findBy("users", { discord_id });

    // if no entry for user, create one
    if (!user) {
      const userData = {
        discord_id: message.author.id,
        username: message.author.username,
        member_since: new Date(message.member.joinedAt),
        messages_sent: 1,
        level: 1,
      };

      [user] = await db.insert("users", userData);
    } else {
      await db.update(
        "users",
        { messages_sent: user.messages_sent + 1 },
        { id: user.id }
      );
    }

    const user_message_details = await db.findBy("message_details", {
      user_fk: user.id,
    });

    const channel_message_details = user_message_details.filter(
      (channel) => channel.channel_id === Number(message.channel.id)
    );

    // if no user_message_details for the channel, initialize it
    if (!channel_message_details.length) {
      const messageData = {
        user_fk: user.id,
        channel_id: message.channel.id,
        channel_name: message.channel.name,
        total_count: 1,
        image_count: message_type.image,
        audio_count: message_type.audio,
        video_count: message_type.video,
        code_count: message_type.code,
      };

      await db.insert("message_details", messageData);
    } else {
      const [existing] = channel_message_details;

      await db.update(
        "message_details",
        {
          total_count: existing.total_count + 1,
          image_count: existing.image_count + message_type.image,
          audio_count: existing.audio_count + message_type.audio,
          video_count: existing.video_count + message_type.video,
          code_count: existing.code_count + message_type.code,
        },
        { user_fk: user.id, channel_id: message.channel.id }
      );
    }
  }
};

function check_message_type(message) {
  const audio_formats = ["wav", "mp3", "flac", "aiff", "ogg"];
  const video_formats = ["mp4", "mov", "webm", "mkv", "gifv", "avi", "wmv"];
  const img_formats = [
    "jpg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "webp",
    "heif",
    "svg",
  ];
  const code_formats = [
    ".js",
    ".py",
    "jsx",
    "html",
    "css",
    ".ts",
    "tsx",
    "cpp",
    "glsl",
    "java",
    ".rb",
    ".cs",
    ".rs",
    ".go",
    ".pd",
    "amxd",
    "mxt",
    "ens",
    "tox",
    "toe",
  ];

  const counts = {
    image: 0,
    audio: 0,
    video: 0,
    code: 0,
  };

  // check attachments
  message.attachments.forEach((attachment) => {
    const last_three = get_last_n_characters(attachment.name, 3);
    const last_four = get_last_n_characters(attachment.name, 4);

    if (img_formats.includes(last_three) || img_formats.includes(last_four)) {
      counts.image++;
    } else if (
      audio_formats.includes(last_three) ||
      audio_formats.includes(last_four)
    ) {
      counts.audio++;
    } else if (
      video_formats.includes(last_three) ||
      video_formats.includes(last_four)
    ) {
      counts.video++;
    } else if (
      code_formats.includes(last_three) ||
      code_formats.includes(last_four)
    ) {
      counts.code++;
    }
  });

  // check if msg text is a code block
  if (message.content.includes("```")) {
    counts.code++;
  }

  return counts;
}

function get_last_n_characters(string, n) {
  return string.substring(string.length - n, string.length);
}

module.exports = {
  get_user_message_count,
  update_user_message_count,
};
