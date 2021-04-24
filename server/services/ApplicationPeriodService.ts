import { Knex } from "knex";
import { table } from "../utils/tables";
import { logger } from "../utils/logger";

export class ApplicationPeriodService {
  constructor(private knex: Knex) {}

  //Get all application periods
  getAllPeriods = async (offset: number = 0, limit: number = 10000000) => {
    const trx = await this.knex.transaction();

    try {
      if (isNaN(offset)) {
        offset = 0;
      }
      if (isNaN(limit)) {
        limit = 10000000;
      }

      //Get all periods
      const periodsEndDate: any = await trx(table.APPLICATION_PERIOD)
        .select("id", "end_date", "is_active")
        .where({ is_active: true });

      //Filter out inactive period
      const periodInactive = periodsEndDate.filter(
        (period: any) => new Date() > new Date(period.end_date)
      );

      //If period end date passed today, update the period to inactive
      if (periodInactive.length > 0) {
        for (let period of periodInactive) {
          const updated = await trx(table.APPLICATION_PERIOD)
            .where({
              id: period.id,
            })
            .update({ is_active: false });

          if (!updated) {
            throw new Error("Inactivate period failed");
          }
        }
      }

      //Get all periods
      const periods: any = await trx(table.APPLICATION_PERIOD)
        .innerJoin(
          "application_type",
          "application_period.application_type_id",
          "application_type.id"
        )
        .innerJoin("round", "application_period.round_id", "round.id")
        .select([
          "application_period.id",
          "application_type.type",
          "application_period.application_year",
          "round.round",
          "application_period.start_date",
          "application_period.end_date",
          "application_period.end_deadline",
          "application_period.updated_at",
          `${table.APPLICATION_PERIOD}.is_active`,
        ])
        .orderBy("application_period.created_at", "desc")
        .limit(limit as number)
        .offset(offset as number)
        .returning("*");

      // // split date_time format to date/ time
      // for (let item of periods) {
      //   item["start_time"] = moment(item["start_date"]).format("HH:mm");
      //   item["start_date"] = moment(item["start_date"]).format("YYYY-MM-DD");
      //   item["end_time"] = moment(item["end_date"]).format("HH:mm");
      //   item["end_date"] = moment(item["end_date"]).format("YYYY-MM-DD");
      //   item["end_deadline_time"] = moment(item["end_deadline"]).format(
      //     "HH:mm"
      //   );
      //   item["end_deadline"] = moment(item["end_deadline"]).format(
      //     "YYYY-MM-DD"
      //   );
      // }

      await trx.commit();

      return periods;
    } catch (e) {
      logger.error(e.message);
      await trx.rollback();
      return;
    }
  };

