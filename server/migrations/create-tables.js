// NPM Modules
import knex from 'knex';
// Local Modules
import knexConfig from '../src/configs/knex.config';

function up(pg) {
    return (
        pg.schema
            // Table of Users
            .createTable('users', table => {
                table.increments('id').primary();

                // User
                table.string('account_status').notNullable()

                table.string('username').notNullable().unique();

                table.string('phone_number').notNullable().unique();
                table.string('telegram_id')

                table.string('password').notNullable();
                table.string('full_name').notNullable();
                table.string('avatar_url');

                // Verification
                table.string('vfy_secret_to_bot')
                table.string('vfy_secret_from_bot')
                
                // Date times and timestamps
                table.dateTime('vfy_secret_to_expires_at')
                table.dateTime('vfy_secret_from_expires_at')
                table.dateTime('last_login_at').defaultTo(pg.fn.now())

                table.timestamp('created_at').defaultTo(pg.fn.now())
            })

            .createTable('rst_pswd_links', table => {
                table.increments('id').primary();
                
                table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
                
                table.string('rst_link_secret');
                
                table.boolean('used_rst_link').notNullable().defaultTo(false);
                table.string('otp_code');
                table.dateTime('otp_code_expires_at');
                
                table.timestamp('created_at').defaultTo(pg.fn.now());
            })

            .createTable("conversations", (table) => {
                table.increments("id").primary();
                table.enu("type", ["direct", "group"]).notNullable(); // direct = 1-to-1, group = group chat
                table.string("title").nullable(); // The name of a group, if direct left null
                table.timestamp("created_at").defaultTo(pg.fn.now());
            })

            .createTable("conversation_participants", (table) => {
                table.increments("id").primary();
                table
                  .integer("conversation_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("conversations")
                  .onDelete("CASCADE");
                table
                  .integer("user_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("users")
                  .onDelete("CASCADE");
                table.enu("role", ["admin", "member"]).defaultTo("member");
                table.timestamp("joined_at").defaultTo(pg.fn.now());
            })

            .createTable("messages", (table) => {
                table.increments("id").primary();
                table
                  .integer("conversation_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("conversations")
                  .onDelete("CASCADE");
                table
                  .integer("sender_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("users")
                  .onDelete("CASCADE");
                table.text("text").nullable();
                table.string("image").nullable();
                table.timestamp("created_at").defaultTo(pg.fn.now());
            })

            .createTable("message_reads", (table) => {
                table.increments("id").primary();
                table
                  .integer("message_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("messages")
                  .onDelete("CASCADE");
                table
                  .integer("user_id")
                  .unsigned()
                  .notNullable()
                  .references("id")
                  .inTable("users")
                  .onDelete("CASCADE");
                table.timestamp("read_at").defaultTo(pg.fn.now());
            })
    )
};

async function init() {
  try {
    const options =
      process.env.NODE_ENV === 'production'
        ? knexConfigs.production
        : knexConfigs.development;

    const pg = knex(options);

    await pg.transaction(async trx => {
      await up(trx);
    });

    console.log('✅ Successfully created all tables in transaction');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

init();
