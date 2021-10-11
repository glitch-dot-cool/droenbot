const { server_id } = require("../../config.json");
const bot = require("../../bot");
const db = require("../../db/db-model");

const insert_high_score = async ({ discord_user, score, level_reached }) => {
  try {
    return await db.insert("invaders_scores", {
      discord_user,
      score,
      level_reached,
    });
  } catch (error) {
    throw "username not recognized";
  }
};

const get_high_scores = async () => {
  try {
    const server = bot.client.guilds.cache.get(server_id);
    const leaderboard = await db.findByMaxValue(
      "invaders_scores",
      "score",
      5,
      "score",
      "desc",
      "discord_user"
    );

    const leaderboard_with_nicknames = await Promise.all(
      leaderboard.map(async (entry) => {
        const [[, user]] = await server.members.fetch({
          query: entry.discord_user,
          limit: 1,
        });

        const { id, max, ...entry_without_id } = entry;

        return {
          ...entry_without_id,
          discord_user: user.nickname || entry.discord_user,
        };
      })
    );

    return leaderboard_with_nicknames;
  } catch (error) {
    console.error(error);
    throw "failed to fetch leaderboard data";
  }
};

const _delete_all_scores = async () => {
  await db.remove("invaders_scores", true);
};

module.exports = {
  insert_high_score,
  get_high_scores,
  _delete_all_scores,
};
