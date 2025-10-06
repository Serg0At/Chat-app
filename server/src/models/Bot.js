import knex from 'knex';
import knexConfig from '../configs/knex.config.js';

const pg = knex(knexConfig.development);

export default class BotModel {
  static async findTokenToBot(tokenTo) {
    return await pg("users")
      .where({ token: tokenTo })
      .andWhere("vfy_secret_to_expires_at", ">", new Date())
      .first();
  }

  static async verifyUserInTelegram(userId, updateFields) {
    return await pg("users")
      .where({ id: userId })
      .update(updateFields)
      .returning(["id", "vfy_secret_from_bot"]);
  }
}
