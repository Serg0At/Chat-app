import knex from 'knex';
import knexConfig from '../configs/knex.config.js';

const pg = knex(knexConfig.development);

export default class BotModel {}