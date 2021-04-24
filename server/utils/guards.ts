import { Bearer } from "permit";
import jwtSimple from "jwt-simple";
import { Request, Response, NextFunction } from "express";
import { userService } from "../main";
import { logger } from "../utils/logger";
import httpStatusCodes from "http-status-codes";

const permit = new Bearer({
  query: "access_token",
});

// check dashboard user token
export async function isLoggedInAPI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = permit.check(req);
    const payload = jwtSimple.decode(token, process.env.JWT_SECRET!);

    // dashboard user checking
    const user = await userService.getUserById(payload.id);

    if (user) {
      req["user"] = {
        id: user.id,
        role: user.role,
      };
      next();
    } else {
      res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "unauthorized" });
    }
  } catch (e) {
    res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "invalid token" });
    logger.debug(e);
  }
}

// check dashboard user/ parent token
export async function isParentOrUserLoggedInAPI(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = permit.check(req);
    const payload = jwtSimple.decode(token, process.env.JWT_SECRET!);
    let user: any;
    if (payload.id) {
      // dashboard user checking
      user = await userService.getUserById(payload.id);
      req["user"] = {
        id: user.id,
        role: user.role,
      };
      return next();
    } else if (payload.applicationId) {
      // parent user checking
      user = await userService.getParentUserById(payload.applicationId);
      req["parentUser"] = {
        id: user.id,
      };
      return next();
    }

    return res
      .status(httpStatusCodes.UNAUTHORIZED)
      .json({ result: "unauthorized" });
  } catch (e) {
    res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "invalid token" });
    logger.debug(e);
  }
}

// Send confirmation email guard
export async function sendEmailGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = permit.check(req);
    const payload = jwtSimple.decode(token, process.env.JWT_SECRET!);
    if (payload.applicationId) {
      // application id checking
      const application = await userService.getParentUserById(
        payload.applicationId
      );
      req["sendEmailApplicationId"] = {
        id: application.id,
      };
      return next();
    }

    return res
      .status(httpStatusCodes.UNAUTHORIZED)
      .json({ result: "unauthorized" });
  } catch (e) {
    res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "invalid token" });
    logger.debug(e);
  }
}

// Send parent login  email guard
// export async function sendLoginEmailGuard(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const token = permit.check(req);
//     const payload = jwtSimple.decode(token, process.env.JWT_SECRET!);
//     if (payload.applicationId) {
//       // application id checking
//       const application = await userService.getParentUserById(
//         payload.applicationId
//       );
//       req["loginEmail"] = {
//         idWithPrefix: application.idWithPrefix,
//         id: application.id,
//         email: application.email,
//         chinese_name: application.chinese_name,
//         english_name: application.english_name,
//       };
//       return next();
//     }

//     return res
//       .status(httpStatusCodes.UNAUTHORIZED)
//       .json({ result: "unauthorized" });
//   } catch (e) {
//     res.status(httpStatusCodes.UNAUTHORIZED).json({ result: "invalid token" });
//     logger.debug(e);
//   }
// }
