const crypto = require("crypto");
const bufferEq = require("buffer-equal-constant-time");
const { github_secret } = require("../config.json");

const validate_github_webhook = (req, res, next) => {
  const { headers } = req;
  const { ref: branch } = req.body;
  const local_hash = hash_secret(github_secret, JSON.stringify(req.body));
  const remote_hash = `sha1=${headers["X-Hub-Signature"]}`;

  if (branch.includes("master") && verify_signatures(local_hash, remote_hash)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const hash_secret = (secret, payload) => {
  return `sha1=${crypto
    .createHmac("sha1", secret)
    .update(payload)
    .digest("hex")}`;
};

const verify_signatures = (buffer1, buffer2) => {
  const a = Buffer.from(buffer1);
  const b = Buffer.from(buffer2);

  if (bufferEq(a, b)) {
    return true;
  } else {
    // unauthorized
    return false;
  }
};

module.exports = { validate_github_webhook };
