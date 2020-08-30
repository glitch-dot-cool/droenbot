exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.string("id").notNullable().unique().primary();
      tbl.string("username").notNullable().unique();
      tbl.timestamp("member_since").notNullable();
      tbl.integer("messages_sent").unsigned().notNullable();
      tbl.integer("level").unsigned().notNullable();
    })
    .createTable("infractions", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("description").notNullable();
      tbl.string("reported_by").notNullable();
    })
    .createTable("challenges", (tbl) => {
      tbl.increments();
      tbl.string("challenge_name").notNullable().unique();
      tbl.string("challenge_description").notNullable();
      tbl.timestamp("due_by").notNullable();
    })
    .createTable("votes", (tbl) => {
      tbl.increments();
      tbl.string("title").notNullable();
      tbl.string("description").notNullable();
      tbl.integer("votes_for");
      tbl.integer("votes_against");
    })
    .createTable("vote_participants", (tbl) => {
      tbl.increments();
      tbl
        .integer("user_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("vote_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("votes")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("polls", (tbl) => {
      tbl.increments();
      tbl.string("title").notNullable();
      tbl.string("description").notNullable();
    })
    .createTable("poll_options", (tbl) => {
      tbl.increments();
      tbl.string("option").notNullable();
      tbl.integer("count").unsigned().notNullable();
      tbl
        .integer("poll_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("polls")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("poll_participants", (tbl) => {
      tbl.increments();
      tbl
        .integer("poll_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("polls")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("user_fk")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("poll_participants")
    .dropTableIfExists("poll_options")
    .dropTableIfExists("polls")
    .dropTableIfExists("vote_participants")
    .dropTableIfExists("votes")
    .dropTableIfExists("challenges")
    .dropTableIfExists("infractions")
    .dropTableIfExists("users");
};
