import express from "express";
import {
  isLoggedInAPI,
  isParentOrUserLoggedInAPI,
  sendEmailGuard,
} from "./utils/guards";
import {
  applicationRoutes,
  parentApplicationRoutes,
} from "./routers/application";
import { parentUserRoutes, userRoutes } from "./routers/user";
import {
  applicationPeriodRoutes,
  publicApplicationPeriodRoutes,
} from "./routers/applicationPeriod";
import { isAdmin } from "./utils/middleware";
import { webContentRoutes } from "./routers/webContent";
import { emailRecordRoutes, publicEmailRoutes } from "./routers/emailRecord";

export const routes = express.Router();
// for both parent and dashboard user
routes.use("/application-period", publicApplicationPeriodRoutes);
routes.use("/application", isParentOrUserLoggedInAPI, applicationRoutes);

// for parent
routes.use("/public/application", parentApplicationRoutes);
routes.use("/public/user", isParentOrUserLoggedInAPI, parentUserRoutes);
routes.use("/public/email", sendEmailGuard, publicEmailRoutes); // send confirmation email
routes.use("/public/login", parentUserRoutes);

// for dashboard user
routes.use("/dashboard/login", userRoutes);
routes.use("/dashboard/user", isLoggedInAPI, userRoutes);
routes.use("/dashboard/application", isLoggedInAPI, applicationRoutes);
// period
routes.use(
  "/dashboard/teacher/application-period",
  isLoggedInAPI,
  applicationPeriodRoutes
); // for teacher/ admin
routes.use(
  "/dashboard/application-period",
  isLoggedInAPI,
  isAdmin,
  applicationPeriodRoutes
); // for admin
routes.use("/dashboard/webContent", isLoggedInAPI, isAdmin, webContentRoutes);
routes.use("/dashboard/email", isLoggedInAPI, isAdmin, emailRecordRoutes);
