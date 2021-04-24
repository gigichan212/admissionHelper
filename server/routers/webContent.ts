import express from "express";
import { webContentController } from "../main";

export const webContentRoutes = express.Router();

webContentRoutes.get("/", webContentController.getAllWebContent);
webContentRoutes.put(
  "/studentType/:studentType",
  webContentController.updateWebContent
);