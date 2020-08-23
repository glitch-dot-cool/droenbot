const db = require('./db-config.js');

function find(table) {
  return db(table);
}

function findBy(table, filter) {
  return db(table).where(filter).first();
}

async function insert(table, data) {
  const [id] = await db(table).insert(data);

  return await findBy(table, { id });
}

function remove(table, filter) {
  return db(table).where(filter).delete();
}

function update(table, data, filter) {
  return db(table).where(filter).update(data);
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
