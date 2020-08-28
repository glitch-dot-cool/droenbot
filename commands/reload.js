exports.run = (client, message, args) => {
  const mod_role = message.member.roles.cache.some(
    (role) => role.name === "mod"
  );

  if (!mod_role) {
    return message.reply(
      "You do not have sufficient permissions to use this command."
    );
  }

  if (!args.length)
    return message.reply("Must provide a command name to reload.");
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`The command ${args[0]} has been reloaded`);
};
