const db = require("./db-config.js");

function fetch(userID) {
  return db("users as u")
    .join("infractions as i", { user_fk: "u.id" })
    .select("u.username", "u.infractions", "i.description", "i.reported_by")
    .where({ user_fk: userID });
}

module.exports = { fetch };
