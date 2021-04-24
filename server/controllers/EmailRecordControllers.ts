import { Request, Response } from "express";
import { EmailRecordService } from "../services/EmailRecordService";
import httpStatusCodes from "http-status-codes";
import { logger } from "../utils/logger";
import { InfoForEmail, sendEmailResultInterface } from "../utils/models";
import { emailTemplateIdMapping } from "../utils/Mapping";

// Email Service
const postmark = require("postmark");
export const emailClient = new postmark.ServerClient(process.env.POSTMARK_API);

export class EmailRecordController {
  constructor(private emailRecordService: EmailRecordService) {}

  // Send confirmation/ first round interview/ second round interview/ approval email
  sendEmail = async (info: InfoForEmail[]) => {
    try {
      let result: any[] = [];
      for (let singleInfo of info) {
        try {
          const res = await emailClient.sendEmailWithTemplate({
            From: "info@teentraininghk.com",
            To: singleInfo["recipient"],
            TemplateId: singleInfo["templateId"],
            TemplateModel: singleInfo["templateModel"],
            track_opens: true,
            MessageStream: "outbound",
          });

          result.push({
            category: singleInfo["category"],
            applicationId: singleInfo["applicationId"],
            To: res["To"],
            SubmittedAt: res["SubmittedAt"],
            MessageID: res["MessageID"],
          });
        } catch (err) {
          // if there is no record from postmark, insert empty MessageID
          result.push({
            category: singleInfo["category"],
            applicationId: singleInfo["applicationId"],
            To: singleInfo["templateModel"]["email"],
            SubmittedAt: new Date(),
            MessageID: "",
            fail: true,
          });
        }
      }

      return result;
    } catch (err) {
      logger.error(err.message);
      return;
    }
  };

  // Get required info for sending confirmation email
  getSendConfirmationEmailInfo = async (req: Request, res: Response) => {
    try {
      console.log("sending confirmation email");
      const applicationId = req["sendEmailApplicationId"].id;
      // get email sending info
      const emailInfo = await this.emailRecordService.getInfoForEmail(
        [applicationId],
        "confirmation_email_template_id"
      );

      // Send confirmation email
      const sendEmailResult:
        | sendEmailResultInterface[]
        | undefined = await this.sendEmail(emailInfo);
      if (!sendEmailResult || typeof sendEmailResult === "undefined") {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ message: "Fail to send email" });
        return;
      }

      // finished send email and delete req["sendEmailApplicationId"]
      delete req["sendEmailApplicationId"];

      // add email record
      const addEmailRecordResult:
        | number[]
        | undefined = await this.addEmailRecord(
        sendEmailResult as sendEmailResultInterface[]
      );

      if (
        typeof addEmailRecordResult === "undefined" ||
        addEmailRecordResult.length === 0
      ) {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ message: "Fail to insert email record" });
        return;
      }

      res.json({
        isSuccess: true,
        addEmailRecordResult: addEmailRecordResult,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  // Send login email
  sendLoginEmail = async (
    idWithPrefix: string,
    applicationId: number,
    email: string,
    chinese_name: string,
    english_name: string,
    token: string
  ) => {
    try {
      console.log("sending loginEmail");

      // Send login email and add to email record table
      const sendEmailResult = await this.sendEmail([
        {
          category: "login",
          applicationId: applicationId,
          recipient: email,
          templateId: 23033270,
          templateModel: {
            idWithPrefix: idWithPrefix,
            email: email,
            chinese_name: chinese_name,
            english_name: english_name,
            application_year: 2021,
            loginURL: `${process.env.APP_FRONTEND_REGISTRATION_HOST}/login-request/token/${token}`,
          },
        },
      ]);

      if (!sendEmailResult || typeof sendEmailResult === "undefined") {
        return false;
      }

      console.log(
        "login url: ",
        `${process.env.APP_FRONTEND_REGISTRATION_HOST}/login-request/token/${token}`
      );

      // add email record
      const addEmailRecordResult:
        | number[]
        | undefined = await this.addEmailRecord(
        sendEmailResult as sendEmailResultInterface[]
      );

      if (
        typeof addEmailRecordResult === "undefined" ||
        addEmailRecordResult.length === 0
      ) {
        return false;
      }

      return true;
    } catch (err) {
      logger.error(err.message);
      return;
    }
  };

  // Get required info for sending batch email
  getSendBatchEmailInfo = async (
    emailListResult: number[],
    application_status: string
  ) => {
    try {
      console.log("sending batch email");
      // get email sending info
      const emailInfo = await this.emailRecordService.getInfoForEmail(
        emailListResult,
        emailTemplateIdMapping.get(application_status)
      );

      let result: number[] = [];
      let failResult: string[] = [];
      for (let info of emailInfo) {
        // Send batch email
        const sendEmailResult:
          | sendEmailResultInterface[]
          | undefined = await this.sendEmail([info]);
        if (!sendEmailResult || typeof sendEmailResult === "undefined") {
          return false;
        }

        // if there is fail record, push into failResult
        if (sendEmailResult[0]["fail"]) {
          failResult.push(sendEmailResult[0]["To"]);
        }

        // add email record
        const addEmailRecordResult:
          | number[]
          | undefined = await this.addEmailRecord(
          sendEmailResult as sendEmailResultInterface[]
        );
        if (
          typeof addEmailRecordResult === "undefined" ||
          addEmailRecordResult.length === 0
        ) {
          return false;
        }
        result.push(addEmailRecordResult[0]);
      }

      return [result, failResult];
    } catch (err) {
      logger.error(err.message);
      return;
    }
  };

  //get all email records
  getALlEmail = async (req: Request, res: Response) => {
    try {
      const isWithSearch = req.params.isWithSearch;
      const { offset, limit, data } = req.body;
      let records: any[] = [];
      let counts: any;
      // get all record
      if (isWithSearch === "false") {
        records = await this.emailRecordService.getAllEmailRecords(
          parseInt(limit as string),
          parseInt(offset as string)
        );
        counts = await this.emailRecordService.getNumOfEmailRecords();
      } else {
        // with searching query
        records = await this.emailRecordService.getAllEmailRecords(
          parseInt(limit as string),
          parseInt(offset as string),
          data
        );
        counts = (
          await this.emailRecordService.getAllEmailRecords(0, 1000000000, data)
        )?.length;
      }

      if (records && records.length > 0) {
        res.json({ status: 200, data: records, count: counts.count });
      } else {
        res.json({ status: 200, data: records, count: 0 });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  // insert email record
  addEmailRecord = async (sendEmailResult: sendEmailResultInterface[]) => {
    try {
      let addEmailRecordResult: number[] = [];

      for (let item of sendEmailResult!) {
        const temp: number = await this.emailRecordService.addEmailRecord(
          item["applicationId"],
          item["MessageID"],
          item["SubmittedAt"],
          item["category"]
        );
        addEmailRecordResult.push(temp);
      }

      return addEmailRecordResult;
    } catch (err) {
      logger.error(err.message);
      return;
    }
  };
}
