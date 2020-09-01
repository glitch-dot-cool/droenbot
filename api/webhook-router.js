const { exec } = require("child_process");
const path = require("path");
const router = require("express").Router();
const { validate_github_webhook } = require("../utils/middleware");

router.post("/github", validate_github_webhook, async (req, res) => {
  try {
    res.status(200).end();
    // run update script
    exec(
      `bash ${path.resolve(__dirname, "../scripts/update.sh")}`,
      (err, stout, sterr) => {
        if (!err) {
          res
            .status(500)
            .json({ message: "Failed to update bot.", error: sterr });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Failed to update and restart bot",
      error: error.toString(),
    });
    console.error(error.red);
  }
});

module.exports = router;
