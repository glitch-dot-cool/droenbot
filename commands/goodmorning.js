exports.run = (bot, message, args) => {
  const day_images = [
    ":coffee:",
    ":tea:",
    ":sunrise_over_mountains:",
    ":sun_with_face:",
    ":sunrise:",
  ];

  const random_idx = Math.floor(Math.random() * day_images.length);

  message.channel.send(
    `Good morning, ${message.author}! ${day_images[random_idx]} `
  );
};
