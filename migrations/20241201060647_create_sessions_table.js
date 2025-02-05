/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('sessions', function (table) {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
      table.bigInteger('user_id').notNullable()
      table.foreign('user_id').references('id').inTable('users');
    }
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('sessions');
};
