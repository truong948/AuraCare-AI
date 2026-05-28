import { spawn } from 'child_process';
import http from 'http';

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function isServerReady() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 302);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
}

async function runFeatureTests() {
  console.log('Starting Next.js server for feature verification on port', PORT);
  
  // Start server on port 3002
  const serverProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
    shell: true,
    stdio: 'ignore'
  });

  const cleanup = () => {
    console.log('Stopping Next.js server...');
    serverProcess.kill();
  };

  process.on('SIGINT', cleanup);
  process.on('exit', cleanup);

  // Wait for server to be ready
  let attempts = 30;
  let ready = false;
  while (attempts > 0) {
    ready = await isServerReady();
    if (ready) break;
    await wait(1000);
    attempts--;
  }

  if (!ready) {
    console.error('Failed to start Next.js server within 30 seconds.');
    serverProcess.kill();
    process.exit(1);
  }

  console.log('Next.js server is ready. Running functional API & structure tests...\n');
  let hasFailed = false;
  let dynamicSlug = "";

  // Test 1: Fetching products catalog list from API
  try {
    console.log('Test 1: GET /api/products (Products Catalog API)');
    const res = await fetch(`${BASE_URL}/api/products`);
    if (res.status !== 200) {
      throw new Error(`Expected status 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.products)) {
      throw new Error('Expected response to contain a "products" array');
    }
    if (data.products.length === 0) {
      throw new Error('Expected at least 1 product in products list');
    }
    
    // Save a dynamic slug for Test 2
    dynamicSlug = data.products[0].slug;
    
    // Validate schema of first product
    const prod = data.products[0];
    const requiredKeys = ['id', 'slug', 'name', 'price', 'category', 'stockStatus'];
    for (const key of requiredKeys) {
      if (!(key in prod)) {
        throw new Error(`Product schema missing key: ${key}`);
      }
    }
    console.log(`✅ PASS | GET /api/products returns ${data.products.length} products. (Sample slug: "${dynamicSlug}")`);
  } catch (error) {
    console.error(`❌ FAIL | GET /api/products failed: ${error.message}`);
    hasFailed = true;
  }

  // Test 2: Fetching individual product details from API using dynamically found slug
  if (dynamicSlug) {
    try {
      console.log(`\nTest 2: GET /api/products/[slug] (Product Detail API using: ${dynamicSlug})`);
      const res = await fetch(`${BASE_URL}/api/products/${dynamicSlug}`);
      if (res.status !== 200) {
        throw new Error(`Expected status 200, got ${res.status}`);
      }
      const data = await res.json();
      if (!data || !data.product) {
        throw new Error('Expected response to contain a "product" object');
      }
      if (data.product.slug !== dynamicSlug) {
        throw new Error(`Expected product slug to be ${dynamicSlug}, got ${data.product.slug}`);
      }
      const requiredDetailsKeys = ['brand', 'shortDescription', 'longDescription', 'ingredientsText', 'rating'];
      for (const key of requiredDetailsKeys) {
        if (!(key in data.product)) {
          throw new Error(`Product detail schema missing key: ${key}`);
        }
      }
      console.log(`✅ PASS | GET /api/products/${dynamicSlug} returns correct product details.`);
    } catch (error) {
      console.error(`❌ FAIL | GET /api/products/[slug] failed: ${error.message}`);
      hasFailed = true;
    }
  } else {
    console.log('\n⚠️ SKIPPED | Test 2 skipped because no product slug was loaded from Test 1.');
  }

  // Test 3: Search endpoint structure using POST
  try {
    console.log('\nTest 3: POST /api/search (Search API)');
    const res = await fetch(`${BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: 'vitamin', limit: 3 })
    });
    if (res.status !== 200) {
      throw new Error(`Expected status 200, got ${res.status}`);
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.results)) {
      throw new Error('Expected response to contain a "results" array');
    }
    console.log(`✅ PASS | POST /api/search with query 'vitamin' returns search results list correctly.`);
  } catch (error) {
    console.error(`❌ FAIL | POST /api/search failed: ${error.message}`);
    hasFailed = true;
  }

  // Test 4: Auth middleware check on onboarding page
  try {
    console.log('\nTest 4: GET /onboarding (Auth Middleware Protection)');
    const res = await fetch(`${BASE_URL}/onboarding`, { redirect: 'manual' });
    if (res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected redirect status (307/302), got ${res.status}`);
    }
    const redirectUrl = res.headers.get('location');
    if (!redirectUrl || !redirectUrl.includes('/login')) {
      throw new Error(`Expected redirect location to contain "/login", got "${redirectUrl}"`);
    }
    console.log(`✅ PASS | GET /onboarding successfully redirects guest to "/login".`);
  } catch (error) {
    console.error(`❌ FAIL | GET /onboarding auth protection failed: ${error.message}`);
    hasFailed = true;
  }

  // Test 5: Auth middleware check on Admin dashboard
  try {
    console.log('\nTest 5: GET /dashboard/feedback (Admin Route Protection)');
    const res = await fetch(`${BASE_URL}/dashboard/feedback`, { redirect: 'manual' });
    if (res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected redirect status (307/302), got ${res.status}`);
    }
    const redirectUrl = res.headers.get('location');
    if (!redirectUrl || !redirectUrl.includes('/login')) {
      throw new Error(`Expected redirect location to contain "/login", got "${redirectUrl}"`);
    }
    console.log(`✅ PASS | GET /dashboard/feedback successfully redirects guest to "/login".`);
  } catch (error) {
    console.error(`❌ FAIL | GET /dashboard/feedback protection failed: ${error.message}`);
    hasFailed = true;
  }

  cleanup();

  if (hasFailed) {
    console.error('\n❌ One or more feature tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All feature tests completed successfully!');
    process.exit(0);
  }
}

runFeatureTests();
