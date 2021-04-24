import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.bigInteger("phone").alter();
  });

  await knex.schema.alterTable(myTable.PARENT_INFORMATION, function (table) {
    table.bigInteger("office_phone").alter();
    table.bigInteger("mobile").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION, function (table) {
    table.integer("phone").alter();
  });

  await knex.schema.alterTable(myTable.PARENT_INFORMATION, function (table) {
    table.integer("office_phone").alter();
    table.integer("mobile").alter();
  });
}
