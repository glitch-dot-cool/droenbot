const path = require("path");

module.exports = {
  development: {
    client: "sqlite3",
    useNullAsDefault: true, // needed for sqlite
    connection: {
      filename: path.resolve(__dirname, "./data/droenbot_dev.db3"),
    },
    migrations: {
      directory: path.resolve(__dirname, "./data/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./data/seeds"),
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
      },
    },
  },
  production: {
    client: "sqlite3",
    useNullAsDefault: true, // needed for sqlite
    connection: {
      filename: path.resolve(__dirname, "./data/droenbot.db3"),
    },
    migrations: {
      directory: path.resolve(__dirname, "./data/migrations"),
    },
    seeds: {
      directory: path.resolve(__dirname, "./data/seeds"),
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done); // turn on FK enforcement
      },
    },
  },
};
