import { spawn } from 'child_process';
import http from 'http';

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

// The list of routes we want to test and their expected status codes.
// For auth-protected pages, we expect a redirect (307 or similar) to the login page.
const routesToTest = [
  { path: '/', expected: [200] },
  { path: '/products', expected: [200] },
  { path: '/api/products', expected: [200] },
  { path: '/cart', expected: [200] },
  { path: '/wishlist', expected: [200] },
  { path: '/compare', expected: [200] },
  { path: '/faq', expected: [200] },
  { path: '/articles', expected: [200] },
  { path: '/login', expected: [200] },
  { path: '/scan', expected: [200] },
  { path: '/onboarding', expected: [307, 302, 303, 308] },
  { path: '/dashboard', expected: [307, 302, 303, 308] },
  { path: '/dashboard/feedback', expected: [307, 302, 303, 308] },
  { path: '/dashboard/consultations', expected: [307, 302, 303, 308] },
  { path: '/diary', expected: [307, 302, 303, 308] },
  { path: '/orders', expected: [200, 307, 302, 303, 308] },
  { path: '/consult', expected: [200, 307, 302, 303, 308] }
];

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

async function runTests() {
  console.log('Starting Next.js production server on port', PORT);
  
  // Run next start on port 3001
  const serverProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
    shell: true,
    stdio: 'ignore'
  });

  // Ensure we clean up the process on exit
  const cleanup = () => {
    console.log('Stopping Next.js server...');
    serverProcess.kill();
  };

  process.on('SIGINT', cleanup);
  process.on('exit', cleanup);

  // Wait for server to become ready
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

  console.log('Next.js server is ready. Running tests...');
  let hasFailed = false;

  for (const route of routesToTest) {
    try {
      const response = await fetch(`${BASE_URL}${route.path}`, {
        redirect: 'manual'
      });
      const status = response.status;
      const isPassed = route.expected.includes(status);
      
      console.log(
        `${isPassed ? '✅ PASS' : '❌ FAIL'} | Route: ${route.path.padEnd(20)} | Expected: ${route.expected.join('/')} | Actual: ${status}`
      );
      
      if (!isPassed) {
        hasFailed = true;
      }
    } catch (error) {
      console.error(`❌ FAIL | Route: ${route.path} | Error fetching: ${error.message}`);
      hasFailed = true;
    }
  }

  cleanup();
  
  if (hasFailed) {
    console.error('\nOne or more route tests failed!');
    process.exit(1);
  } else {
    console.log('\nAll route tests passed successfully!');
    process.exit(0);
  }
}

runTests();
