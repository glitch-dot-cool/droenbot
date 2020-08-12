const Discord = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const ascii = require("./droenArt.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./users.sqlite");

const bot = new Discord.Client();

bot.login(config.token);

bot.on("ready", () => {
  console.log(ascii.cyan);
  bot.user.setActivity("with my code");
  setup_db();
});

bot.on("debug", (err) => console.info(err.grey));
bot.on("warn", (err) => console.warn(err.yellow));
bot.on("error", (err) => console.error(err.red));

bot.on("message", (message) => {
  // ignore messages posted by bots
  if (message.author.bot) {
    return;
  }

  update_score(message);

  command_handler(message);
});

function setup_db() {
  // check if the table exists
  const table = sql
    .prepare(
      "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='users';"
    )
    .get();

  if (!table["count(*)"]) {
    // if there's no table, create it
    sql
      .prepare(
        "CREATE TABLE users (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);"
      )
      .run();

    // set constraints and parameters
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON users (id);").run();
    sql.pragma("syncronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // create and store db helpers for getting/setting scores
  bot.getScore = sql.prepare(
    "SELECT * FROM users WHERE user = ? AND guild = ?"
  );

  bot.setScore = sql.prepare(
    "INSERT OR REPLACE INTO users (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);"
  );
}

function update_score(message) {
  // prevent points from accruing via DMs w/ bot
  if (message.guild) {
    let score = bot.getScore.get(message.author.id, message.guild.id);

    // if no score for user, initialize it
    if (!score) {
      score = {
        id: `${message.guild.id}-${message.author.id}`,
        user: message.author.id,
        guild: message.guild.id,
        points: 0,
        level: 1,
      };
    }

    score.points++;
    console.log(score);

    const current_level = Math.floor(0.1 * Math.sqrt(score.points));

    if (score.level < current_level) {
      score.level++;
      message.reply(
        `You've leveled up to level **${current_level}** which confers absolutely no power and doesn't really do or mean anything`
      );
    }
    bot.setScore.run(score);
  }
}

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
