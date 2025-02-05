/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('timers', function (table) {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid()).notNullable();
      table.string('description', 255);
      table.boolean('is_active').defaultTo(true).notNullable();
      table.dateTime('start').notNullable().defaultTo(knex.fn.now())
      table.dateTime('end');
      table.bigInteger('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('timers');
};
