const Discord = require("discord.js");
const express = require("express");
const { execSync } = require("child_process");
const colors = require("colors");
const config = require("./config.json");
const ascii = require("./droenArt.js");
const { update_user_message_count } = require("./db/user-model");
const { validate_github_webhook } = require("./utils/validate_github_webhook");

const server = express();
const PORT = 3000;
server.use(express.json());

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
  // ignore messages posted by bots
  if (message.author.bot) {
    return;
  }

  update_user_message_count(message.author.id, message);

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

server.post("/webhooks/github", validate_github_webhook, async (req, res) => {
  try {
    res.status(200).end();
    // update bot
    execSync(`(git pull origin master && forever restart bot.js)`);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update and restart bot",
      error: error.toString(),
    });
    console.error(error.red);
  }
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
