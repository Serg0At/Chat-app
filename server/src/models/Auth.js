import knex from 'knex';
import knexConfigs from '../configs/knex.config.js'

const pg = knex(knexConfigs.development);

export default class User {
    static async findByPhone (phone) {
        return await pg('users')
        .select('phone_number', phone)
        .first()
    }
}