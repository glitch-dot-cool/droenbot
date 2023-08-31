const role_check = require("../utils/role_check");

exports.run = (bot, message, args) => {
  const is_mod = role_check(bot, message);

  if (!is_mod) {
    message.reply({
      content: "Sorry, you don't have permission to use this command",
    });
    return;
  }

  const text = args.join(" ");
  if (message.channel.type !== "DM") {
    message.delete();
  }
  message.channel.send({ content: text });
};
