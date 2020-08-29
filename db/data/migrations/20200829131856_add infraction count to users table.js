exports.up = function (knex) {
  return knex.schema.table("users", (tbl) => {
    tbl.integer("infractions").unsigned();
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", (tbl) => {
    tbl.dropColumn("infractions");
  });
};
