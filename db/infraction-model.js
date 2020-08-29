const db = require("./db-config.js");

function fetch(userID) {
  return db("users as u")
    .join("infractions as i", { user_fk: "u.id" })
    .select(
      "u.username",
      "u.infractions",
      "i.description",
      "i.reported_by",
      "i.id"
    )
    .where({ user_fk: userID });
}

async function remove(infractionID) {
  const [infraction] = await db("infractions").where({ id: infractionID });
  const [user] = await db("users").where({ id: infraction.user_fk });

  await db("users")
    .where({ id: infraction.user_fk })
    .update({ infractions: user.infractions - 1 });

  await db("infractions").where({ id: infractionID }).delete();
}

module.exports = { fetch, remove };
