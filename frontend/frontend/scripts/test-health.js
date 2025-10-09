#!/usr/bin/env node

/**
 * Health Check Test Script
 * Tests the /api/health endpoint locally or on Railway
 */

const http = require('http');
const https = require('https');

const url = process.argv[2] || 'http://localhost:3000';

console.log('🏥 Testing health endpoint...');
console.log(`📍 URL: ${url}/api/health\n`);

const lib = url.startsWith('https') ? https : http;

lib.get(`${url}/api/health`, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);

    if (res.statusCode === 200) {
      console.log('✅ Health check PASSED\n');

      try {
        const health = JSON.parse(data);
        console.log('Health Data:');
        console.log(JSON.stringify(health, null, 2));

        if (health.status === 'healthy') {
          console.log('\n✨ Service is healthy!');
          process.exit(0);
        } else {
          console.log('\n⚠️  Service returned unhealthy status');
          process.exit(1);
        }
      } catch (e) {
        console.log('⚠️  Invalid JSON response');
        console.log(data);
        process.exit(1);
      }
    } else {
      console.log('❌ Health check FAILED');
      console.log(data);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.log('❌ Connection error:', err.message);
  console.log('\nMake sure the frontend server is running:');
  console.log('  cd frontend && npm run dev');
  process.exit(1);
});
