#!/usr/bin/env node

/**
 * Pre-build script to verify environment variables are set
 */

console.log('\n🔍 Checking Environment Variables...\n');

const required = [
  'NEXT_PUBLIC_MEDUSA_BACKEND_URL',
  'NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'
];

let missing = [];

required.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    missing.push(varName);
  }
});

console.log('\n');

if (missing.length > 0) {
  console.error(`⚠️  Warning: ${missing.length} required environment variable(s) missing!`);
  console.error('Missing:', missing.join(', '));
  console.error('\nProducts may not load correctly in the frontend.\n');
} else {
  console.log('✅ All required environment variables are set!\n');
}
