import { Request, Response } from "express";
import { ApplicationService } from "../services/ApplicationService";
import { logger } from "../utils/logger";
import httpStatusCodes from "http-status-codes";
import { Relationship, SchoolHistory, Sibling } from "../utils/models";
import { s3 } from "../main";
import jwtSimple from "jwt-simple";
import { EmailRecordController } from "./EmailRecordControllers";

export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private emailRecordController: EmailRecordController
  ) {}

  // prevent unauthorized parent from reading others info
  parentAuthCheck = (reqParentUser: any, targetId: number) => {
    if (reqParentUser && targetId !== reqParentUser["id"]) {
      return "unauthorized";
    }
    return;
  };

  // Handle react hook form field array format
  parseString = (target: string, targetArr: any, type: string) => {
    if (!target) {
      return;
    }
    if (target.length === 2 || target.length === 3) {
      for (let item of target) {
        targetArr.push(JSON.parse(item));
      }
    } else {
      targetArr.push(JSON.parse(target));
    }
  };

  // at least fill 3 items for education/ parent; 2 items for sibling
  fillEnoughItems = (loopAmount: number, targetArr: any[], type: string) => {
    let info: any;
    if (type === "education") {
      info = {
        name: "",
        duration: "",
        grade: "",
        conduct_grade: "",
      };
    } else if (type === "parent") {
      info = {
        parent_type: "",
        chinese_name: "",
        english_name: "",
        occupation: "",
        office_address: "",
        office_phone: null,
        mobile: null,
      };
    } else if (type === "sibling") {
      info = { name: "", sex: "", school_name: "", grade: "" };
    }

    for (let i = 0; i < loopAmount; i++) {
      targetArr.push(info);
    }
  };

  // form validation
  forValidation = (body: Request["body"], files: any, type: string) => {
    let isMissingContent = false;
    let missingContent: string[] = [];
    const { education, parent, sibling } = body;
    [
      "level",
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
    ].forEach((item) => {
      if (!body[item]) {
        isMissingContent = true;
        missingContent.push(item);
      }
    });
    if (type === "post") {
      //Missing recent_photo
      if (!files?.recent_photo) {
        isMissingContent = true;
        missingContent.push("recent_photo");
      }
    }
    // Missing Education / Parent filed array
    if (!education || !parent) {
      isMissingContent = true;
      missingContent.push("education/ parent"); // To do: list missing items
    }
    if (
      body["have_sibling"] === "true" &&
      (!sibling || typeof sibling === "undefined")
    ) {
      isMissingContent = true;
      missingContent.push("sibling"); // To do: list missing items
    }

    return {
      isMissingContent: isMissingContent,
      missingContent: missingContent,
    };
  };

  // Insert application
  postApplication = async (req: Request, res: Response) => {
    try {
      const { type, role, periodId } = req.params;

      // Filed array value
      const { education, parent, sibling } = req.body;
      let educationArr: SchoolHistory[] = [];
      let parentArr: Relationship[] = [];
      let siblingArr: Sibling[] = [];

      // Parse string to JSON
      this.parseString(education[0], educationArr, education);
      this.parseString(parent[0], parentArr, parent);
      if (sibling) {
        this.parseString(sibling[0], siblingArr, sibling);
      }
      // Fill empty info if applicant didn't fill
      if (educationArr.length < 3 || parentArr.length < 3) {
        this.fillEnoughItems(
          3 - educationArr.length,
          educationArr,
          "education"
        );
        this.fillEnoughItems(3 - parentArr.length, parentArr, "parent");
      }
      if (siblingArr.length < 2) {
        this.fillEnoughItems(2 - siblingArr.length, siblingArr, "sibling");
      }

      // Form validation
      let { isMissingContent, missingContent } = this.forValidation(
        req.body,
        req.files,
        "post"
      );
      if (isMissingContent) {
        res.status(httpStatusCodes.BAD_REQUEST).json({
          message: `Missing Information`,
          missingContent: missingContent,
        });
        return;
      }

      // Get Applying application period
      let currentPeriod: { id: number } | undefined;
      if (req["user"]) {
        // dashboard user
        const id: number = parseInt(periodId as string);
        if (!isNaN(id)) {
          currentPeriod = await this.applicationService.getApplyingPeriod(
            null,
            id
          );
        }
      } else {
        currentPeriod = await this.applicationService.getApplyingPeriod(type);
      }
      if (!currentPeriod) {
        res.status(httpStatusCodes.BAD_REQUEST).json({
          message: `No Match Application Period`,
        });
        return;
      }

      // Get insert user Id (parent got hard code id)
      let userId: number | null = null;
      if (role === "parent") {
        userId = await this.applicationService.getApplyingUserId(role);
      } else if (role === "dashboard") {
        userId = req["user"]["id"];
      }

      // Get Applying application level
      const level = await this.applicationService.getApplyingLevel(
        req.body.level
      );
      // Get application status id
      const status = await this.applicationService.getApplicationStatus(
        req.body.application_status
      );

      // Check if interviewer really exists
      let interviewerId: number | null = null;
      if (req.body.interviewer) {
        interviewerId = await this.applicationService.checkInterviewerExist(
          req.body.interviewer
        );
      }

      // convert deposit slip names to array
      let recentPhotoArr: string[] = [];
      let slipsArr: string[] = [];
      if ((req.files as any).slips) {
        for (let i = 0; i < (req.files as any).slips.length; i++) {
          slipsArr.push((req.files as any).slips[i]["key"]);
        }
      }
      if ((req.files as any).recent_photo) {
        for (let i = 0; i < (req.files as any).recent_photo.length; i++) {
          recentPhotoArr.push((req.files as any).recent_photo[i]["key"]);
        }
      }

      // Insert Application
      const application = await this.applicationService.addApplication(
        role,
        req.body,
        currentPeriod.id,
        level.id,
        userId as number,
        recentPhotoArr[0],
        slipsArr,
        interviewerId,
        status.id,
        educationArr,
        parentArr,
        siblingArr
      );

      // provide token for sending confirmation  email
      const token = jwtSimple.encode(
        {
          applicationId: application.id,
          exp: Date.now() / 1000 + 3600 * 2,
        },
        process.env.JWT_SECRET!
      );

      const applicationIdWithPrefix =
        String(application.prefix) + String(application.id);

      res.json({
        isSuccess: true,
        applicationId: application.id,
        applicationIdWithPrefix: applicationIdWithPrefix,
        createdAt: application["created_at"],
        token: token,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Get all applications and number of applications
  getAllApplications = async (req: Request, res: Response) => {
    try {
      let { limit, offset, sort_by, interviewer_id } = req.query;

      let applicationData;

      if (interviewer_id) {
        //Get application records for a specific teacher
        applicationData = await this.applicationService.getAllApplications(
          parseInt(offset as string),
          parseInt(limit as string),
          sort_by as string,
          String(interviewer_id)
        );
      } else {
        //Get all application records
        applicationData = await this.applicationService.getAllApplications(
          parseInt(offset as string),
          parseInt(limit as string),
          sort_by as string
        );
      }

      //Get number of applications
      const counts = await this.applicationService.getNumOfApplications();

      res.json({ data: applicationData, count: counts });
    } catch (e) {
      logger.error(e.message);
      res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: e });
    }
  };

  //Get all active applications
  getAllActiveApplications = async (req: Request, res: Response) => {
    try {
      const activeApplicationData = await this.applicationService.getAllActiveApplication();

      res.json({ data: activeApplicationData });
    } catch (error) {
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error });
    }
  };

  //Get an specific application
  getApplication = async (req: Request, res: Response) => {
    try {
      // parent can only read own application record
      const targetId = parseInt(req.params.id);
      if (
        this.parentAuthCheck(req["parentUser"], targetId) === "unauthorized"
      ) {
        res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ message: "unauthorized" });
        return;
      }

      // get application from db
      const applicationData = await this.applicationService.getApplication(
        targetId
      );

      // Application Not Found
      if (!applicationData) {
        res.status(httpStatusCodes.NOT_FOUND).json({ message: "Not found" });
        return;
      }

      // success get application
      res.json({
        isSuccess: true,
        data: Object.values(applicationData),
        count: 1,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  // Get application image
  getApplicationImage = async (req: Request, res: Response) => {
    try {
      // parent can only read own application record
      const targetId = parseInt(req.params.id);
      if (
        this.parentAuthCheck(req["parentUser"], targetId) === "unauthorized"
      ) {
        res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ message: "unauthorized" });
        return;
      }

      const params = {
        Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
        Key: req.params.imageKey,
      };

      if (!params) {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "s3 params is not found" });
        return;
      }

      s3.getObject(
        params as {
          Bucket: string;
          Key: string;
        },
        function (err: Error, data: any) {
          if (err) {
            console.log(err);
            res
              .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: "internal server error" });
            return;
          }
          res.writeHead(200, {
            "Content-Type": "image/jpeg",
          });
          res.write(data.Body, "binary");
          res.end(null, "binary");
          return;
        }
      );
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  // Update application info
  putApplication = async (req: Request, res: Response) => {
    try {
      const targetId = parseInt(req.params.id);
      const updateDepositSlipOnly = req.params.updateDepositSlipOnly;
      // parent can only update own application record
      if (
        this.parentAuthCheck(req["parentUser"], targetId) === "unauthorized"
      ) {
        res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ message: "unauthorized" });
        return;
      }

      // convert deposit slip names to array
      let recentPhotoArr: string[] = [];
      let slipsArr: string[] = [];
      if ((req.files as any).slips) {
        for (let i = 0; i < (req.files as any).slips.length; i++) {
          slipsArr.push((req.files as any).slips[i]["key"]);
        }
      }
      if ((req.files as any).recent_photo) {
        for (let i = 0; i < (req.files as any).recent_photo.length; i++) {
          recentPhotoArr.push((req.files as any).recent_photo[i]["key"]);
        }
      }

      //  Get user Id (parent got hard code id)
      //  Define user role
      let userId: number | null = null;
      let role: string = "";
      let status: { id: number } | undefined;
      let currentPeriod: { id: number } | undefined;
      if (req["parentUser"]) {
        userId = await this.applicationService.getApplyingUserId("parent");
        role = "parent";

        // check if the request within edit deadline (for parent only)
        const editDeadline = await this.applicationService.checkPeriodDeadline(
          targetId
        );

        if (!editDeadline) {
          res.status(httpStatusCodes.BAD_REQUEST).json({
            message: `Edit period is expired`,
          });
          return;
        }

        // for the case of updating deposit only
        if (updateDepositSlipOnly === "true") {
          const updateResult = await this.applicationService.putApplicationDeposit(
            targetId,
            req.body,
            slipsArr
          );
          if (updateResult === "success") {
            res.json({
              isSuccess: true,
              applicationId: targetId,
            });
            return;
          }
          return;
        }
      } else if (req["user"]) {
        userId = req["user"]["id"];
        role = "dashboard";

        //  Get application status id (for dashboard user)
        status = await this.applicationService.getApplicationStatus(
          req.body.application_status
        );
        // Get Applying application period (for dashboard user only)
        if (!isNaN(req.body.application_period_id)) {
          currentPeriod = await this.applicationService.getApplyingPeriod(
            null,
            req.body.application_period_id
          );
        }
      }

      // Field array value
      const { education, parent, sibling } = req.body;
      let educationArr: SchoolHistory[] = [];
      let parentArr: Relationship[] = [];
      let siblingArr: Sibling[] = [];

      //Parse string to JSON
      this.parseString(education[0], educationArr, education);
      this.parseString(parent[0], parentArr, parent);
      if (sibling) {
        this.parseString(sibling[0], siblingArr, sibling);
      } else {
        this.fillEnoughItems(2 - siblingArr.length, siblingArr, "sibling");
      }

      // Form validation
      let { isMissingContent, missingContent } = this.forValidation(
        req.body,
        req.files,
        "put"
      );
      if (isMissingContent) {
        res.status(httpStatusCodes.BAD_REQUEST).json({
          message: `Missing Information`,
          missingContent: missingContent,
        });
        return;
      }

      // Get Applying application level
      const level = await this.applicationService.getApplyingLevel(
        req.body.level
      );

      // Check if interviewer really exists
      let interviewerId: number | null = null;
      if (req.body.interviewer) {
        interviewerId = await this.applicationService.checkInterviewerExist(
          req.body.interviewer
        );
      }

      // update application
      const updateResult = await this.applicationService.putApplication(
        targetId,
        role,
        req.body,
        level.id,
        currentPeriod?.id as number,
        userId as number,
        recentPhotoArr[0],
        slipsArr,
        interviewerId,
        status?.id as number,
        educationArr,
        parentArr,
        siblingArr
      );
      if (!updateResult) {
        res.status(httpStatusCodes.BAD_REQUEST);
        return;
      }

      res.json({
        isSuccess: true,
        applicationId: updateResult.id,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  batchUpdateApps = async (req: Request, res: Response) => {
    try {
      const {
        selected,
        status,
        interviewer_id,
        interview_date_time,
        application_period_id,
        application_status,
      } = req.body;

      const { id } = req["user"];

      if (selected) {
        let updateResult;

        if (status) {
          //Get status id
          const statusId = (
            await this.applicationService.getApplicationStatus(status)
          ).id;

          //Batch update application status
          updateResult = await this.applicationService.batchUpdate(
            selected,
            {
              application_status_id: statusId,
            },
            id
          );
        } else if (interviewer_id && interview_date_time) {
          //Batch update application interviewer and interview date
          updateResult = await this.applicationService.batchUpdate(
            selected,
            {
              interviewer_id: interviewer_id,
              interview_date_time: interview_date_time,
            },
            id
          );
        }

        if (updateResult) {
          res.json({
            status: 200,
            message: "Batch update success",
            updated_at: updateResult.updated_at,
            updated_user_id: updateResult.updated_user_id,
          });
          return;
        }
      }

      // for sending batch email, no need for select option
      if (application_period_id && application_status) {
        // get email list by application periodId and status
        const emailListResult = await this.applicationService.getApplicationForEmailSending(
          application_period_id,
          application_status
        );

        if (emailListResult.length > 0) {
          // send email if email list is not empty
          const sendEmailResult = await this.emailRecordController.getSendBatchEmailInfo(
            emailListResult,
            application_status
          );

          // successfully sent emails
          if (sendEmailResult && sendEmailResult.length > 0) {
            res.json({
              status: 200,
              isSendEmail: true,
              recordCount: sendEmailResult[0].length,
              failRecordCount: sendEmailResult[1].length,
              failEmailRecord: sendEmailResult[1],
            });
            return;
          }

          // failure during sending email
          res
            .status(httpStatusCodes.BAD_REQUEST)
            .json({ message: "Fail to send email" });
          return;
        }
      }

      res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: "update information not found" });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Batch Update - internal server error" });
    }
  };

  getBatchEmailNum = async (req: Request, res: Response) => {
    try {
      const { periodId, status } = req.params;
      if (!isNaN(parseInt(periodId))) {
        const result = await this.applicationService.getApplicationForEmailSending(
          parseInt(periodId),
          status
        );

        res.json({ isSuccess: true, count: result.length });
        return;
      }
      res.json({ isSuccess: true, count: 0 });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  exportExcel = async (req: Request, res: Response) => {
    try {
      const { selected } = req.body;
      if (selected) {
        const result = await this.applicationService.getExportExcelData(
          selected
        );
        res.json({ isSuccess: true, data: result });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  };

  searchApplications = async (req: Request, res: Response) => {
    try {
      //body should contain search query, offset, limit, sort by
      const { offset, limit, sortBy, data } = req.body;

      // Search on data given
      const searchRes = await this.applicationService.searchAllApplications(
        parseInt(offset),
        parseInt(limit),
        sortBy,
        data
      );

      //Count number of search data
      const count = (
        await this.applicationService.searchAllApplications(
          0,
          1000000000,
          sortBy,
          data
        )
      )?.length;

      //return count of search results and results
      if (searchRes && searchRes.length > 0) {
        res.json({ status: 200, data: searchRes, count: count });
        return;
      } else {
        res.json({ status: 200, data: searchRes, count: 0 });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Search Application - internal server error" });
    }
  };
}
