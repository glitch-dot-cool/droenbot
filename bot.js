const Discord = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const ascii = require("./droenArt.js");

const bot = new Discord.Client();

bot.login(config.token);

bot.on("ready", () => {
  console.log(ascii.cyan);
  bot.user.setActivity("with my code");
});

bot.on("debug", (err) => console.info(err.grey));
bot.on("warn", (err) => console.warn(err.yellow));
bot.on("error", (err) => console.error(err.red));

bot.on("message", (message) => {
  // check if message doesn't contain command prefix or if author is bot
  if (!message.content.startsWith(config.prefix) || message.author.bot) {
    return;
  }

  // slice out arguments from command string
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  // shift command out of args array, lowercase to make case-insensitive
  const command = args.shift().toLowerCase().replace("/", "");

  try {
    const commandFile = require(`./commands/${command}.js`);
    commandFile.run(bot, message, args);
  } catch (error) {
    console.error(error.red);
  }
});
