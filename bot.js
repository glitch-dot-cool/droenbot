const Discord = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const ascii = require("./droenArt.js");
const { setup_db, update_score } = require("./db.js");

const bot = new Discord.Client();

bot.login(config.token);

bot.on("ready", () => {
  console.log(ascii.cyan);
  bot.user.setActivity("with my code");
  setup_db(bot);
});

bot.on("debug", (err) => console.info(err.grey));
bot.on("warn", (err) => console.warn(err.yellow));
bot.on("error", (err) => console.error(err.red));

bot.on("message", (message) => {
  // ignore messages posted by bots
  if (message.author.bot) {
    return;
  }

  update_score(bot, message);

  command_handler(message);
});

function command_handler(message) {
  // ignore non-commands
  if (!message.content.startsWith(config.prefix)) {
    return;
  }

  // slice out arguments from command string
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  // shift command out of args array, lowercase to make case-insensitive
  const command = args.shift().toLowerCase().replace("/", "");

  try {
    const command_file = require(`./commands/${command}.js`);
    command_file.run(bot, message, args);
  } catch (error) {
    console.error(error.red);
  }
}
