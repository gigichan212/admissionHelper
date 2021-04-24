import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.EMAIL_RECORD, function (table) {
    table.string("message_id").notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.EMAIL_RECORD, function (table) {
    table.integer("message_id").notNullable().unsigned().alter();
  });
}
