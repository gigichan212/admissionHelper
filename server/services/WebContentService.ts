import { table } from "../utils/tables";
import { Knex } from "knex";
export class WebContentService {
  constructor(private knex: Knex) { }

  //Get all Email types
  getAllWebContent = async () => {
    const result = await this.knex(table.APPLICATION_TYPE)
      .select(`${table.APPLICATION_TYPE}.*`)
      .orderBy(`${table.APPLICATION_TYPE}.id`, "esc");
    return result;
  };

  updateWebContent = async (
    studentType: string,
    letterType: string,
    text: Text
  ) => {
    try {
      const result = await this.knex(table.APPLICATION_TYPE)
        .where({ type: studentType })
        .update({
          [letterType]: text,
          updated_at: new Date()
        })
        .returning("id");
      return result[0];
    } catch (err) {
      console.log(err);
    }
  }
}
