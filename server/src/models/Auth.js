import knex from 'knex';
import knexConfig from '../configs/knex.config.js';

const pg = knex(knexConfig.development);

export default class AuthModel {

static async findById(id) {
  const user = await pg('users')
    .where({ id })
    .first();

  if (user) { delete user.password }
  return user;
}


  static async findByPhone(phone) {
    return await pg("users").where("phone_number", phone).first();
  }

  static async registerPendingUser(
    username,
    fullName,
    phone,
    hashedPassword,
    VfyTokenToBot,
    VfyTokenExpiry
  ) {
    const [user] = await pg("users")
      .insert({
        username,
        full_name: fullName,
        phone_number: phone,
        password: hashedPassword,
        vfy_secret_to_bot: VfyTokenToBot,
        vfy_secret_to_expires_at: VfyTokenExpiry,
        account_status: "pending",
      })
      .returning(["id", "username", "full_name", "phone_number", "vfy_secret_to_bot"]);

    return user;
  }
}