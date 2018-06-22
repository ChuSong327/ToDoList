
exports.up = function(knex, Promise) {
  return knex.schema.createTable("todo", (table) => {
      table.increments();
      table.text("Title").notNullable();
      table.integer("Priority").notNullable();
      table.text("Description");
      table.boolean("Done").defaultTo(false).notNullable();
      table.dateTime("Date").notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("todo");
};
