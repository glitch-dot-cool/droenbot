const router = require("express").Router();
const { execSync } = require("child_process");
const { validate_github_webhook } = require("../utils/middleware");

router.post("/github", validate_github_webhook, async (req, res) => {
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

module.exports = router;
