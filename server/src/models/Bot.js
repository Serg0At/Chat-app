import knex from 'knex';
import knexConfig from '../configs/knex.config.js';

const pg = knex(knexConfig.development);

export default class BotModel {
  static async findTokenToBot(tokenTo) {
    return await pg("users")
      .where({ vfy_secret_to_bot: tokenTo })
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
