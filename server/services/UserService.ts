import { Knex } from "knex";
import { logger } from "../utils/logger";
import { User } from "../utils/models";
import { table } from "../utils/tables";

export class UserService {
  constructor(private knex: Knex) {}

  //Get a user by username
  getUser = async (username: string) => {
    try {
      const user: User[] = await this.knex(table.USERS)
        .select(
          `${table.USERS}.id`,
          `${table.USERS}.username`,
          `${table.USERS}.password`,
          `${table.USERS}.is_active`,
          `${table.USERS}.created_at`,
          `${table.USERS}.updated_at`,
          `${table.USERS}.updated_user_id`,
          `${table.USER_ROLE}.role`
        )
        .from(table.USERS)
        .innerJoin(
          table.USER_ROLE,
          `${table.USERS}.user_role_id`,
          `${table.USER_ROLE}.id`
        )
        .where({ username: username, is_active: true })
        .returning("*");

      return user[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get user by ID
  getUserById = async (id: number) => {
    try {
      const user: User[] = await this.knex(table.USERS)
        .select(
          `${table.USERS}.id`,
          `${table.USERS}.username`,
          `${table.USERS}.password`,
          `${table.USERS}.is_active`,
          `${table.USERS}.created_at`,
          `${table.USERS}.updated_at`,
          `${table.USERS}.updated_user_id`,
          `${table.USER_ROLE}.role`
        )
        .from(table.USERS)
        .innerJoin(
          table.USER_ROLE,
          `${table.USERS}.user_role_id`,
          `${table.USER_ROLE}.id`
        )
        .whereRaw(`users.id = ${id} AND is_active = true`)
        .returning("*");

      return user[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get all active users
  getAllUsers = async (offset: number, limit: number) => {
    try {
      const users: User[] = await this.knex(table.USERS)
        .select(
          `${table.USERS}.id`,
          `${table.USERS}.username`,
          `${table.USERS}.created_at`,
          `${table.USERS}.updated_at`,
          `${table.USERS}.updated_user_id`,
          `${table.USER_ROLE}.role`
        )
        .from(table.USERS)
        .innerJoin(
          table.USER_ROLE,
          `${table.USERS}.user_role_id`,
          `${table.USER_ROLE}.id`
        )
        .where({
          is_active: true,
        })
        .orderBy("created_at", "desc")
        .limit(limit)
        .offset(offset)
        .returning("*");

      for (let user of users) {
        const updateUserId = parseInt(user["updated_user_id"]);
        if (!isNaN(updateUserId)) {
          const updateUser = await this.getUserById(updateUserId);
          if (typeof updateUser === "undefined") {
            return;
          }
          user["updated_user"] = updateUser["username"];
        }
      }

      return users;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Get number of users
  getUsersCount = async () => {
    const counts = await this.knex(table.USERS)
      .where({ is_active: true })
      .count("*");
    return counts[0].count;
  };

  //Update user
  updateUser = async (id: number, data: {}) => {
    try {
      const result = await this.knex(table.USERS)
        .where({ id: id })
        .update({ ...data, updated_at: new Date() })
        .returning("updated_at");

      return result[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Add new user
  addUser = async (user: { username: string; password: string }) => {
    try {
      //Get teacher role id
      const userRoleId = (
        await this.knex(table.USER_ROLE).select("id").where({ role: "teacher" })
      )[0].id;

      const result = await this.knex(table.USERS)
        .insert({
          user_role_id: userRoleId,
          ...user,
        })
        .returning("*");

      return result[0];
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  //Update application interviewer when interviewer is deleted
  updateApplicationInterviewer = async (interviewer_id: number) => {
    try {
      const result = await this.knex(table.APPLICATION)
        .where({ interviewer_id: interviewer_id })
        .update({ interviewer_id: null });

      console.log(result);

      return result;
    } catch (e) {
      logger.error(e.message);
      return;
    }
  };

  getTeachers = async () => {
    try {
      const result = this.knex(table.USERS)
        .select([`${table.USERS}.id`, `${table.USERS}.username`])
        .innerJoin(
          table.USER_ROLE,
          `${table.USER_ROLE}.id`,
          `${table.USERS}.user_role_id`
        )
        .whereRaw(
          `${table.USER_ROLE}.role = 'teacher' AND ${table.USERS}.is_active = true`
        );

      return result;
    } catch (e) {
      logger.error("Internal server error");
      logger.error(e.message);
      return;
    }
  };
  /************Parent login*******************/
  getParentUser = async (idWithPrefix: string, email: string) => {
    try {
      // check email matching
      const resultFromDb = await this.knex(table.APPLICATION)
        .where({ email: email })
        .select(["id", "prefix", "email", "chinese_name", "english_name"]);

      if (!resultFromDb) {
        return resultFromDb;
      }

      // compare idWithPrefix
      const result = resultFromDb.filter((user) => {
        return idWithPrefix === String(user.prefix) + String(user.id);
      });
      return result[0];
    } catch (e) {
      logger.error("Internal server error");
      logger.error(e.message);
      return;
    }
  };

  //Get parent user by ID
  getParentUserById = async (id: number) => {
    try {
      const parentUser: { id: number } = await this.knex(table.APPLICATION)
        .where({ id: id })
        .select("id");
      return parentUser[0];
    } catch (e) {
      logger.error("Internal server error");
      return;
    }
  };
}
