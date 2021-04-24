import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import httpStatusCodes from "http-status-codes";

//Check if the user is admin
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req["user"];

    if (!req["user"]) {
      res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "unauthorized" });
      return;
    }

    if (role !== "admin") {
      res
        .status(httpStatusCodes.UNAUTHORIZED)
        .json({ message: "Only admin can access" });
      return;
    }

    next();
  } catch (e) {
    res
      .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        function: "middleware/isAdmin",
        message: "Internal server error",
      });
    logger.debug(e);
  }
}
