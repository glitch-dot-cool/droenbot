const db = require("./db-config.js");

function find(table, limit) {
  if (!limit) {
    return db(table);
  } else {
    return db(table).limit(limit);
  }
}

function findBy(table, filter) {
  return db(table).where(filter);
}

async function insert(table, data) {
  const [id] = await db(table).insert(data);

  return await findBy(table, { id });
}

function remove(table, filter) {
  return db(table).where(filter).delete();
}

async function update(table, data, filter) {
  await db(table).where(filter).update(data);
  return await db(table).where(filter);
}

function closeConnection() {
  return db.destroy();
}

module.exports = {
  find,
  findBy,
  insert,
  remove,
  update,
  closeConnection,
};
