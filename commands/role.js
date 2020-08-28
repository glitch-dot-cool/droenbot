exports.run = async (bot, message, args) => {
  const [role_name] = args;
  const restricted_roles = ["mod", "glitch.cool"];

  if (!restricted_roles.includes(role_name) && !role_name.includes("admin")) {
    const role = message.guild.roles.cache.find(
      (role) => role.name === role_name
    );

    if (!role) {
      message.reply("Sorry, this role doesn't exist.");
      return;
    }

    const member = await message.guild.members.fetch(message.author.id);
    member.roles.add(role);
    message.reply(
      `Successfully assigned you the ${role_name} role :white_check_mark:`
    );
  } else {
    message.reply("Sorry, this role is restricted.");
  }
};
