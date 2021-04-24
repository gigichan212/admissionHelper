import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { checkPassword, hashPassword } from "../utils/hash";
import jwtSimple from "jwt-simple";
import httpStatusCodes from "http-status-codes";
import { logger } from "../utils/logger";
import { EmailRecordController } from "./EmailRecordControllers";
import { Bearer } from "permit";

export class UserController {
  constructor(
    private userService: UserService,
    private emailRecordController: EmailRecordController
  ) {}

  //Handle dashboard login
  login = async (req: Request, res: Response) => {
    try {
      let { username, password } = req.body;

      const user = await this.userService.getUser(username);

      if (!user) {
        res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: "Email/password incorrect, please try again.",
        });
        return;
      }

      if (await checkPassword(password, user.password!)) {
        const token = jwtSimple.encode(
          {
            id: user.id,
            role: user.role,
            // exp: Date.now() / 1000 + 3600 * 2,
          },
          process.env.JWT_SECRET!
        );

        res.json({ token: token, userId: user.id, role: user.role });
      } else {
        res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: "Email/password incorrect, please try again.",
        });
        return;
      }
    } catch (e) {
      logger.error(e.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Get the logged in user
  getCurrentUser = (req: Request, res: Response) => {
    try {
      if (req["user"]) {
        res.json(req["user"]);
        return;
      }
      if (req["parentUser"]) {
        res.json(req["parentUser"]);
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Get all the users and number of users in DB
  getAllUsers = async (req: Request, res: Response) => {
    try {
      let { limit, offset } = req.query;

      const users = await this.userService.getAllUsers(
        parseInt(offset as string),
        parseInt(limit as string)
      );

      const count = await this.userService.getUsersCount();

      res.json({ status: 200, data: users, count: count });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Get single user by id
  getUserById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const user = await this.userService.getUserById(id);

      if (user) {
        const { password, updated_user_id, ...others } = user;

        let updatedUser;

        if (updated_user_id) {
          updatedUser = await this.userService.getUserById(
            parseInt(updated_user_id)
          );
        } else {
          //Add updated user as admin
          const admin = await this.userService.getUser("admin");

          if (!admin) {
            throw new Error("No updated user id was found");
          }

          updatedUser = await this.userService.updateUser(id, {
            updated_user_id: admin.id,
          });

          res.json({
            status: 200,
            data: { ...others, updated_user: "admin" },
          });
          return;
        }

        if (updatedUser) {
          res.json({
            status: 200,
            data: { ...others, updated_user: updatedUser.username },
          });
          return;
        }
      } else {
        throw new Error("User not found.");
      }
    } catch (e) {
      logger.error(e.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  //Update user username and password
  updateUser = async (req: Request, res: Response) => {
    try {
      //get id from params
      const id = parseInt(req.params.id);

      //Get old_password from req.body if present
      //others should contain username or password or both
      let { old_password, updated_user_id, ...others } = req.body;

      //Update user
      //If have old password, check if it matches with DB
      if (old_password) {
        const data = await this.userService.getUserById(id);

        if (!data) {
          res
            .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "User not found" });
          return;
        }

        const matched = await checkPassword(
          old_password,
          data.password as string
        );

        if (!matched) {
          res
            .status(httpStatusCodes.UNAUTHORIZED)
            .json({ message: "Incorrect password, Please try again." });
          return;
        }
      }

      //Hash password if present
      if (others.password) {
        others.password = await hashPassword(others.password);
      }

      const result = await this.userService.updateUser(id, {
        ...others,
        updated_user_id: updated_user_id,
      });

      //Get updated user's username
      const updatedUser = await this.userService.getUserById(updated_user_id);

      if (result && updatedUser) {
        res.json({
          status: 200,
          message: "updated",
          updated_at: result,
          updated_user: updatedUser.username,
        });
      }
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      //Get user data
      const user = await this.userService.getUserById(id);

      //Check if the user is an admin
      //Don't allow user to delete admin
      if (user?.role === "admin") {
        res
          .status(httpStatusCodes.FORBIDDEN)
          .json({ message: "Can't delete admin" });
        return;
      }

      //Inactive the user
      const result = await this.userService.updateUser(id, {
        is_active: false,
      });

      if (!result) {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Unable to delete user" });
        return;
      }

      //Update applications of this interviewer
      const updateApplication = await this.userService.updateApplicationInterviewer(
        id
      );

      if (updateApplication) {
        res.json({ status: 200, message: "deleted" });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Unable to delete user" });
        return;
      }
    } catch (e) {
      logger.error(e.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  addUser = async (req: Request, res: Response) => {
    try {
      const { updated_user_id: req_updated_user_id, ...others } = req.body;

      const updateUser = await this.userService.getUserById(
        req_updated_user_id
      );

      //If no user is found, don't allow adding new user
      if (!updateUser) {
        res
          .status(httpStatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized to add user" });
        return;
      }

      //Check if admin is adding user
      if (updateUser?.role !== "admin") {
        res
          .status(httpStatusCodes.FORBIDDEN)
          .json({ message: "only admin can add user" });
        return;
      }

      //Hash password
      others.password = await hashPassword(others.password);

      const result = await this.userService.addUser(others);

      //Pick out unwanted properties
      const {
        password,
        user_role_id,
        is_active,
        updated_user_id,
        ...user
      } = result;

      if (result) {
        res.json({
          status: 200,
          data: { ...user, updated_user: updateUser.username },
        });
      } else {
        res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "internal server error" });
      }
    } catch (e) {
      logger.error(e.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  getTeachers = async (req: Request, res: Response) => {
    try {
      const teachers = await this.userService.getTeachers();
      res.json({ isSuccess: true, teachers: teachers });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  /************Parent login*******************/
  parentLoginAttempt = async (req: Request, res: Response) => {
    try {
      const { applicationIdWithPrefix, email } = req.body;

      if (!applicationIdWithPrefix || !email) {
        res.status(httpStatusCodes.BAD_REQUEST).json({
          message: "Missing application id/ email",
        });
        return;
      }

      const parentUser = await this.userService.getParentUser(
        applicationIdWithPrefix,
        email
      );
      if (!parentUser) {
        res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: "Application id/ email incorrect",
        });
        return;
      }
      const idWithPrefix = String(parentUser.prefix) + String(parentUser.id);

      //create login token and send email
      const token = jwtSimple.encode(
        {
          idWithPrefix: idWithPrefix,
          email: email,
          exp: Date.now() / 1000 + 3600 * 2,
        },
        process.env.JWT_SECRET!
      );

      const sendEmailResult = await this.emailRecordController.sendLoginEmail(
        idWithPrefix,
        parentUser.id,
        parentUser.email,
        parentUser.chinese_name,
        parentUser.english_name,
        token
      );
      if (!sendEmailResult) {
        res
          .status(httpStatusCodes.BAD_REQUEST)
          .json({ message: "Bad request" });
      }

      res.json({
        isSuccess: true,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };

  parentLogin = async (req: Request, res: Response) => {
    try {
      const permit = new Bearer({
        query: "access_token",
      });

      const loginToken = permit.check(req);
      const payload = jwtSimple.decode(loginToken, process.env.JWT_SECRET!);
      const { idWithPrefix, email } = payload;

      if (!idWithPrefix || !email) {
        res.status(httpStatusCodes.BAD_REQUEST).json({
          message: "Missing application id/ email",
        });
        return;
      }

      const parentUser = await this.userService.getParentUser(
        idWithPrefix,
        email
      );
      if (!parentUser) {
        res.status(httpStatusCodes.UNAUTHORIZED).json({
          message: "Application id/ email incorrect",
        });
        return;
      }

      const token = jwtSimple.encode(
        {
          applicationId: parentUser.id,
          exp: Date.now() / 1000 + 3600 * 2,
        },
        process.env.JWT_SECRET!
      );

      res.json({
        isSuccess: true,
        token: token,
        applicationId: parentUser.id,
      });
    } catch (err) {
      logger.error(err.message);
      res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  };
}
