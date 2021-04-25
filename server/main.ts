import express from "express";
import cors from "cors";
import Knex from "knex";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
// multer
import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

const knexConfig = require("./knexfile");
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3466",
      "http://localhost:3002",
      "http://localhost:3000",
      "http://localhost:2000",
      "https://admissionhelper.site",
      "https://admin.admissionhelper.site",
      "https://admissionhelper.online",
      "https://admin.admissionhelper.online",
    ],
  })
);

app.use((req, res, next) => {
  const message = `method: [${req.method}] path: [${req.path}]`;
  logger.info(message);
  next();
});

// Multer
export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_UPLOAD_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_UPLOAD_SECRET_ACCESS_KEY,
  region: process.env.AWS_UPLOAD_SECRET_REGION,
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "frd-final-project",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(
        null,
        `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
      );
    },
  }),
});
//Application Service
import { ApplicationService } from "./services/ApplicationService";
const applicationService = new ApplicationService(knex);

//Email Controller & Service
import { EmailRecordService } from "./services/EmailRecordService";
import { EmailRecordController } from "./controllers/EmailRecordControllers";
export const emailRecordService = new EmailRecordService(
  knex,
  applicationService
);
export const emailRecordController = new EmailRecordController(
  emailRecordService
);

//Application Controller
import { ApplicationController } from "./controllers/ApplicationController";
export const applicationController = new ApplicationController(
  applicationService,
  emailRecordController
);

//User Controller & Service
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
export const userService = new UserService(knex);
export const userController = new UserController(
  userService,
  emailRecordController
);

//Application Period Controller & Service
import { ApplicationPeriodService } from "./services/ApplicationPeriodService";
import { ApplicationPeriodController } from "./controllers/ApplicationPeriodController";
export const applicationPeriodService = new ApplicationPeriodService(knex);
export const applicationPeriodController = new ApplicationPeriodController(
  applicationPeriodService
);

//Web content Controller & Service
import { WebContentService } from "./services/WebContentService";
import { WebContentController } from "./controllers/WebContentController";
export const webContentService = new WebContentService(knex);
export const webContentController = new WebContentController(webContentService);

// API
import { routes } from "./routes";
//import { fileURLToPath } from "node:url";

// Set API Routing
const API_VERSION = process.env.API_VERSION ?? "/api/v1";
app.use(API_VERSION, routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`listening to port: [${PORT}]`);
});
