import { Knex } from "knex";
import { table as myTable } from "../utils/tables";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION_PERIOD, function (table) {
    table.renameColumn("email_template_id", "confirmation_email_template_id");
    table.integer("first_interview_email_template_id").notNullable().unsigned();
    table
      .integer("second_interview_email_template_id")
      .notNullable()
      .unsigned();
    table.integer("admitted_email_template_id").notNullable().unsigned();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(myTable.APPLICATION_PERIOD, function (table) {
    table.renameColumn("confirmation_email_template_id", "email_template_id");
    table.dropColumn("first_interview_email_template_id");
    table.dropColumn("second_interview_email_template_id");
    table.dropColumn("admitted_email_template_id");
  });
}
