import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.EMAIL_RECORD, function (table) {
    table.string("category").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.EMAIL_RECORD, function (table) {
    table.dropColumn("category");
  });
}
