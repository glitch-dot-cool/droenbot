exports.up = function (knex) {
  return knex.schema.createTable("message_details", (tbl) => {
    tbl.increments();
    tbl.integer("channel_id").unsigned().notNullable();
    tbl.string("channel_name").notNullable();
    tbl.integer("total_count").unsigned().notNullable();
    tbl.integer("image_count").unsigned().notNullable();
    tbl.integer("audio_count").unsigned().notNullable();
    tbl.integer("video_count").unsigned().notNullable();
    tbl.integer("code_count").unsigned().notNullable();
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
  return knex.schema.dropTableIfExists("message_details");
};
