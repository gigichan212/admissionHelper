import { Knex } from "knex";
import moment from "moment";
import { logger } from "../utils/logger";
import { Relationship, SchoolHistory, Sibling } from "../utils/models";
import { table } from "../utils/tables";

export class ApplicationService {
  constructor(private knex: Knex) {}

  //Get number of applications
  getNumOfApplications = async () => {
    const counts = await this.knex(table.APPLICATION).count("*");
    return counts[0].count;
  };

  //Get all application
  getAllActiveApplication = async () => {
    const result = await this.knex(table.APPLICATION)
      .select([
        `${table.APPLICATION}.*`,
        `${table.APPLICATION_STATUS}.status as application_status`,
      ])
      .innerJoin(
        table.APPLICATION_STATUS,
        `${table.APPLICATION_STATUS}.id`,
        `${table.APPLICATION}.application_status_id`
      )
      .orderBy(`${table.APPLICATION}.created_at`, "desc");
    return result;
  };

  //Get all applications
  getAllApplications = async (
    offset: number,
    limit: number,
    sortBy: string,
    interviewer_id?: string
  ) => {
    try {
      //Get applications assigned to this teacher only
      let teacherQuery = "";

      if (interviewer_id) {
        teacherQuery = `${table.APPLICATION}.interviewer_id = ${interviewer_id}`;
      }

      const result = await this.knex(table.APPLICATION)
        .select([
          `${table.APPLICATION}.*`,
          `${table.APPLICATION_STATUS}.status as application_status`,
          `${table.APPLICATION_LEVEL}.level as level`,
        ])
        .innerJoin(
          table.APPLICATION_STATUS,
          `${table.APPLICATION_STATUS}.id`,
          `${table.APPLICATION}.application_status_id`
        )
        .innerJoin(
          table.APPLICATION_LEVEL,
          `${table.APPLICATION_LEVEL}.id`,
          `${table.APPLICATION}.level_id`
        )
        .orderByRaw(
          `${table.APPLICATION}.${sortBy} DESC NULLS LAST, ${table.APPLICATION}.id ASC`
        )
        .whereRaw(`${teacherQuery}`)
        .limit(limit)
        .offset(offset);

      return result.map((item) => {
        item["idWithPrefix"] = parseInt(
          String(item["prefix"]) + String(item["id"])
        );
        return item;
      });
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get an specific application
  getApplication = async (id: number) => {
    // get application
    const applicationResult = await this.knex(table.APPLICATION)
      .select([
        `${table.APPLICATION}.*`,
        `${table.APPLICATION_LEVEL}.level`,
        `${table.APPLICATION_STATUS}.status as application_status`,
        `${table.APPLICATION}.interview_date_time as interview_date_time`,
      ])
      .select(
        this.knex.raw(
          `to_char(${table.APPLICATION}.date_of_birth, 'YYYY-MM-DD') as date_of_birth`
        )
      )
      .innerJoin(
        table.APPLICATION_LEVEL,
        `${table.APPLICATION_LEVEL}.id`,
        `${table.APPLICATION}.level_id`
      )
      .innerJoin(
        table.APPLICATION_STATUS,
        `${table.APPLICATION_STATUS}.id`,
        `${table.APPLICATION}.application_status_id`
      )
      .whereRaw(`${table.APPLICATION}.id = ${id}`)
      .first();

    // Handle application not found
    if (!applicationResult) {
      return;
    }

    // get application type (normal/ interim)
    const application_period_id = applicationResult.application_period_id;

    const applicationPeriod = await this.knex(table.APPLICATION_PERIOD)
      .select([
        `${table.APPLICATION_TYPE}.type`,
        `${table.APPLICATION_PERIOD}.end_deadline`,
      ])
      .innerJoin(
        table.APPLICATION_TYPE,
        `${table.APPLICATION_TYPE}.id`,
        `${table.APPLICATION_PERIOD}.application_type_id`
      )
      .whereRaw(`${table.APPLICATION_PERIOD}.id = ${application_period_id}`)
      .first();
    applicationResult["end_deadline"] = applicationPeriod.end_deadline;
    applicationResult["application_type"] = applicationPeriod.type;

    // get last update user info
    const updated_user_id = applicationResult.updated_user_id;
    const updateUserInfo = await this.knex(table.USERS)
      .select([`${table.USERS}.username`, `${table.USER_ROLE}.role`])
      .innerJoin(
        table.USER_ROLE,
        `${table.USER_ROLE}.id`,
        `${table.USERS}.user_role_id`
      )
      .whereRaw(`${table.USERS}.id = ${updated_user_id}`)
      .first();
    applicationResult["updated_user"] = updateUserInfo.username;
    applicationResult["updated_user_role"] = updateUserInfo.role;

    // get application related info, i.e. school history/ parent/ sibling
    const educationResult = await this.knex(table.SCHOOL_HISTORY)
      .where({
        application_id: id,
      })
      .orderBy("id");
    const parentResult = await this.knex(table.PARENT_INFORMATION)
      .where({
        application_id: id,
      })
      .orderBy("id");
    const siblingResult = await this.knex(table.SIBLING)
      .where({
        application_id: id,
      })
      .orderBy("id");
    applicationResult["education"] = educationResult;
    applicationResult["parent"] = parentResult;
    applicationResult["sibling"] = siblingResult;

    // get application deposit slip filenames
    const depositSlipsResult = await this.knex(table.DEPOSIT_SLIP).where({
      application_id: id,
    });
    applicationResult["depositSlips"] = depositSlipsResult;

    // get application id with prefix
    applicationResult["idWithPrefix"] = parseInt(
      String(applicationResult["prefix"]) + String(applicationResult["id"])
    );

    // get preview image as another name
    applicationResult["recent_photo_preview_only"] =
      applicationResult["recent_photo"];
    delete applicationResult["recent_photo"];

    // split interview_date_time
    applicationResult["interview_time"] = moment(
      applicationResult["interview_date_time"]
    ).format("HH:mm");
    applicationResult["interview_date"] = moment(
      applicationResult["interview_date_time"]
    ).format("YYYY-MM-DD");

    return {
      applicationResult,
    };
  };

  // Get current application period
  getApplyingPeriod = async (
    formType?: string | null,
    currentPeriodId?: number
  ) => {
    let result: { id: number };
    if (formType !== null) {
      // for public to insert application: get active normal/ interim period id
      result = await this.knex
        .from(table.APPLICATION_PERIOD)
        .innerJoin(
          `${table.APPLICATION_TYPE}`,
          `${table.APPLICATION_PERIOD}.application_type_id`,
          `${table.APPLICATION_TYPE}.id`
        )
        .where(`${table.APPLICATION_TYPE}.type`, formType)
        .where(`${table.APPLICATION_PERIOD}.is_active`, "true")
        .where(`${table.APPLICATION_PERIOD}.end_date`, ">", "now()")
        .select(`${table.APPLICATION_PERIOD}.id`)
        .first();

      return result;
    } else if (currentPeriodId) {
      // for dashboard user: can insert application for any period
      result = await this.knex
        .from(table.APPLICATION_PERIOD)
        .where(`${table.APPLICATION_PERIOD}.id`, currentPeriodId)
        .select(`${table.APPLICATION_PERIOD}.id`)
        .first();

      return result;
    }
    return;
  };

  // get applying level
  getApplyingLevel = async (level: string) => {
    const result: { id: number } = await this.knex(table.APPLICATION_LEVEL)
      .where({
        level: level,
      })
      .select("id")
      .first();

    return result;
  };

  // get applying user id (for public -> get hard code parent user id)
  getApplyingUserId = async (role: string) => {
    const result: { id: number } = await this.knex
      .from(table.USERS)
      .innerJoin("user_role", "users.user_role_id", "user_role.id")
      .where({ "user_role.role": role, "users.is_active": "true" })
      .select("users.id")
      .first();
    return result.id;
  };

  // check if interviewer/ teacher exists
  checkInterviewerExist = async (id: string) => {
    const result: { id: number } = await this.knex
      .from(table.USERS)
      .where({ id: id })
      .select("id")
      .first();
    return result.id;
  };

  // get application status
  getApplicationStatus = async (status: string) => {
    const result: { id: number } = await this.knex(table.APPLICATION_STATUS)
      .where({
        status: status,
      })
      .select("id")
      .first();

    return result;
  };

  //Insert application
  addApplication = async (
    role: string,
    body: any,
    periodId: number,
    levelId: number,
    userId: number,
    recent_photo: string,
    slipsArr: string[],
    interviewerId: number | null,
    statusId: number,
    education: SchoolHistory[],
    parent: Relationship[],
    sibling: Sibling[]
  ) => {
    // Get current month
    // fill "0" if month is less than 10
    let thisMonth: number = new Date().getMonth() + 1;
    let thisMonthString = String(thisMonth);
    if (thisMonth < 10) {
      thisMonthString = "0" + thisMonthString;
    }

    const insertData: any = {};
    [
      "chinese_name",
      "english_name",
      "sex",
      "nationality",
      "birth_cert_num",
      "date_of_birth",
      "place_of_birth",
      "email",
      "phone",
      "address",
      "have_sibling",
      "remarks",
      "religion",
    ].forEach((item) => (insertData[item] = body[item]));
    insertData["recent_photo"] = recent_photo;
    insertData["application_status_id"] = statusId;
    insertData["updated_user_id"] = userId;
    insertData["application_period_id"] = periodId;
    insertData["level_id"] = levelId;
    insertData["updated_at"] = new Date();
    insertData["prefix"] = String(new Date().getFullYear()) + thisMonthString;

    // data could only be inserted by dashboard users
    if (role === "dashboard") {
      [
        "first_round_score",
        "first_round_remarks",
        "second_round_score",
        "second_round_remarks",
        "school_remarks",
      ].forEach((item) => {
        if (body[item]) {
          insertData[item] = body[item];
        }
      });
      if (body["interview_date_time"]) {
        insertData["interview_date_time"] = new Date(
          body["interview_date_time"]
        );
      }

      if (interviewerId !== null) {
        insertData["interviewer_id"] = interviewerId;
      }
    }

    console.log("insertData: ", insertData);

    // Execute SQL using Transaction
    const trx = await this.knex.transaction();
    try {
      const result = await trx(table.APPLICATION)
        .insert(insertData)
        .returning(["id", "prefix", "created_at"]);

      // insert related info
      [education, parent, sibling].map((category) => {
        category.map((item: any) => {
          item["application_id"] = result[0].id;
          item["updated_at"] = new Date();
          delete item["id"];

          // delete "office_phone"/ "mobile" when empty to prevent insert empty string to type bigInt
          if (!item["office_phone"] || item["office_phone"] === "") {
            delete item["office_phone"];
          }
          if (!item["mobile"] || item["mobile"] == "") {
            delete item["mobile"];
          }
        });

        console.log("educationArr: ", category);
        console.log("parentArr: ", category);
        console.log("siblingArr: ", category);
      });
      await trx(table.SCHOOL_HISTORY).insert(education);
      await trx(table.PARENT_INFORMATION).insert(parent);
      await trx(table.SIBLING).insert(sibling);

      // insert deposit images
      if (slipsArr.length > 0 && role === "dashboard") {
        for (let slip of slipsArr) {
          await trx(table.DEPOSIT_SLIP).insert({
            application_id: result[0].id,
            deposit_slip: slip,
            updated_at: new Date(),
          });
        }
      }

      await trx.commit(); // Commit if no error
      return result[0];
    } catch (err) {
      logger.error(err.message);
      await trx.rollback(); // rollback if got error
    }
  };

  // check application period deadline by application id
  checkPeriodDeadline = async (applicationId: number) => {
    const result = await this.knex
      .from(table.APPLICATION_PERIOD)
      .innerJoin(
        `${table.APPLICATION}`,
        `${table.APPLICATION}.application_period_id`,
        `${table.APPLICATION_PERIOD}.id`
      )
      .where(`${table.APPLICATION}.id`, applicationId)
      .where(`${table.APPLICATION_PERIOD}.end_deadline`, ">", "now()")
      .select(`${table.APPLICATION_PERIOD}.id`)
      .first();
    return result;
  };

  // Edit application
  putApplication = async (
    targetId: number,
    role: string,
    body: any,
    levelId: number,
    periodId: number | undefined,
    userId: number,
    recent_photo: string,
    slipsArr: string[],
    interviewerId: number | null,
    statusId: number | null,
    education: SchoolHistory[],
    parent: Relationship[],
    sibling: Sibling[]
  ) => {
    const updateData: any = {};
    [
      "chinese_name",
      "english_name",
      "sex",
      "nationality",
      "birth_cert_num",
      "date_of_birth",
      "place_of_birth",
      "email",
      "phone",
      "address",
      "have_sibling",
      "remarks",
      "religion",
    ].forEach((item) => (updateData[item] = body[item]));
    if (recent_photo) {
      updateData["recent_photo"] = recent_photo;
    }

    updateData["updated_user_id"] = userId;
    if (typeof periodId !== "undefined") {
      updateData["application_period_id"] = periodId;
    }
    updateData["level_id"] = levelId;
    updateData["updated_at"] = new Date();
    console.log("updateData: ", updateData);
    // data could only be updated by dashboard users
    if (role === "dashboard") {
      [
        "first_round_score",
        "first_round_remarks",
        "second_round_score",
        "second_round_remarks",
        "school_remarks",
      ].map((item) => {
        if (body[item]) {
          updateData[item] = body[item];
        }
      });
      if (body["interview_date_time"]) {
        updateData["interview_date_time"] = new Date(
          body["interview_date_time"]
        );
      }
      if (interviewerId !== null) {
        updateData["interviewer_id"] = interviewerId;
      }
      if (statusId !== null) {
        updateData["application_status_id"] = statusId;
      }
    }
    [education, parent, sibling].map((category) => {
      category.map((item: any) => {
        item["updated_at"] = new Date();

        // delete "office_phone"/ "mobile" when empty to prevent insert empty string to type bigInt
        if (!item["office_phone"]) {
          delete item["office_phone"];
        }
        if (!item["mobile"]) {
          delete item["mobile"];
        }
      });
      console.log("category: ", category);
    });
    console.log("updateData: ", updateData);

    // Execute SQL using Transaction
    const trx = await this.knex.transaction();
    try {
      const result = await trx(table.APPLICATION)
        .where("id", targetId)
        .update(updateData, ["id"]);

      // update application related info
      for (let item of education) {
        await trx(table.SCHOOL_HISTORY)
          .where("id", parseInt(item["id"] as string))
          .update(item);
      }
      for (let item of parent) {
        await trx(table.PARENT_INFORMATION)
          .where("id", parseInt(item["id"] as string))
          .update(item);
      }

      if (body["have_sibling"] === "true") {
        for (let item of sibling) {
          await trx(table.SIBLING)
            .where("id", parseInt(item["id"] as string))
            .update(item);
        }
      } else {
        // if user chose no sibling, delete all sibling record
        await trx(table.SIBLING).where("application_id", targetId).del();
        // insert new blank record
        sibling.map((item: any) => {
          item["application_id"] = targetId;
        });
        await trx(table.SIBLING).insert(sibling);
      }

      // deposit slips
      // if there is no new input but user deleted all images
      if (body.slipFromDbIsDeleted === "true") {
        await trx(table.DEPOSIT_SLIP).where("application_id", targetId).del();
      }
      // if there is new input, delete all deposit images and insert new
      if (slipsArr.length > 0) {
        await trx(table.DEPOSIT_SLIP).where("application_id", targetId).del();
        for (let slip of slipsArr) {
          await trx(table.DEPOSIT_SLIP).insert({
            application_id: targetId,
            deposit_slip: slip,
            updated_at: new Date(),
          });
        }
      }

      await trx.commit();
      return result[0];
    } catch (err) {
      logger.error(err.message);
      await trx.rollback();
    }
  };

  putApplicationDeposit = async (
    targetId: number,
    body: any,
    slipsArr: string[]
  ) => {
    // Execute SQL using Transaction
    const trx = await this.knex.transaction();
    try {
      // deposit slips
      // if there is no new input but user deleted all images
      if (body.slipFromDbIsDeleted === "true") {
        await trx(table.DEPOSIT_SLIP).where("application_id", targetId).del();
      }
      // if there is new input, delete all deposit images and insert new
      if (slipsArr.length > 0) {
        await trx(table.DEPOSIT_SLIP).where("application_id", targetId).del();
        for (let slip of slipsArr) {
          await trx(table.DEPOSIT_SLIP).insert({
            application_id: targetId,
            deposit_slip: slip,
            updated_at: new Date(),
          });
        }
      }
      await trx.commit();
      return "success";
    } catch (err) {
      logger.error(err.message);
      await trx.rollback();
    }
    return;
  };

  //Generate a query string for searching DB in searchAllApplications(see Below)
  generateSearchString = (query: any) => {
    const arr = [];

    for (let i in query) {
      if (typeof query[i] === "string") {
        let stringQuery;

        switch (i) {
          case "application_status":
            stringQuery = `LOWER(${table.APPLICATION_STATUS}.status) LIKE LOWER('%${query[i]}%')`;
            break;
          case "level":
            stringQuery = `CAST(${table.APPLICATION_LEVEL}.${i} AS TEXT) LIKE '%${query[i]}%'`;
            break;
          case "parent_english_name":
            stringQuery = `LOWER(${table.PARENT_INFORMATION}.english_name) LIKE LOWER('%${query[i]}%')`;
            break;
          case "parent_chinese_name":
            stringQuery = `LOWER(${table.PARENT_INFORMATION}.chinese_name) LIKE LOWER('%${query[i]}%')`;
            break;
          case "id":
            //Search only id if length more than 6
            //Else search prefix
            if (query[i].length > 6) {
              const newId = query[i].slice(6);

              stringQuery = `CAST(${table.APPLICATION}.${i} AS TEXT) LIKE '%${newId}%'`;
            } else {
              stringQuery = `CAST(${table.APPLICATION}.prefix AS TEXT) LIKE '%${query[i]}%'`;
            }
            break;
          default:
            stringQuery = `LOWER(${table.APPLICATION}.${i}) LIKE LOWER('%${query[i]}%')`;
            break;
        }

        arr.push(stringQuery);
      } else if (typeof query[i] === "number") {
        const intQuery = `CAST(${table.APPLICATION}.${i} AS TEXT) LIKE '%${query[i]}%'`;

        arr.push(intQuery);
      }
    }

    const searchString = arr.join(" AND ");

    console.log(searchString)
    return searchString;
  };

  //search all applications
  searchAllApplications = async (
    offset: number,
    limit: number,
    sortBy: string,
    query: any
  ) => {
    try {
      const searchString = this.generateSearchString(query);

      const result = await this.knex(table.APPLICATION)
        .innerJoin(
          table.APPLICATION_STATUS,
          `${table.APPLICATION_STATUS}.id`,
          `${table.APPLICATION}.application_status_id`
        )
        .innerJoin(
          table.APPLICATION_LEVEL,
          `${table.APPLICATION_LEVEL}.id`,
          `${table.APPLICATION}.level_id`
        )
        .innerJoin(
          table.PARENT_INFORMATION,
          `${table.PARENT_INFORMATION}.application_id`,
          `${table.APPLICATION}.id`
        )
        .whereRaw(searchString)
        .select([
          `${table.APPLICATION}.*`,
          `${table.APPLICATION_STATUS}.status as application_status`,
          `${table.APPLICATION_LEVEL}.level as level`,
        ])
        .distinct(`${table.APPLICATION}.id`)
        .orderByRaw(
          `${table.APPLICATION}.${sortBy} DESC NULLS LAST, ${table.APPLICATION}.id ASC`
        )
        .limit(limit)
        .offset(offset);

      return result.map((item) => {
        item["idWithPrefix"] = parseInt(
          String(item["prefix"]) + String(item["id"])
        );
        return item;
      });
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  /*******************Batch actions***************/
  // get email sending list by application period id and status
  getApplicationForEmailSending = async (periodId: number, status: string) => {
    const statusRecord: { id: number } = await this.getApplicationStatus(
      status
    );

    const applicationResult: { id: number }[] = await this.knex(
      table.APPLICATION
    )
      .where({
        application_status_id: statusRecord.id,
        application_period_id: periodId,
      })
      .select("id");

    let result: number[] = [];
    for (let item of applicationResult) {
      result.push(item["id"]);
    }
    return result;
  };

  // batch update
  batchUpdate = async (
    idArr: number[],
    updateData: any,
    updated_user_id: number
  ) => {
    const trx = await this.knex.transaction();
    try {
      let result;

      for (let id of idArr) {
        result = await trx(table.APPLICATION)
          .where({ id: id })
          .update({
            ...updateData,
            updated_at: new Date(),
            updated_user_id: updated_user_id,
          })
          .returning(["updated_at", "updated_user_id"]);
      }

      //Throw error if there is no result
      if (!result) {
        throw new Error("Update failed");
      }

      await trx.commit();

      return result[0];
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  // export excel
  getExportExcelData = async (idArr: number[]) => {
    const result = await this.knex(table.APPLICATION)
      .innerJoin(
        table.APPLICATION_STATUS,
        `${table.APPLICATION_STATUS}.id`,
        `${table.APPLICATION}.application_status_id`
      )
      .innerJoin(
        table.APPLICATION_LEVEL,
        `${table.APPLICATION_LEVEL}.id`,
        `${table.APPLICATION}.level_id`
      )
      .innerJoin(
        table.APPLICATION_PERIOD,
        `${table.APPLICATION_PERIOD}.id`,
        `${table.APPLICATION}.application_period_id`
      )
      .innerJoin(
        table.APPLICATION_TYPE,
        `${table.APPLICATION_TYPE}.id`,
        `${table.APPLICATION_PERIOD}.application_type_id`
      )
      .where((builder) => builder.whereIn(`${table.APPLICATION}.id`, idArr))
      .select([
        `${table.APPLICATION}.*`,
        `${table.APPLICATION_STATUS}.status as application_status`,
        `${table.APPLICATION_LEVEL}.level as level`,
        `${table.APPLICATION}.interview_date_time as interview_date_time`,
        `${table.APPLICATION_TYPE}.type`,
      ])
      .select(
        this.knex.raw(
          `to_char(${table.APPLICATION}.date_of_birth, 'YYYY-MM-DD') as date_of_birth`
        )
      );

    for (let item of result) {
      // get application related info, i.e. school history/ parent/ sibling
      const educationResult = await this.knex(table.SCHOOL_HISTORY)
        .where({
          application_id: item["id"],
        })
        .orderBy("id");
      const parentResult = await this.knex(table.PARENT_INFORMATION)
        .where({
          application_id: item["id"],
        })
        .orderBy("id");
      const siblingResult = await this.knex(table.SIBLING)
        .where({
          application_id: item["id"],
        })
        .orderBy("id");

      for (let i = 0; i < educationResult.length; i++) {
        item[`school${i + 1}`] = educationResult[i]["name"];
        item[`duration${i + 1}`] = educationResult[i]["duration"];
        item[`grade${i + 1}`] = educationResult[i]["grade"];
        item[`conduct_grade${i + 1}`] = educationResult[i]["conduct_grade"];
      }
      for (let i = 0; i < parentResult.length; i++) {
        item[`parent_type${i + 1}`] = parentResult[i]["parent_type"];
        item[`parent_chinese_name${i + 1}`] = parentResult[i]["chinese_name"];
        item[`parent_english_name${i + 1}`] = parentResult[i]["english_name"];
        item[`parent_occupation${i + 1}`] = parentResult[i]["occupation"];
        item[`parent_office_address${i + 1}`] =
          parentResult[i]["office_address"];
        item[`parent_office_phone${i + 1}`] = parentResult[i]["office_phone"];
        item[`parent_mobile${i + 1}`] = parentResult[i]["mobile"];
      }

      for (let i = 0; i < siblingResult.length; i++) {
        item[`sibling_name${i + 1}`] = siblingResult[i]["name"];
        item[`sibling_sex${i + 1}`] = siblingResult[i]["sex"];
        item[`sibling_school_name${i + 1}`] = siblingResult[i]["school_name"];
        item[`sibling_grade${i + 1}`] = siblingResult[i]["grade"];
      }

      // delete unused item
      [
        "level_id",
        "recent_photo",
        "application_period_id",
        "application_status_id",
        "updated_user_id",
        "is_active",
        "interviewer_id",
      ].map((field) => delete item[field]);

      item["idWithPrefix"] = parseInt(
        String(item["prefix"]) + String(item["id"])
      );
      ["id", "prefix"].map((field) => delete item[field]);

      item = {
        idWithPrefix: item["idWithPrefix"],
        ...item,
      };
    }

    return result;
  };
}
