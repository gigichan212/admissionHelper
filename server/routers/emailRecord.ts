import express from "express";
import { emailRecordController } from "../main";

// send confirmation email
export const publicEmailRoutes = express.Router();
publicEmailRoutes.get("/", emailRecordController.getSendConfirmationEmailInfo);

// for dashboard user
export const emailRecordRoutes = express.Router();
emailRecordRoutes.post(
  "/isWithSearch/:isWithSearch",
  emailRecordController.getALlEmail
);
