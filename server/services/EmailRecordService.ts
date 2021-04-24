import { Knex } from "knex";
import moment from "moment";
import { emailCategoryMapping } from "../utils/Mapping";
import { InfoForEmail } from "../utils/models";
import { table } from "../utils/tables";
import { ApplicationService } from "./ApplicationService";
const fetch = require("node-fetch");
export class EmailRecordService {
  constructor(
    private knex: Knex,
    private applicationService: ApplicationService
  ) {}

  // get info required by sending email first_interview_email_template_id
  // typeName = confirmation_email_template_id/ / second_interview_email_template_id/ admitted_email_template_id
  getInfoForEmail = async (applicationIdArr: number[], templateId: string) => {
    let result: InfoForEmail[] = [];
    for (let applicationId of applicationIdArr) {
      const infoFormDb: InfoForEmail = await this.knex(table.APPLICATION)
        .select([
          `${table.APPLICATION}.prefix`,
          `${table.APPLICATION}.id`,
          `${table.APPLICATION}.email`,
          `${table.APPLICATION_PERIOD}.${templateId} as templateId`,
          `${table.APPLICATION}.chinese_name`,
          `${table.APPLICATION}.english_name`,
          `${table.APPLICATION}.interview_date_time`,
          `${table.APPLICATION_PERIOD}.application_year`,
        ])
        .innerJoin(
          table.APPLICATION_PERIOD,
          `${table.APPLICATION_PERIOD}.id`,
          `${table.APPLICATION}.application_period_id`
        )
        .whereRaw(`${table.APPLICATION}.id = ${applicationId}`)
        .first();

      result.push({
        category: emailCategoryMapping.get(templateId) as string,
        applicationId: infoFormDb["id"],
        recipient: infoFormDb["email"],
        templateId: infoFormDb["templateId"],
        templateModel: {
          idWithPrefix: String(infoFormDb["prefix"]) + String(infoFormDb["id"]),
          email: infoFormDb["email"],
          chinese_name: infoFormDb["chinese_name"],
          english_name: infoFormDb["english_name"],
          application_year: infoFormDb["application_year"],
          interview_date_time: moment(infoFormDb["interview_date_time"]).format(
            "YYYY-MM-DD HH:mm"
          ),
        },
      });
    }

    return result;
  };

  //Get number of email record
  getNumOfEmailRecords = async () => {
    const counts = await this.knex(table.EMAIL_RECORD).count("*");
    return counts[0];
  };

