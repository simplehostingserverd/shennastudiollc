#!/usr/bin/env node

/**
 * Comprehensive Product Loading Debugger for Shenna's Studio
 * Tests all aspects of the frontend-backend communication
 */

const https = require('https');

const BACKEND_URL = 'https://backend-production-38d0a.up.railway.app';
const FRONTEND_URL = 'https://www.shennastudio.com';
const PUBLISHABLE_KEY = 'pk_a7f375f10252e8f6e87bc2b92ee863f5a7f5950e89256e86723b8d43131cd3c9';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, label, message) {
  console.log(`${color}[${label}]${colors.reset} ${message}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n' + '='.repeat(80));
  log(colors.cyan, 'INFO', 'Starting Comprehensive Product Loading Debug');
  console.log('='.repeat(80) + '\n');

  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test 1: Backend Health Check
  log(colors.blue, 'TEST 1', 'Checking Backend Health...');
  try {
    const health = await makeRequest(`${BACKEND_URL}/health`);
    if (health.status === 200) {
      log(colors.green, 'PASS', `Backend is healthy (${health.status})`);
      results.passed++;
    } else {
      log(colors.red, 'FAIL', `Backend health check failed (${health.status})`);
      results.failed++;
    }
  } catch (error) {
    log(colors.red, 'FAIL', `Backend unreachable: ${error.message}`);
    results.failed++;
  }

  // Test 2: Products API without publishable key
  log(colors.blue, 'TEST 2', 'Testing Products API WITHOUT publishable key...');
  try {
    const noKey = await makeRequest(`${BACKEND_URL}/store/products`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (noKey.status === 401 || (noKey.data && noKey.data.type === 'not_allowed')) {
      log(colors.green, 'PASS', 'Backend correctly rejects requests without publishable key');
      results.passed++;
    } else {
      log(colors.yellow, 'WARN', `Backend returned ${noKey.status} without key (should be 401)`);
      results.warnings++;
    }
  } catch (error) {
    log(colors.red, 'FAIL', `Request failed: ${error.message}`);
    results.failed++;
  }

  // Test 3: Products API with publishable key
  log(colors.blue, 'TEST 3', 'Testing Products API WITH publishable key...');
  try {
    const withKey = await makeRequest(`${BACKEND_URL}/store/products`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    });
    if (withKey.status === 200 && withKey.data && withKey.data.products) {
      log(colors.green, 'PASS', `Backend returned ${withKey.data.products.length} products`);
      log(colors.cyan, 'INFO', `Product titles: ${withKey.data.products.map(p => p.title).join(', ')}`);
      results.passed++;
    } else {
      log(colors.red, 'FAIL', `Products API failed with key (${withKey.status})`);
      console.log('Response:', JSON.stringify(withKey.data, null, 2));
      results.failed++;
    }
  } catch (error) {
    log(colors.red, 'FAIL', `Request failed: ${error.message}`);
    results.failed++;
  }

  // Test 4: CORS Headers
  log(colors.blue, 'TEST 4', 'Checking CORS configuration...');
  try {
    const cors = await makeRequest(`${BACKEND_URL}/store/products`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'x-publishable-api-key'
      }
    });
    const allowOrigin = cors.headers['access-control-allow-origin'];
    const allowHeaders = cors.headers['access-control-allow-headers'];

    if (allowOrigin && (allowOrigin === FRONTEND_URL || allowOrigin === '*')) {
      log(colors.green, 'PASS', `CORS allows origin: ${allowOrigin}`);
      results.passed++;
    } else {
      log(colors.red, 'FAIL', `CORS does not allow ${FRONTEND_URL}. Got: ${allowOrigin}`);
      results.failed++;
    }

    if (allowHeaders && allowHeaders.toLowerCase().includes('x-publishable-api-key')) {
      log(colors.green, 'PASS', 'CORS allows x-publishable-api-key header');
      results.passed++;
    } else {
      log(colors.yellow, 'WARN', `CORS headers: ${allowHeaders}`);
      results.warnings++;
    }
  } catch (error) {
    log(colors.yellow, 'WARN', `CORS check failed: ${error.message}`);
    results.warnings++;
  }

  // Test 5: Frontend accessibility
  log(colors.blue, 'TEST 5', 'Checking Frontend accessibility...');
  try {
    const frontend = await makeRequest(`${FRONTEND_URL}/products`);
    if (frontend.status === 200) {
      log(colors.green, 'PASS', 'Frontend products page is accessible');
      results.passed++;

      // Check if loading state or products are present
      const html = frontend.data.toString();
      if (html.includes('Loading our beautiful ocean-themed collection')) {
        log(colors.yellow, 'WARN', 'Frontend shows loading state (products may not be loaded)');
        results.warnings++;
      }
      if (html.includes('Medusa T-Shirt') || html.includes('product')) {
        log(colors.green, 'INFO', 'Products appear to be in the HTML');
      }
    } else {
      log(colors.red, 'FAIL', `Frontend returned ${frontend.status}`);
      results.failed++;
    }
  } catch (error) {
    log(colors.red, 'FAIL', `Frontend unreachable: ${error.message}`);
    results.failed++;
  }

  // Test 6: Check environment variable exposure
  log(colors.blue, 'TEST 6', 'Checking if publishable key is exposed to browser...');
  try {
    const frontend = await makeRequest(`${FRONTEND_URL}/_next/static/chunks/app/products/page-*.js`);
    const html = await makeRequest(`${FRONTEND_URL}/products`);
    const htmlContent = html.data.toString();

    if (htmlContent.includes(PUBLISHABLE_KEY.substring(0, 20))) {
      log(colors.green, 'PASS', 'Publishable key is embedded in frontend code');
      results.passed++;
    } else if (htmlContent.includes('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY')) {
      log(colors.yellow, 'WARN', 'Environment variable reference found but key may not be set');
      results.warnings++;
    } else {
      log(colors.red, 'FAIL', 'Publishable key not found in frontend bundle');
      results.failed++;
    }
  } catch (error) {
    log(colors.yellow, 'WARN', `Could not check frontend bundle: ${error.message}`);
    results.warnings++;
  }

  // Test 7: Check backend configuration
  log(colors.blue, 'TEST 7', 'Checking backend store CORS configuration...');
  try {
    const storeEndpoint = await makeRequest(`${BACKEND_URL}/store/products`, {
      headers: {
        'Origin': 'https://www.shennastudio.com',
        'x-publishable-api-key': PUBLISHABLE_KEY
      }
    });

    const corsHeader = storeEndpoint.headers['access-control-allow-origin'];
    if (corsHeader) {
      log(colors.green, 'PASS', `Store CORS header: ${corsHeader}`);
      results.passed++;
    } else {
      log(colors.red, 'FAIL', 'No CORS header in store response');
      results.failed++;
    }
  } catch (error) {
    log(colors.red, 'FAIL', `Backend CORS check failed: ${error.message}`);
    results.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  log(colors.cyan, 'SUMMARY', 'Test Results:');
  console.log('='.repeat(80));
  log(colors.green, 'PASSED', `${results.passed} tests`);
  log(colors.yellow, 'WARNINGS', `${results.warnings} warnings`);
  log(colors.red, 'FAILED', `${results.failed} tests`);
  console.log('='.repeat(80) + '\n');

  if (results.failed > 0) {
    log(colors.red, 'ACTION', 'Critical issues found. Review failed tests above.');
    process.exit(1);
  } else if (results.warnings > 0) {
    log(colors.yellow, 'ACTION', 'Some warnings detected. Products may not load correctly.');
    process.exit(0);
  } else {
    log(colors.green, 'SUCCESS', 'All tests passed! Products should load correctly.');
    process.exit(0);
  }
}

runTests().catch(error => {
  log(colors.red, 'ERROR', `Unhandled error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
