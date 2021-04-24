import express from "express";
import { applicationPeriodController } from "../main";

// for dashboard user
export const applicationPeriodRoutes = express.Router();

applicationPeriodRoutes.get("/", applicationPeriodController.getAllPeriods);
applicationPeriodRoutes.post("/", applicationPeriodController.addPeriod);
applicationPeriodRoutes.get(
  "/have-app-record/:id",
  applicationPeriodController.haveAppRecords
);
applicationPeriodRoutes.put("/:id", applicationPeriodController.updatePeriods);

applicationPeriodRoutes.get(
  "/getClosedPeriod",
  applicationPeriodController.getClosedPeriod
);

applicationPeriodRoutes.get(
  "/getAmendablePeriod",
  applicationPeriodController.getAmendablePeriod
);

applicationPeriodRoutes.get(
  "/getOpenPeriod",
  applicationPeriodController.getOpenPeriod
);

// applicationPeriodRoutes.get(
//   "/getWillBeOpened",
//   applicationPeriodController.getWillBeOpened
// );

// for registration form info showing and rules checking
export const publicApplicationPeriodRoutes = express.Router();
publicApplicationPeriodRoutes.get(
  "/",
  applicationPeriodController.getActivePeriod
);
