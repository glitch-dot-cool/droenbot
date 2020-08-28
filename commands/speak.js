const role_check = require("../utils/role_check");

exports.run = (bot, message, args) => {
  const is_mod = role_check(bot, message, "glitch.cool");

  if (is_mod) {
    const text = args.join(" ");
    if (message.channel.type !== "dm") {
      message.delete();
    }
    message.channel.send(text);
  } else {
    message.reply("Sorry, you don't have permission to use this command");
  }
};
