const Discord = require("discord.js");
const invaders_service = require("../api/services/invaders-service");

exports.run = async (bot, message, args) => {
  try {
    const top_scores = await invaders_service.get_high_scores();
    const embed = new Discord.MessageEmbed()
      .setTitle("g̶l̴i̷t̷c̴h̵_̷i̴n̶v̵a̷d̸e̶r̵s̵ high scores")
      .setColor("#212121")
      .setURL("https://glitch-dot-cool.github.io/glitch-invaders/")
      .setThumbnail(
        "https://cdn.discordapp.com/emojis/614926224103571487.png?size=96"
      )
      .addFields(
        top_scores.map((score) => {
          return {
            name: score.discord_user,
            value: `score: ${score.score} | level reached: ${score.level_reached}`,
          };
        })
      )
      .setFooter(
        "play it at https://glitch-dot-cool.github.io/glitch-invaders/"
      );
    message.channel.send(embed);
  } catch (error) {
    message.channel.send(
      "failed to fetch leaderboard data, cc: <@254686973766139904>"
    );
  }
};
