#!/usr/bin/env node
/**
 * Database initialization script
 * Run this to create all tables and seed initial data
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

async function initDatabase() {
    console.log('🔄 Initializing database...');

    try {
        // Read the schema SQL file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        // Execute the schema
        await pool.query(schema);

        console.log('✅ Database initialized successfully!');
        console.log('📊 Tables created:');
        console.log('  - users');
        console.log('  - communities');
        console.log('  - posts');
        console.log('  - comments');
        console.log('  - votes');
        console.log('  - community_members');
        console.log('  - saved_posts');
        console.log('  - notifications');
        console.log('  - otp_codes');
        console.log('');
        console.log('✨ Seed data inserted:');
        console.log('  - 2 test users');
        console.log('  - 3 popular communities');

    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;
