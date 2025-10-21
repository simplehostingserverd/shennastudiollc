#!/usr/bin/env node
/**
 * Test Coolify Database Connection
 * This script verifies that your Medusa backend can connect to Coolify's internal databases
 */

import { Client } from 'pg';
import { createClient } from 'redis';

// Coolify Internal Database URLs
const DATABASE_URL = 'postgres://postgres:5nMC5VaPTPVdyOPKdPYJhPvq00MS8UoR2KAEAJp0IGkVJOd1l3D7Q1PLHiPWz5bi@fc880wcg88k88wcwco4gowoo:5432/postgres';
const REDIS_URL = 'redis://default:uDHR58Q2T3HUDV09xqfMMw1gTLz7l2e8PRjEbH8GDsBq5L8cxF6knZxpg0rIP3rE@ns4cskowscs08c4kgs8kswgw:6379/0';

async function testPostgreSQL() {
  console.log('\n🐘 Testing PostgreSQL Connection...');
  console.log('Host: fc880wcg88k88wcwco4gowoo:5432');

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: false // Internal Coolify DB doesn't need SSL
  });

  try {
    await client.connect();
    console.log('✅ PostgreSQL connection successful!');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);

    // Check if Medusa tables exist
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE '%medusa%'
      LIMIT 5
    `);

    if (tablesResult.rows.length > 0) {
      console.log('📋 Medusa tables found:', tablesResult.rows.map(r => r.table_name).join(', '));
    } else {
      console.log('⚠️  No Medusa tables found yet - will be created on first migration');
    }

    await client.end();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
}

async function testRedis() {
  console.log('\n🔴 Testing Redis Connection...');
  console.log('Host: ns4cskowscs08c4kgs8kswgw:6379');

  const client = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy: false
    }
  });

  client.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
  });

  try {
    await client.connect();
    console.log('✅ Redis connection successful!');

    // Test set/get
    await client.set('test-key', 'Shenna Studio rocks!');
    const value = await client.get('test-key');
    console.log('📝 Redis test write/read:', value);

    // Clean up
    await client.del('test-key');

    await client.quit();
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🌊 Shenna Studio - Coolify Database Connection Test');
  console.log('='.repeat(60));

  await testPostgreSQL();
  await testRedis();

  console.log('\n' + '='.repeat(60));
  console.log('✅ All database connections are working!');
  console.log('\n📋 Next Steps:');
  console.log('1. Update your Coolify environment variables with these URLs');
  console.log('2. Set AUTO_MIGRATE=true to run migrations on startup');
  console.log('3. Set AUTO_CREATE_ADMIN=true to create admin user');
  console.log('4. Deploy your application');
  console.log('\nAdmin will be accessible at: https://api.shennastudio.com/app');
}

main().catch(console.error);
