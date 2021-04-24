import { Knex } from "knex";

const applicationTableName = "application";
const applicationLevelTableName = "application_level";
const applicationPeriodTableName = "application_period";
const applicationStatusTableName = "application_status";
const applicationTypeTableName = "application_type";
const depositSlipTableName = "deposit_slip";
const emailRecordTableName = "email_record";
const parentInformationTableName = "parent_information";
const roundTableName = "round";
const schoolHistoryTableName = "school_history";
const siblingTableName = "sibling";
const userRoleTableName = "user_role";
const usersTableName = "users";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(applicationTypeTableName, (table) => {
    table.increments();
    table.string("type").notNullable().unique();
    table.text("application_procedure").notNullable();
    table.text("application_note").notNullable();
    table.text("confirmation_letter").notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(roundTableName, (table) => {
    table.increments();
    table.string("round").notNullable().unique();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(applicationLevelTableName, (table) => {
    table.increments();
    table.string("level").notNullable().unique();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(applicationPeriodTableName, (table) => {
    table.increments();
    table.integer("application_type_id").notNullable().unsigned();
    table
      .foreign("application_type_id")
      .references(`${applicationTypeTableName}.id`);
    table.integer("round_id").notNullable().unsigned();
    table.foreign("round_id").references(`${roundTableName}.id`);
    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();
    table.timestamp("end_deadline").notNullable();
    table.integer("email_template_id").notNullable().unsigned();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(applicationStatusTableName, (table) => {
    table.increments();
    table.string("status").notNullable().unique();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(userRoleTableName, (table) => {
    table.increments();
    table.string("role").notNullable().unique();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(usersTableName, (table) => {
    table.increments();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.integer("user_role_id").notNullable().unsigned();
    table.foreign("user_role_id").references(`${userRoleTableName}.id`);
    table.integer("updated_user_id").unsigned();
    table.foreign("updated_user_id").references(`${usersTableName}.id`);
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(applicationTableName, (table) => {
    table.increments();
    table.string("email").notNullable();
    table.integer("prefix").notNullable();
    table.string("chinese_name").notNullable();
    table.string("english_name").notNullable();
    table.date("date_of_birth").notNullable();
    table.string("place_of_birth").notNullable();
    table.integer("level_id").notNullable().unsigned();
    table.foreign("level_id").references(`${applicationLevelTableName}.id`); //not null?
    table.string("birth_cert_num").notNullable();
    table.string("address").notNullable();
    table.string("sex").notNullable();
    table.string("nationality").notNullable();
    table.string("religion");
    table.integer("phone").notNullable();
    table.text("remarks");
    table.boolean("have_sibling").notNullable();
    table.string("recent_photo").notNullable();
    table.date("interview_date");
    table.time("interview_time");
    table.integer("application_period_id").notNullable().unsigned();
    table
      .foreign("application_period_id")
      .references(`${applicationPeriodTableName}.id`); //not null?
    table.integer("application_status_id").notNullable().unsigned();
    table
      .foreign("application_status_id")
      .references(`${applicationStatusTableName}.id`); //not null?
    table.integer("first_round_score");
    table.text("first_round_remarks");
    table.integer("second_round_score");
    table.text("second_round_remarks");
    table.text("school_remarks");
    table.integer("updated_user_id").notNullable().unsigned();
    table.foreign("updated_user_id").references(`${usersTableName}.id`);
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(depositSlipTableName, (table) => {
    table.increments();
    table.integer("application_id").notNullable().unsigned();
    table.foreign("application_id").references(`${applicationTableName}.id`); //not Null?
    table.string("deposit_slip").notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(emailRecordTableName, (table) => {
    table.increments();
    table.integer("application_id").notNullable().unsigned();
    table.foreign("application_id").references(`${applicationTableName}.id`);
    table.integer("message_id").notNullable().unsigned();
    table.timestamp("submitted_at");
    table.timestamps(false, true);
  });

  await knex.schema.createTable(parentInformationTableName, (table) => {
    table.increments();
    table.integer("application_id").notNullable().unsigned();
    table.foreign("application_id").references(`${applicationTableName}.id`);
    table.string("parent_type");
    table.string("chinese_name");
    table.string("english_name");
    table.string("occupation");
    table.text("office_address");
    table.integer("office_phone");
    table.integer("mobile");
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(schoolHistoryTableName, (table) => {
    table.increments();
    table.integer("application_id").notNullable().unsigned();
    table.foreign("application_id").references(`${applicationTableName}.id`);
    table.string("name");
    table.string("duration");
    table.string("grade");
    table.string("conduct_grade");
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });

  await knex.schema.createTable(siblingTableName, (table) => {
    table.increments();
    table.integer("application_id").notNullable().unsigned();
    table.foreign("application_id").references(`${applicationTableName}.id`);
    table.string("name");
    table.string("sex");
    table.string("school_name");
    table.string("grade");
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(siblingTableName);
  await knex.schema.dropTable(schoolHistoryTableName);
  await knex.schema.dropTable(parentInformationTableName);
  await knex.schema.dropTable(emailRecordTableName);
  await knex.schema.dropTable(depositSlipTableName);
  await knex.schema.dropTable(applicationTableName);
  await knex.schema.dropTable(usersTableName);
  await knex.schema.dropTable(userRoleTableName);
  await knex.schema.dropTable(applicationStatusTableName);
  await knex.schema.dropTable(applicationPeriodTableName);
  await knex.schema.dropTable(applicationLevelTableName);
  await knex.schema.dropTable(roundTableName);
  await knex.schema.dropTable(applicationTypeTableName);
}
