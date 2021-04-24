import express from "express";
import { applicationController, upload } from "../main";
import { isAdmin } from "../utils/middleware";

export const parentApplicationRoutes = express.Router();
export const applicationRoutes = express.Router();

applicationRoutes.put(
  "/batch-update",
  isAdmin,
  applicationController.batchUpdateApps
);
/**********Parent usage**************/
//without login permission
parentApplicationRoutes.post(
  "/type/:type/role/:role",
  upload.fields([
    { name: "recent_photo", maxCount: 1 },
    { name: "slips", maxCount: 8 },
  ]),
  applicationController.postApplication
);

/**********Common usage**************/
//login permission required
applicationRoutes.get(
  "/allActiveApplication",
  applicationController.getAllActiveApplications
);
applicationRoutes.get("/id/:id", applicationController.getApplication);
applicationRoutes.get(
  "/id/:id/imageKey/:imageKey",
  applicationController.getApplicationImage
);

applicationRoutes.put(
  "/id/:id/updateDepositSlipOnly/:updateDepositSlipOnly",
  upload.fields([
    { name: "recent_photo", maxCount: 1 },
    { name: "slips", maxCount: 8 },
  ]),
  applicationController.putApplication
);

/**********Dashboard usage**************/
applicationRoutes.post("/search", applicationController.searchApplications);
applicationRoutes.get("/", applicationController.getAllApplications);
applicationRoutes.get(
  "/batchEmailList/periodId/:periodId/:status/:status",
  applicationController.getBatchEmailNum
);

applicationRoutes.post("/excel", applicationController.exportExcel);
applicationRoutes.post(
  "/periodId/:periodId/role/:role",
  upload.fields([
    { name: "recent_photo", maxCount: 1 },
    { name: "slips", maxCount: 8 },
  ]),
  applicationController.postApplication
);
