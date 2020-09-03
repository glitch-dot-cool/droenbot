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

function get_top_channels(message_details, top_n_channels) {
  const channel_counts = {};

  message_details.forEach((entry) => {
    if (channel_counts[entry.channel_name]) {
      channel_counts[entry.channel_name] += entry.total_count;
    } else {
      channel_counts[entry.channel_name] = entry.total_count;
    }
  });

  // cast object to array of tuples, sort by msg count
  // filter out "bot-dev-spam" and "bot-spam" channels, and limit to top n results
  const result = Object.entries(channel_counts)
    .sort((a, b) => b[1] - a[1])
    .filter((entry) => entry[0] !== "bot-spam" && entry[0] !== "bot-dev-spam")
    .slice(0, top_n_channels);

  return result;
}

function get_top_users(message_details, top_n_users) {
  const user_counts = {};

  message_details.forEach((entry) => {
    if (user_counts[entry.username]) {
      user_counts[entry.username] += entry.total_count;
    } else {
      user_counts[entry.username] = entry.total_count;
    }
  });

  // cast object to array of tuples, sort by msg count and limit to top n results
  const result = Object.entries(user_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top_n_users);

  return result;
}

function get_media_counts(message_details) {
  const media_types = {
    audio: 0,
    video: 0,
    image: 0,
    code: 0,
  };

  message_details.forEach((entry) => {
    media_types.audio += entry.audio_count;
    media_types.video += entry.video_count;
    media_types.image += entry.image_count;
    media_types.code += entry.code_count;
  });

  return media_types;
}

module.exports = {
  check_message_type,
  get_top_channels,
  get_top_users,
  get_media_counts,
};
