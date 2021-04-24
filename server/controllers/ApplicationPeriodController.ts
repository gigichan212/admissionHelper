import { Request, Response } from "express";
import { ApplicationPeriodService } from "../services/ApplicationPeriodService";
import { logger } from "../utils/logger";
import httpStatusCodes from "http-status-codes";

export class ApplicationPeriodController {
  constructor(private applicationPeriodService: ApplicationPeriodService) {}

  //Get all application periods
  getAllPeriods = async (req: Request, res: Response) => {
    try {
      let { limit, offset } = req.query;

      //Get all periods
      const periods = await this.applicationPeriodService.getAllPeriods(
        parseInt(offset as string),
        parseInt(limit as string)
      );

      //Get number of application periods
      const count = await this.applicationPeriodService.countPeriods();

      if (periods) {
        res.json({ status: 200, data: periods, count: count });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Can't get application periods" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Check if there is any application records in a period
  haveAppRecords = async (req: Request, res: Response) => {
    try {
      const periodId = parseInt(req.params.id);

      //Check if the period id exist
      const period = await this.applicationPeriodService.getSingleRecord(
        periodId
      );

      //If application doesn't not exist, return
      if (!period) {
        res
          .status(httpStatusCodes.NOT_FOUND)
          .json({ message: "application period does not exist" });
        return;
      }

      //Check if there is any application records and count the number of applications
      const applicantCount = await this.applicationPeriodService.haveAppRecord(
        periodId
      );

      if (applicantCount > 0) {
        res.json({
          status: 200,
          haveRecord: true,
          count: applicantCount,
        });
      } else {
        res.json({ status: 200, haveRecord: false, count: 0 });
      }
    } catch (e) {
      logger.error(e.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Update application period
  updatePeriods = async (req: Request, res: Response) => {
    try {
      let { round, type, ...others } = req.body;

      let update;

      //Check if have round || type
      if (round || type) {
        //Get round id
        const roundId = await this.applicationPeriodService.getRoundId(round);

        //Get application type id
        const typeId = await this.applicationPeriodService.getAppTypeId(type);

        /////////////Check for active period before updating
        //Check if there is another active period with the same type
        //Should only have one active period
        const isActivePeriod = await this.applicationPeriodService.getActivePeriod(
          typeId
        );

        //If more than one active application record, throw error
        if (isActivePeriod && isActivePeriod.length > 1) {
          throw new Error("More than one active period with the same type");
        }

        //If so, check if the end date is passed
        //Check if the active period is the period we are updating
        if (isActivePeriod && isActivePeriod[0].id !== others.id) {
          const endDate = isActivePeriod[0].end_date;
          const isPassed = new Date() > new Date(endDate);

          //If yes, add new period and deactivate old period
          //If not, don't allow user to add new period
          if (isPassed) {
            const isUpdated = await this.applicationPeriodService.updatePeriod({
              id: isActivePeriod[0].id,
              is_active: false,
            });

            if (!isUpdated) {
              throw new Error("Deactivate previous application period failed");
            }
          } else {
            res
              .status(httpStatusCodes.UNAUTHORIZED)
              .json({ message: "Can't overlap current application period!" });
            return;
          }
        }

        //Update application period
        update = await this.applicationPeriodService.updatePeriod({
          ...others,
          round_id: roundId,
          application_type_id: typeId,
        });
      } else {
        //Check if the application period is active
        const periodData = await this.applicationPeriodService.getSingleRecord(
          others.id
        );
        //If not active, don't allow update
        if (!periodData.is_active) {
          res
            .status(httpStatusCodes.UNAUTHORIZED)
            .json({ message: "Can't update inactive period." });
          return;
        }

        update = await this.applicationPeriodService.updatePeriod(others);
      }

      if (update) {
        res.json({ status: 200, message: "updated", updated_at: update });
      } else {
        //If there is no result
        //Check if application period exist
        const period = await this.applicationPeriodService.getSingleRecord(
          others.id
        );

        if (!period) {
          res
            .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Application period not found" });
        } else {
          res
            .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Update application period failed" });
        }
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Add new period
  addPeriod = async (req: Request, res: Response) => {
    try {
      const { round, type, ...data } = req.body;

      //Get application type id
      const typeId = await this.applicationPeriodService.getAppTypeId(type);

      //Check if the there is another active period with the same type
      //Should only have one active period
      const isActivePeriod = await this.applicationPeriodService.getActivePeriod(
        typeId
      );

      //If more than one active application record, throw error
      if (isActivePeriod && isActivePeriod.length > 1) {
        throw new Error("More than one active period with the same type");
      }

      //If so, check if the end date is passed
      if (isActivePeriod && isActivePeriod[0]) {
        const endDate = isActivePeriod[0].end_date;
        const isPassed = new Date() > new Date(endDate);

        //If yes, add new period and deactivate old period
        //If not, don't allow user to add new period
        if (isPassed) {
          const isUpdated = await this.applicationPeriodService.updatePeriod({
            id: isActivePeriod[0].id,
            is_active: false,
          });

          if (!isUpdated) {
            throw new Error("Deactivate previous application period failed");
          }
        } else {
          res
            .status(httpStatusCodes.UNAUTHORIZED)
            .json({ message: "Can't overlap current application period!" });
          return;
        }
      }

      //Get round id
      const roundId = await this.applicationPeriodService.getRoundId(round);

      //TODO: Should have email template id
      const emailId = {
        confirmation_email_template_id: 23002786,
        first_interview_email_template_id: 23037574,
        second_interview_email_template_id: 23037575,
        admitted_email_template_id: 23037577,
      };

      //Add new application period
      const newPeriod: any = await this.applicationPeriodService.addPeriod({
        ...data,
        round_id: roundId,
        application_type_id: typeId,
        ...emailId,
      });

      //Pick out unwanted properties
      const {
        application_type_id,
        round_id,
        email_template_id,
        created_at,
        ...others
      } = newPeriod;

      if (newPeriod) {
        res.json({
          status: 200,
          data: { ...others, round: round, type: type },
        });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Add application period failed" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  getClosedPeriod = async (req: Request, res: Response) => {
    try {
      let { limit, offset } = req.query;

      const periods = await this.applicationPeriodService.getClosedPeriod(
        parseInt(offset as string),
        parseInt(limit as string)
      );

      if (periods) {
        res.json({ data: periods });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "internal server error" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };
  getAmendablePeriod = async (req: Request, res: Response) => {
    try {
      let { limit, offset } = req.query;

      const periods = await this.applicationPeriodService.getAmendablePeriod(
        parseInt(offset as string),
        parseInt(limit as string)
      );

      if (periods) {
        res.json({ data: periods });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "internal server error" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  getOpenPeriod = async (req: Request, res: Response) => {
    try {
      let { limit, offset } = req.query;

      const periods = await this.applicationPeriodService.getOpenPeriod(
        parseInt(offset as string),
        parseInt(limit as string)
      );

      if (periods) {
        res.json({ data: periods });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "internal server error" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  // getWillBeOpened = async (req: Request, res: Response) => {
  //   try {
  //     let { limit, offset } = req.query;

  //     const periods = await this.applicationPeriodService.getWillBeOpenPeriod(
  //       parseInt(offset as string),
  //       parseInt(limit as string)
  //     );

  //     if (periods) {
  //       res.json({ data: periods });
  //     } else {
  //       res
  //         .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
  //         .json({ message: "internal server error" });
  //     }
  //   } catch (err) {
  //     logger.error(err.message);
  //     res
  //       .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
  //       .json({ message: "internal server error" });
  //   }
  // };

  /*********************For public use************************************/
  // for registration form info showing and rules checking
  getActivePeriod = async (req: Request, res: Response) => {
    try {
      let result: any[] = [];
      // get period under normal/ interim, which is within start date/ end date
      const types = ["normal", "interim"];
      for (let type of types) {
        const resultFromDb = await this.applicationPeriodService.getActivePeriodByType(
          type
        );
        if (resultFromDb) {
          result.push(resultFromDb);
        }
      }

      res.json({
        isSuccess: true,
        data: result,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };
}
