exports.up = function (knex) {
  return knex.schema.table("votes", (tbl) => {
    tbl.timestamp("expiry");
  });
};

exports.down = function (knex) {
  return knex.schema.table("votes", (tbl) => {
    tbl.dropColumn("expiry");
  });
};
