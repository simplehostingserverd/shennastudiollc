#!/usr/bin/env node

/**
 * Browser-based test to verify products are loading
 * Uses Playwright to actually load the page and check for products
 */

const { chromium } = require('playwright');

const FRONTEND_URL = 'https://www.shennastudio.com/products';

async function testProductsInBrowser() {
  console.log('\n' + '='.repeat(80));
  console.log('🌐 Browser-Based Product Loading Test');
  console.log('='.repeat(80) + '\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let testsPassed = 0;
  let testsFailed = 0;

  try {
    console.log(`📍 Navigating to: ${FRONTEND_URL}`);
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle', timeout: 30000 });

    console.log('✅ Page loaded successfully\n');

    // Test 1: Check for loading state
    console.log('[TEST 1] Checking for loading state...');
    const loadingText = await page.textContent('body');
    if (loadingText.includes('Loading our beautiful ocean-themed collection')) {
      console.log('⚠️  WARNING: Page still showing loading state');
      testsFailed++;
    } else {
      console.log('✅ PASS: Loading state not present');
      testsPassed++;
    }

    // Test 2: Wait for products to load (max 10 seconds)
    console.log('\n[TEST 2] Waiting for products to load...');
    try {
      await page.waitForSelector('[data-testid="product-card"], .product-card, a[href*="/products/"]', {
        timeout: 10000
      });
      console.log('✅ PASS: Product elements found in DOM');
      testsPassed++;
    } catch {
      console.log('❌ FAIL: No product elements found after 10 seconds');
      testsFailed++;
    }

    // Test 3: Check for product titles
    console.log('\n[TEST 3] Checking for product titles...');
    const pageContent = await page.content();
    const productTitles = ['Medusa T-Shirt', 'Medusa Sweatpants', 'Medusa Sweatshirt', 'Turquoise Turtle'];
    let foundProducts = [];

    productTitles.forEach(title => {
      if (pageContent.includes(title)) {
        foundProducts.push(title);
      }
    });

    if (foundProducts.length > 0) {
      console.log(`✅ PASS: Found ${foundProducts.length} products:`);
      foundProducts.forEach(p => console.log(`   - ${p}`));
      testsPassed++;
    } else {
      console.log('❌ FAIL: No product titles found in page content');
      testsFailed++;
    }

    // Test 4: Check for API errors in console
    console.log('\n[TEST 4] Checking for JavaScript errors...');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Reload to capture console errors
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    if (errors.length === 0) {
      console.log('✅ PASS: No JavaScript errors in console');
      testsPassed++;
    } else {
      console.log(`❌ FAIL: Found ${errors.length} JavaScript errors:`);
      errors.forEach(err => console.log(`   - ${err}`));
      testsFailed++;
    }

    // Test 5: Check network requests for API calls
    console.log('\n[TEST 5] Monitoring API requests...');
    const apiRequests = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('/store/products') || url.includes('backend-production')) {
        apiRequests.push({
          url: url,
          method: request.method(),
          headers: request.headers()
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    if (apiRequests.length > 0) {
      console.log(`✅ PASS: Found ${apiRequests.length} API requests`);
      apiRequests.forEach(req => {
        console.log(`   - ${req.method} ${req.url.substring(0, 80)}...`);
        if (req.headers['x-publishable-api-key']) {
          console.log(`     ✅ Publishable key header present: ${req.headers['x-publishable-api-key'].substring(0, 30)}...`);
        } else {
          console.log(`     ❌ No publishable key header!`);
        }
      });
      testsPassed++;
    } else {
      console.log('❌ FAIL: No API requests to backend detected');
      testsFailed++;
    }

    // Take screenshot for debugging
    await page.screenshot({ path: 'products-page-screenshot.png', fullPage: true });
    console.log('\n📸 Screenshot saved to: products-page-screenshot.png');

  } catch (error) {
    console.error('❌ Browser test failed with error:', error.message);
    testsFailed++;
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Test Summary');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log('='.repeat(80) + '\n');

  return testsFailed === 0;
}

// Run the test
testProductsInBrowser()
  .then(success => {
    if (success) {
      console.log('🎉 All browser tests passed!');
      process.exit(0);
    } else {
      console.log('⚠️  Some browser tests failed. Check output above.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
