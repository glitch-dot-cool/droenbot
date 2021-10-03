exports.up = function (knex) {
  return knex.schema.createTable("invaders_scores", (tbl) => {
    tbl.increments();
    tbl.integer("score").notNullable();
    tbl.integer("level_reached").notNullable();
    tbl
      .string("discord_user")
      .notNullable()
      .references("username")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("invaders_scores");
};
