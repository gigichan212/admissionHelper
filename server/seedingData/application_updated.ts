// import { Knex } from "knex";
// import { table } from "../utils/tables";
// import applicationData from "../seedingData/application";
// import parentData from "../seedingData/parent_information";
// import siblingData from "../seedingData/sibling";
// import schoolHistoryData from "../seedingData/school_history";
// import { dataPendingMale } from "./application_male";

// export async function seed(knex: Knex): Promise<void> {
//   //Normal application for year 2021
//   let applicant2021Normal = [];

//   //Need to get application period id
//   const application_periodId = await knex(table.APPLICATION_PERIOD)
//     .innerJoin(
//       `${table.APPLICATION_TYPE}`,
//       `${table.APPLICATION_TYPE}.id`,
//       `${table.APPLICATION_PERIOD}.application_type_id`
//     )
//     .select(`${table.APPLICATION_PERIOD}.id`)
//     .where({ type: "normal", application_year: 2021 });

//   //Need to get application status id
//   const pendingId = await knex(table.APPLICATION_STATUS)
//     .select("id")
//     .where({ status: "pending" });

//   //Need to get level id
//   const level1Id = await knex(table.APPLICATION_LEVEL)
//     .select("id")
//     .where({ level: 1 });

//   //Every period have 100 records
//   //male and female 50%
//   //each application status 20 records

//   //Pending boys
//   applicant2021Normal.push(
//     dataPendingMale.map((data) => ({
//       ...data,
//       application_period_id: application_periodId,
//       level_id: level1Id,
//       application_status_id: pendingId,
//     }))
//   );

//   //Pending girls
//   applicant2021Normal.push(
//     dataPendingFemale.map((data) => ({
//       ...data,
//       application_period_id: application_periodId,
//       level_id: level1Id,
//       application_status_id: pendingId,
//     }))
//   );
// }
