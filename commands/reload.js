exports.run = (client, message, args) => {
  const mod = message.guild.roles.find((role) => role.name === "mod");

  if (!message.member.roles.has(mod.id)) {
    return message.reply(
      "You do not have sufficient permissions to use this command."
    );
  }

  if (!args || args.size < 1)
    return message.reply("Must provide a command name to reload.");
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`The command ${args[0]} has been reloaded`);
};