  //Get number of application periods
  countPeriods = async () => {
    try {
      const count = await this.knex(table.APPLICATION_PERIOD).count("*");

      return count[0].count;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Check if there is any application record
  //Get number of applicant in a specific period
  haveAppRecord = async (periodId: number) => {
    try {
      const appRecordCount: any = await this.knex(table.APPLICATION)
        .where({ application_period_id: periodId })
        .count("*");

      return appRecordCount[0].count;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get a single period
  getSingleRecord = async (periodId: number) => {
    try {
      const period: any = (
        await this.knex(table.APPLICATION_PERIOD).where({
          id: periodId,
        })
      )[0];

      return period;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get round id
  getRoundId = async (round: string) => {
    try {
      const result = await this.knex(table.ROUND)
        .select("id")
        .where({ round: round });

      return result[0].id;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get application type id
  getAppTypeId = async (type: string) => {
    try {
      const result = await this.knex(table.APPLICATION_TYPE)
        .select("id")
        .where({ type: type });

      return result[0].id;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Update an application period
  updatePeriod = async (data: any) => {
    try {
      const { id, ...others } = data;

      const result = await this.knex(table.APPLICATION_PERIOD)
        .where({ id: id })
        .update({ ...others, updated_at: new Date() })
        .returning("updated_at");

      return result[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Add new application period
  addPeriod = async (data: any) => {
    try {
      const result = await this.knex(table.APPLICATION_PERIOD)
        .insert(data)
        .returning("*");

      return result[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get active application period with normal/interim
  getActivePeriod = async (typeId: number) => {
    try {
      const result = await this.knex(table.APPLICATION_PERIOD).where({
        application_type_id: typeId,
        is_active: true,
      });

      return result;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  getClosedPeriod = async (offset?: number, limit?: number) => {
    try {
      //get all closed periods without limit
      if (!offset && !limit) {
        const periods: any = await this.knex(table.APPLICATION_PERIOD)
          .innerJoin(
            "application_type",
            "application_period.application_type_id",
            "application_type.id"
          )
          .innerJoin("round", "application_period.round_id", "round.id")
          .select([
            "application_period.id",
            "application_type.type",
            "application_period.application_year",
            "round.round",
            "application_period.start_date",
            "application_period.end_date",
            "application_period.end_deadline",
            "application_period.updated_at",
          ])
          .orderBy("application_period.created_at", "desc")
          .where("application_period.end_date", "<", "NOW()")
          .returning("*");
        return periods;
      }

      const periods: any = await this.knex(table.APPLICATION_PERIOD)
        .innerJoin(
          "application_type",
          "application_period.application_type_id",
          "application_type.id"
        )
        .innerJoin("round", "application_period.round_id", "round.id")
        .select([
          "application_period.id",
          "application_type.type",
          "application_period.application_year",
          "round.round",
          "application_period.start_date",
          "application_period.end_date",
          "application_period.end_deadline",
          "application_period.updated_at",
        ])
        .orderBy("application_period.created_at", "desc")
        .limit(limit as number)
        .offset(offset as number)
        .where("application_period.end_deadline", "<", "NOW()")
        .where("application_period.end_date", "<", "NOW()")
        .where("application_period.start_date", "<", "NOW()")
        .returning("*");

      return periods;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  getAmendablePeriod = async (offset?: number, limit?: number) => {
    try {
      //get all closed periods without limit
      if (!offset && !limit) {
        const periods: any = await this.knex(table.APPLICATION_PERIOD)
          .innerJoin(
            "application_type",
            "application_period.application_type_id",
            "application_type.id"
          )
          .innerJoin("round", "application_period.round_id", "round.id")
          .select([
            "application_period.id",
            "application_type.type",
            "application_period.application_year",
            "round.round",
            "application_period.start_date",
            "application_period.end_date",
            "application_period.end_deadline",
            "application_period.updated_at",
          ])
          .orderBy("application_period.created_at", "desc")
          .where("application_period.end_deadline", ">", "NOW()")
          // .where("application_period.end_date", ">", "NOW()")
          .where("application_period.start_date", "<", "NOW()")
          .returning("*");
        return periods;
      }

      const periods: any = await this.knex(table.APPLICATION_PERIOD)
        .innerJoin(
          "application_type",
          "application_period.application_type_id",
          "application_type.id"
        )
        .innerJoin("round", "application_period.round_id", "round.id")
        .select([
          "application_period.id",
          "application_type.type",
          "application_period.application_year",
          "round.round",
          "application_period.start_date",
          "application_period.end_date",
          "application_period.end_deadline",
          "application_period.updated_at",
        ])
        .orderBy("application_period.created_at", "desc")
        .limit(limit as number)
        .offset(offset as number)
        .where("application_period.end_deadline", ">", "NOW()")
        // .where("application_period.end_date", ">", "NOW()")
        .where("application_period.start_date", "<", "NOW()")
        .returning("*");

      return periods;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  getOpenPeriod = async (offset?: number, limit?: number) => {
    try {
      //get all closed periods without limit
      if (!offset && !limit) {
        const periods: any = await this.knex(table.APPLICATION_PERIOD)
          .innerJoin(
            "application_type",
            "application_period.application_type_id",
            "application_type.id"
          )
          .innerJoin("round", "application_period.round_id", "round.id")
          .select([
            "application_period.id",
            "application_type.type",
            "application_period.application_year",
            "round.round",
            "application_period.start_date",
            "application_period.end_date",
            "application_period.end_deadline",
            "application_period.updated_at",
          ])
          .orderBy("application_period.created_at", "desc")
          .where("application_period.end_deadline", ">", "NOW()")
          .where("application_period.end_date", ">", "NOW()")
          .where("application_period.start_date", "<", "NOW()")
          .returning("*");
        return periods;
      }

      const periods: any = await this.knex(table.APPLICATION_PERIOD)
        .innerJoin(
          "application_type",
          "application_period.application_type_id",
          "application_type.id"
        )
        .innerJoin("round", "application_period.round_id", "round.id")
        .select([
          "application_period.id",
          "application_type.type",
          "application_period.application_year",
          "round.round",
          "application_period.start_date",
          "application_period.end_date",
          "application_period.end_deadline",
          "application_period.updated_at",
        ])
        .orderBy("application_period.created_at", "desc")
        .limit(limit as number)
        .offset(offset as number)
        .where("application_period.end_deadline", ">", "NOW()")
        .where("application_period.end_date", ">", "NOW()")
        .where("application_period.start_date", "<", "NOW()")
        .returning("*");

      return periods;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  // getWillBeOpenPeriod = async (offset?: number, limit?: number) => {
  //   try {
  //     //get all closed periods without limit
  //     if (!offset && !limit) {
  //       const periods: any = await this.knex(table.APPLICATION_PERIOD)
  //         .innerJoin(
  //           "application_type",
  //           "application_period.application_type_id",
  //           "application_type.id"
  //         )
  //         .innerJoin("round", "application_period.round_id", "round.id")
  //         .select([
  //           "application_period.id",
  //           "application_type.type",
  //           "application_period.application_year",
  //           "round.round",
  //           "application_period.start_date",
  //           "application_period.end_date",
  //           "application_period.end_deadline",
  //           "application_period.updated_at",
  //         ])
  //         .orderBy("application_period.created_at", "desc")
  //         .where("application_period.end_deadline", ">", "NOW()")
  //         .where("application_period.end_date", ">", "NOW()")
  //         .where("application_period.start_date", "<", "NOW()")
  //         .returning("*");
  //       return periods;
  //     }

  //     const periods: any = await this.knex(table.APPLICATION_PERIOD)
  //       .innerJoin(
  //         "application_type",
  //         "application_period.application_type_id",
  //         "application_type.id"
  //       )
  //       .innerJoin("round", "application_period.round_id", "round.id")
  //       .select([
  //         "application_period.id",
  //         "application_type.type",
  //         "application_period.application_year",
  //         "round.round",
  //         "application_period.start_date",
  //         "application_period.end_date",
  //         "application_period.end_deadline",
  //         "application_period.updated_at",
  //       ])
  //       .orderBy("application_period.created_at", "desc")
  //       .limit(limit as number)
  //       .offset(offset as number)
  //       .where("application_period.end_deadline", ">", "NOW()")
  //       .where("application_period.end_date", ">", "NOW()")
  //       .where("application_period.start_date", ">", "NOW()")
  //       .returning("*");

  //     return periods;
  //   } catch (e) {
  //     logger.error(e.message);
  //     return;
  //   }
  // };

  // getActivePeriodByType
  getActivePeriodByType = async (type: string) => {
    try {
      const result = await this.knex(table.APPLICATION_PERIOD)
        .innerJoin(
          table.APPLICATION_TYPE,
          `${table.APPLICATION_TYPE}.id`,
          `${table.APPLICATION_PERIOD}.application_type_id`
        )
        .where(`${table.APPLICATION_TYPE}.type`, type)
        .where(`${table.APPLICATION_PERIOD}.start_date`, "<", "now()")
        .where(`${table.APPLICATION_PERIOD}.end_date`, ">", "now()")
        .where(`${table.APPLICATION_PERIOD}.is_active`, true)
        .select([
          `${table.APPLICATION_PERIOD}.*`,
          `${table.APPLICATION_TYPE}.type`,
          `${table.APPLICATION_TYPE}.application_procedure`,
          `${table.APPLICATION_TYPE}.application_note`,
          `${table.APPLICATION_TYPE}.confirmation_letter`,
        ])
        .first();

      if (!result) {
        return;
      }

      return result;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };
}
