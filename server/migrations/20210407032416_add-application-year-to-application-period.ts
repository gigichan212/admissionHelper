import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION_PERIOD, function (table) {
    table.integer("application_year").notNullable();
  });
  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.integer("interviewer_id").unsigned();
    table.foreign("interviewer_id").references(`${myTable.USERS}.id`);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION_PERIOD, function (table) {
    table.dropColumn("application_year");
  });

  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.dropForeign("interviewer_id");
    table.dropColumn("interviewer_id");
  });
}
