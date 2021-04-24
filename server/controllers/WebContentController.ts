import { Request, Response } from "express";

import httpStatusCodes from "http-status-codes";
import { WebContentService } from "../services/WebContentService";
import { logger } from "../utils/logger";

export class WebContentController {
  constructor(private webContentService: WebContentService) {}

  //get all web content
  getAllWebContent = async (req: Request, res: Response) => {
    try {
      const data = await this.webContentService.getAllWebContent();
      if (data) {
        res.json({ data: data });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "internal server error cannot get data" });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  updateWebContent = async (req: Request, res: Response) => {
    try {
      const { studentType } = req.params;
      const { letter, text } = req.body;
      let letterType: string;
      switch (letter) {
        case "application_procedure":
          letterType = "application_procedure";
          break;
        case "application_note":
          letterType = "application_note";
          break;
        case "confirmation_letter":
          letterType = "confirmation_letter";
          break;
        default:
          letterType = "undefined";
          break;
      }
      if (letterType !== "undefined") {
        const result = await this.webContentService.updateWebContent(
          studentType,
          letterType,
          text
        );

        if (result) {
          res.status(200).json({ data: result, success: true });
        } else {
          res
            .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false });
        }
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };
}
