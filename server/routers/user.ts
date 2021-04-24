import express from "express";
import { userController } from "../main";

export const userRoutes = express.Router();

userRoutes.post("/", userController.login);
userRoutes.post("/newUser", userController.addUser);
userRoutes.get("/currentUser", userController.getCurrentUser);
userRoutes.get("/allUsers", userController.getAllUsers);
userRoutes.get("/teachers", userController.getTeachers);
userRoutes.get("/:id", userController.getUserById);
userRoutes.put("/:id", userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);

/************Parent login*******************/
export const parentUserRoutes = express.Router();
parentUserRoutes.post("/", userController.parentLoginAttempt); //check user login info and send email token
parentUserRoutes.get("/token", userController.parentLogin); // login
parentUserRoutes.get("/currentParentUser", userController.getCurrentUser);
