const db = require("../db/db-model");
const role_check = require("../utils/role_check");

exports.run = async (bot, message, args) => {
  const syntax = `\`!vote 12 y\` or \`!vote 12 yea\``;
  const [id, vote] = args;

  const is_member = role_check(bot, message);

  if (!is_member) {
    message.reply(
      "Sorry, you don't have sufficient permissions to participate in votes."
    );
  } else if (message.channel.type !== "DM") {
    message.reply(
      `Votes must be cast privately - DM @droenbot with a vote like this: ${syntax}`
    );
  } else if (!id || !vote) {
    message.reply(
      `Invalid vote syntax - must include an \`id\` and a \`vote\` (y/n).\nEx. ${syntax}\nTry \`!motion list\` to view a list of motions and their ID values.`
    );
  } else {
    try {
      const vote_result = parse_vote(vote);

      if (!vote_result) {
        message.reply(
          "Invalid vote - use `y` or `yes` for yea, `n` or `no` for nay."
        );
        return;
      } else {
        const [motion] = await db.findBy("votes", { id });

        if (new Date(motion.expiry) < Date.now()) {
          message.reply("Sorry, this motion has expired.");
        }

        const vote_record = await db.findBy("vote_participants", {
          user_fk: message.author.id,
          vote_fk: id,
        });

        if (!vote_record.length) {
          await db.update(
            "votes",
            {
              votes_for: motion.votes_for + vote_result.votes_for,
              votes_against: motion.votes_against + vote_result.votes_against,
            },
            { id }
          );

          await db.insert("vote_participants", {
            user_fk: message.author.id,
            vote_fk: id,
          });

          message.reply("Successfully cast your vote.");
        } else {
          message.reply("You've already voted! You can't double-vote.");
        }
      }
    } catch (error) {
      message.reply(
        "Error casting vote - likely an invalid ID - call `!motion list` to view vote IDs."
      );
    }
  }
};

function parse_vote(vote) {
  const yes_votes = ["y", "yes", "yea", "yay"];
  const no_votes = ["n", "no", "nay", "nope"];
  const result = { votes_for: 0, votes_against: 0 };

  if (yes_votes.includes(vote)) {
    result.votes_for++;
  } else if (no_votes.includes(vote)) {
    result.votes_against++;
  } else {
    return null;
  }

  return result;
}
