exports.run = (bot, message, args) => {
  const night_images = [
    ":sleeping_accommodation:",
    ":night_with_stars:",
    ":sleeping:",
    ":full_moon_with_face:",
    ":new_moon_with_face:",
    ":zzz:",
  ];

  const random_idx = Math.floor(Math.random() * night_images.length);

  message.channel.send(
    `Goodnight, ${message.author}! Sweet dreams ${night_images[random_idx]} `
  );
};
