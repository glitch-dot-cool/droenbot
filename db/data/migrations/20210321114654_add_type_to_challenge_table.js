exports.up = function (knex) {
  return knex.schema.table("challenges", (tbl) => {
    tbl.string("type").notNullable().defaultTo("");
  });
};

exports.down = function (knex) {
  return knex.schema.table("challanges", (tbl) => {
    tbl.dropColumn("type");
  });
};
