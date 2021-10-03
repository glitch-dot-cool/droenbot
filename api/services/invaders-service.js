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
    return await db.find("invaders_scores", 10, "score");
  } catch (error) {
    console.error(error);
    return { error, message: "aw shit something broke" };
  }
};

module.exports = {
  insert_high_score,
  get_high_scores,
};
