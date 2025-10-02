// NPM Modules
import knex from 'knex';
import knexConfigs from '../src/configs/knex.config.js';

function down(pg) {
  return (
    pg.schema

    .dropTableIfExists('rst_pswd_links')
    .dropTableIfExists('message_reads')
    .dropTableIfExists('messages')
    .dropTableIfExists('conversation_participants')
    .dropTableIfExists('conversations')
    .dropTableIfExists('users')
  );
}

async function init() {
  try {
    const options =
      process.env.NODE_ENV === 'production'
        ? knexConfigs.production
        : knexConfigs.development;
    const pg = knex(options);
    await down(pg);
    console.log('Successfully dropped all tables');
  } catch (error) {
    console.log(error.message);
  }
}

init();