  //Get all Email
  getAllEmailRecords = async (limit: number, offset: number, data?: any) => {
    const searchString = this.applicationService.generateSearchString(data);
    let result: any[] = [];
    if (!data) {
      // without searching
      result = await this.knex(table.EMAIL_RECORD)
        .select([
          `${table.EMAIL_RECORD}.*`,
          `${table.APPLICATION}.prefix`,
          `${table.APPLICATION}.email`,
          `${table.APPLICATION}.chinese_name`,
          `${table.APPLICATION}.english_name`,
          `${table.APPLICATION_PERIOD}.application_year`,
          `${table.ROUND}.round`,
          `${table.APPLICATION_TYPE}.type as application_type`,
        ])
        .innerJoin(
          table.APPLICATION,
          `${table.APPLICATION}.id`,
          `${table.EMAIL_RECORD}.application_id`
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
        .innerJoin(
          table.ROUND,
          `${table.ROUND}.id`,
          `${table.APPLICATION_PERIOD}.round_id`
        )
        .orderBy(`${table.EMAIL_RECORD}.submitted_at`, "desc")
        .limit(limit)
        .offset(offset);
    } else {
      // with searching
      result = await this.knex(table.EMAIL_RECORD)
        .innerJoin(
          table.APPLICATION,
          `${table.APPLICATION}.id`,
          `${table.EMAIL_RECORD}.application_id`
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
        .innerJoin(
          table.ROUND,
          `${table.ROUND}.id`,
          `${table.APPLICATION_PERIOD}.round_id`
        )
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
          `${table.EMAIL_RECORD}.*`,
          `${table.APPLICATION}.prefix`,
          `${table.APPLICATION}.email`,
          `${table.APPLICATION}.chinese_name`,
          `${table.APPLICATION}.english_name`,
          `${table.APPLICATION_PERIOD}.application_year`,
          `${table.ROUND}.round`,
          `${table.APPLICATION_TYPE}.type as application_type`,
        ])
        .distinct(`${table.EMAIL_RECORD}.id`)
        .orderBy(`${table.EMAIL_RECORD}.submitted_at`, "desc")
        .limit(limit)
        .offset(offset);
    }

    //get total bounce number to calculate emailOffset based on count of 500
    const totalBounceRes = await fetch(
      `https://api.postmarkapp.com/deliverystats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": process.env.POSTMARK_API,
        },
      }
    );
    const amountPerPage = 500;
    const totalBounceResult = await totalBounceRes.json();
    const totalBounceNum = totalBounceResult["Bounces"][0]["Count"] || 0;
    let emailBatchNum = Math.ceil(totalBounceNum / amountPerPage);

    // If there is no fail record from postmark, return all record from db as successful
    // If there is no message id(fail during initially sending)
    if (emailBatchNum === 0) {
      const successEmails = result.map((record) => {
        ({
          ...record,
          email_status: record.message_id === "" ? "failed" : "success",
          idWithPrefix: parseInt(
            String(record.prefix) + String(record.application_id)
          ),
        });
      });

      return successEmails;
    }

    // If there is fail record from postmark
    let fetchEmailStatusResult: any[] = [];
    for (let i = 0; i < emailBatchNum; i++) {
      const emailOffset = String(i * amountPerPage);

      const tempRes = await fetch(
        `https://api.postmarkapp.com/bounces?count=${String(
          amountPerPage
        )}&offset=${emailOffset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Postmark-Server-Token": process.env.POSTMARK_API,
          },
        }
      );
      const tempResult = await tempRes.json();
      for (let singleBounce of tempResult.Bounces) {
        fetchEmailStatusResult.push(singleBounce);
      }
    }
    if (totalBounceNum > 0) {
      const messageIDOnly = fetchEmailStatusResult.map(
        (item) => item.MessageID
      );

      // for success email
      const successEmails = result
        .filter((emailRecord) => {
          return !messageIDOnly.includes(emailRecord.message_id);
        })
        .map((record) => ({
          ...record,
          email_status: record.message_id === "" ? "failed" : "success",
          idWithPrefix: parseInt(
            String(record.prefix) + String(record.application_id)
          ),
        }));

      // for fail email
      const bouncedEmails = result
        .filter((emailRecord) => {
          return messageIDOnly.includes(emailRecord.message_id);
        })
        .map((emailRecord) => {
          const resultFromAPI = fetchEmailStatusResult.filter(
            (item) => item.MessageID === emailRecord.message_id
          )[0];
          return {
            ...emailRecord,
            email_status: "failed",
            fail_type: resultFromAPI.Type,
            fail_message: resultFromAPI.Description,
            idWithPrefix: parseInt(
              String(emailRecord.prefix) + String(emailRecord.application_id)
            ),
          };
        });
      result = bouncedEmails.concat(successEmails);
    }

    return result;
  };

  //Get single Email
  getEmailByid = async (id: Number) => {
    const emailResult = await this.knex(table.EMAIL_RECORD)
      .select(`${table.EMAIL_RECORD}.*`)
      .whereRaw(`${table.EMAIL_RECORD}.id = ${id}`)
      .first();
    return emailResult;
  };

  addEmailRecord = async (
    applicationId: number,
    messageId: string,
    submitted_at: string,
    category: string
  ) => {
    const result = await this.knex(table.EMAIL_RECORD)
      .insert({
        application_id: applicationId,
        message_id: messageId,
        submitted_at: submitted_at,
        category: category,
      })
      .returning("id");
    return result[0];
  };
}
