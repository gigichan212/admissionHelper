import { Knex } from "knex";
import { hashPassword } from "../utils/hash";
import { table } from "../utils/tables";
import {
  APPLICATION_LEVEL_DETAILS,
  APPLICATION_TYPE,
  ROUND_DETAILS,
  STATUS_DETAILS,
  USER_ROLE_DETAILS,
} from "../utils/variables";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(table.SIBLING).del();
  await knex(table.SCHOOL_HISTORY).del();
  await knex(table.PARENT_INFORMATION).del();
  await knex(table.SCHOOL_HISTORY).del();
  await knex(table.SIBLING).del();
  await knex(table.DEPOSIT_SLIP).del();
  await knex(table.EMAIL_RECORD).del();
  await knex(table.APPLICATION).del();
  await knex(table.APPLICATION_LEVEL).del();
  await knex(table.APPLICATION_PERIOD).del();
  await knex(table.APPLICATION_STATUS).del();
  await knex(table.APPLICATION_TYPE).del();
  await knex(table.ROUND).del();
  await knex(table.USERS).del();
  await knex(table.USER_ROLE).del();
  await knex(table.APPLICATION_STATUS).del();
  await knex(table.APPLICATION_PERIOD).del();
  await knex(table.APPLICATION_LEVEL).del();
  await knex(table.ROUND).del();
  await knex(table.APPLICATION_TYPE).del();

  // Inserts seed entries
  const typeKeys = Object.keys(APPLICATION_TYPE);
  const roundKeys = Object.keys(ROUND_DETAILS);
  const statusKeys = Object.keys(STATUS_DETAILS);
  const levelKeys = Object.keys(APPLICATION_LEVEL_DETAILS);
  const userRoleKeys = Object.keys(USER_ROLE_DETAILS);

  await knex(table.APPLICATION_TYPE).insert(
    typeKeys.map((key) => ({
      id: key,
      type: APPLICATION_TYPE[key]["type"],
      application_procedure: APPLICATION_TYPE[key]["applicationProcedure"],
      application_note: APPLICATION_TYPE[key]["applicationNote"],
      confirmation_letter: APPLICATION_TYPE[key]["confirmationLetter"],
    }))
  );

  await knex(table.ROUND).insert(
    roundKeys.map((key) => ({
      id: key,
      round: ROUND_DETAILS[key],
    }))
  );

  await knex(table.APPLICATION_STATUS).insert(
    statusKeys.map((key) => ({
      id: key,
      status: STATUS_DETAILS[key],
    }))
  );

  await knex(table.APPLICATION_LEVEL).insert(
    levelKeys.map((key) => ({
      id: key,
      level: APPLICATION_LEVEL_DETAILS[key],
    }))
  );

  await knex(table.USER_ROLE).insert(
    userRoleKeys.map((key) => ({
      id: key,
      role: USER_ROLE_DETAILS[key],
    }))
  );

  const adminId = (await knex(table.USER_ROLE).where({ role: "admin" }))[0].id;

  const teacherId = (await knex(table.USER_ROLE).where({ role: "teacher" }))[0]
    .id;

  const parentId = (await knex(table.USER_ROLE).where({ role: "parent" }))[0]
    .id;

  //User Seed data
  const users = [
    { username: "admin", password: "admin", user_role_id: adminId },
    {
      username: "missChan",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "missWong",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "missHung",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrChan",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrTo",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "missLiu",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrWong",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrPoon",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "missLeung",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrChu",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "missLau",
      password: "1234",
      user_role_id: teacherId,
    },
    {
      username: "mrPChan",
      password: "1234",
      user_role_id: teacherId,
    },
    { username: "parent", password: "1234", user_role_id: parentId },
  ];

  for (const user of users) {
    user.password = await hashPassword(user.password);
  }

  await knex(table.USERS).insert(users);

  //Application period Seed data
  const applicationPeriodRecord = [
    {
      application_type_id: 1,
      round_id: 1,
      start_date: "2020-01-05 08:00",
      end_date: "2020-03-05 00:00",
      end_deadline: "2020-03-29 00:00",
      confirmation_email_template_id: 23002786,
      first_interview_email_template_id: 23037574,
      second_interview_email_template_id: 23037575,
      admitted_email_template_id: 23037577,
      application_year: 2021,
    },
    {
      application_type_id: 2,
      round_id: 1,
      start_date: "2020-05-15 08:00",
      end_date: "2020-07-04 00:00",
      end_deadline: "2020-07-24 00:00",
      confirmation_email_template_id: 23002786,
      first_interview_email_template_id: 23037574,
      second_interview_email_template_id: 23037575,
      admitted_email_template_id: 23037577,
      application_year: 2021,
    },
    {
      application_type_id: 1,
      round_id: 1,
      start_date: "2021-01-04 08:00",
      end_date: "2021-05-04 00:00",
      end_deadline: "2021-05-29 00:00",
      confirmation_email_template_id: 23002786,
      first_interview_email_template_id: 23037574,
      second_interview_email_template_id: 23037575,
      admitted_email_template_id: 23037577,
      application_year: 2022,
    },
    {
      application_type_id: 2,
      round_id: 1,
      start_date: "2021-03-12 08:00",
      end_date: "2021-05-01 00:00",
      end_deadline: "2021-05-29 00:00",
      confirmation_email_template_id: 23002786,
      first_interview_email_template_id: 23037574,
      second_interview_email_template_id: 23037575,
      admitted_email_template_id: 23037577,
      application_year: 2022,
    },
  ];

  await knex(table.APPLICATION_PERIOD).insert(applicationPeriodRecord);
}
