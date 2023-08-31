const config = require("../config.json");

function role_check(bot, message, role_name = "staff") {
  let is_member;

  if (message.channel.type === "DM") {
    const user_id = message.author.id;
    const guild = bot.guilds.cache.get(config.server_id);
    const role = guild.roles.cache.find((role) => role.name === role_name);

    if (!role) {
      return false;
    } else {
      is_member = role.members.has(user_id);
    }
  } else {
    is_member = message.member.roles.cache.some(
      (role) => role.name === role_name
    );
  }

  return is_member;
}

module.exports = role_check;
