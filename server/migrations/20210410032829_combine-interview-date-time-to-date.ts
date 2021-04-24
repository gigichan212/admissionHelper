import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.dropColumn("interview_date");
    table.dropColumn("interview_time");
    table.timestamp("interview_date_time");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.dropColumn("interview_date_time");
    table.date("interview_date");
    table.time("interview_time");
  });
}
