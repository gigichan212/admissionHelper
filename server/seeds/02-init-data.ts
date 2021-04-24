import { Knex } from "knex";
import { table } from "../utils/tables";
import applicationData from "../seedingData/application";
import parentData from "../seedingData/parent_information";
import siblingData from "../seedingData/sibling";
import schoolHistoryData from "../seedingData/school_history";

export async function seed(knex: Knex): Promise<void> {
  //Get period id
  const application_periodId = await knex
    .select("id")
    .from(table.APPLICATION_PERIOD);

  //Get level id(1-6)
  const applicationLevelId = await knex
    .select("id")
    .from(table.APPLICATION_LEVEL);

  //Get status id(pending/first round interview/second round interview/admitted/rejected/invalid)
  const applicationStatusId = await knex
    .select("id")
    .from(table.APPLICATION_STATUS);

  //Get user id without parent
  const usersId = await knex
    .select("id")
    .from(table.USERS)
    .where("username", "!=", "parent");

  //Set recent photo
  const recent_photo = [
    "recent_photo-1618808373552.jpeg",
    "recent_photo-1618808304863.jpeg",
    "recent_photo-1618808229425.jpeg",
    "recent_photo-1618808133186.jpeg",
    "recent_photo-1618808045742.jpeg",
    "recent_photo-1618807981407.jpeg",
    "recent_photo-1618807921705.jpeg",
    "recent_photo-1618807853039.jpeg",
    "recent_photo-1618807782491.jpeg",
    "recent_photo-1618807713137.jpeg",
    "recent_photo-1618807629373.jpeg",
    "recent_photo-1618807532119.jpeg",
    "recent_photo-1618807467405.jpeg",
    "recent_photo-1618807396585.jpeg",
    "recent_photo-1618807316040.jpeg",
    "recent_photo-1618807240206.jpeg",
    "recent_photo-1618807163502.jpeg",
    "recent_photo-1618806885740.jpeg",
  ];

  //Insert applications
  const applicationId = await knex(table.APPLICATION)
    .insert(
      applicationData.map((data) => {
        //Get interview date and time from data and combine to timestamp
        //If not provided, set to null
        let { interview_date, interview_time, is_active, ...others } = data;
        let interview_date_time;

        if (!interview_date && !interview_time) {
          interview_date_time = null;
        } else {
          interview_date_time = `${interview_date} ${interview_time}`;
        }

        const myEmail = [
          "gigi1997212@live.hk",
          "changigi.ch@gmail.com",
          "acounttesting900@gmail.com",
        ];

        others.email = myEmail[Math.floor(Math.random() * myEmail.length)];

        return {
          ...others,
          application_period_id:
            application_periodId[
              Math.floor(application_periodId.length * Math.random())
            ].id,
          updated_user_id:
            usersId[Math.floor(usersId.length * Math.random())].id,
          level_id:
            applicationLevelId[
              Math.floor(applicationLevelId.length * Math.random())
            ].id,
          application_status_id:
            applicationStatusId[
              Math.floor(applicationStatusId.length * Math.random())
            ].id,
          recent_photo:
            recent_photo[Math.floor(recent_photo.length * Math.random())],
          interviewer_id:
            usersId[Math.floor(usersId.length * Math.random())].id,
          interview_date_time: interview_date_time,
        };
      })
    )
    .returning("id");

  //Insert parents 1st time

  await knex(table.PARENT_INFORMATION).insert(
    applicationId.map((id: number) => {
      return {
        ...parentData[Math.floor(Math.random() * parentData.length)],
        application_id: id,
        parent_type: "mother",
      };
    })
  );
  //Insert parents 2st time

  await knex(table.PARENT_INFORMATION).insert(
    applicationId.map((id: number) => {
      return {
        ...parentData[Math.floor(Math.random() * parentData.length)],
        application_id: id,
        parent_type: "father",
      };
    })
  );

  //Insert parents 3rd time

  await knex(table.PARENT_INFORMATION).insert(
    applicationId.map((id: number) => {
      //@ts-ignore
      const [is_active, ...others] = parentData;

      return {
        ...others[Math.floor(Math.random() * parentData.length)],
        application_id: id,
        parent_type: "guardian",
      };
    })
  );

  //Insert siblings 1st time

  const havingSiblingId = await knex(table.APPLICATION)
    .select("id")
    .where("have_sibling", true);

  await knex(table.SIBLING).insert(
    applicationId.map((id: { id: number }) => {
      if (havingSiblingId.indexOf(id) === -1) {
        return {
          name: "",
          school_name: "",
          is_active: false,
          sex: "",
          application_id: id,
        };
      } else {
        //@ts-ignore
        const [is_active, ...others] = siblingData;

        return {
          ...others[Math.floor(Math.random() * siblingData.length)],
          application_id: id,
          grade: ["K1", "K2", "K3"][Math.floor(3 * Math.random())],
        };
      }
    })
  );

  //Insert siblings 2nd time

  await knex(table.SIBLING).insert(
    applicationId.map((id: { id: number }) => {
      if (havingSiblingId.indexOf(id) === -1) {
        return {
          name: "",
          school_name: "",
          is_active: false,
          sex: "",
          application_id: id,
        };
      } else {
        //@ts-ignore
        const [is_active, ...others] = siblingData;

        return {
          ...others[Math.floor(Math.random() * siblingData.length)],
          application_id: id,
          grade: ["K1", "K2", "K3"][Math.floor(3 * Math.random())],
        };
      }
    })
  );

  //Insert school history information 1st

  await knex(table.SCHOOL_HISTORY).insert(
    applicationId.map((id: number) => {
      //@ts-ignore
      const [is_active, ...others] = schoolHistoryData;

      return {
        ...others[Math.floor(Math.random() * schoolHistoryData.length)],
        application_id: id,
      };
    })
  );

  //Insert school history information 2nd time
  await knex(table.SCHOOL_HISTORY).insert(
    applicationId.map((id: number) => {
      //@ts-ignore
      const [is_active, ...others] = schoolHistoryData;

      return {
        ...others[Math.floor(Math.random() * schoolHistoryData.length)],
        application_id: id,
      };
    })
  );

  //Insert school history information 3nd time
  await knex(table.SCHOOL_HISTORY).insert(
    applicationId.map((id: number) => {
      //@ts-ignore
      const [is_active, ...others] = schoolHistoryData;

      return {
        ...others[Math.floor(Math.random() * schoolHistoryData.length)],
        application_id: id,
      };
    })
  );
}
