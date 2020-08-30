const { github_secret } = require("../config.json");

const validate_github_webhook = (req, res, next) => {
  const { ref: branch, secret } = req.body;
  console.log(typeof secret, typeof github_secret, github_secret);

  if (branch.includes("master") && secret === github_secret) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { validate_github_webhook };
