// NPM Modules
import knex from 'knex';

// Local Modules
import knexConfigs from '../src/configs/knex.config.js';

function up(pg) {
    return (
        pg.schema
            // Table of Users
            .createTable('users', table => {
                table.increments('id').primary();

                // User
                table.boolean('is_verified').defaultTo(false)

                table.string('username').notNullable().unique();

                table.integer('phone_number').notNullable().unique();
                table.integer('telegram_id')

                table.string('password').notNullable();
                table.string('full_name').notNullable();
                table.string('avatar_url');

                // Verification
                table.string('vfy_secret_to_bot')
                table.string('vfy_secret_from_bot')
                
                // Date times and timestamps
                table.dateTime('vfy_link_secret_expires_at')
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
                table.timestamp("created_at").defaultTo(knex.fn.now());
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
                table.timestamp("joined_at").defaultTo(knex.fn.now());
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
                table.timestamp("created_at").defaultTo(knex.fn.now());
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
                table.timestamp("read_at").defaultTo(knex.fn.now());
            })
    )
}