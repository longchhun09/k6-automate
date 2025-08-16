import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Rate } from 'k6/metrics';

// Load test data from JSON file
const testData = new SharedArray('test-data', function () {
  return JSON.parse(open('./static-test-files/test-data.json'));
});

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
  },
};

export default function () {
  // Get random user from test data
  const user = testData.users[Math.floor(Math.random() * testData.users.length)];

  // Simulate user login
  const loginResponse = http.post('https://api.example.com/login', JSON.stringify({
    email: user.email,
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  if (loginResponse.status !== 200) {
    errorRate.add(1);
  }

  sleep(1);

  // Get user profile
  const profileResponse = http.get(`https://api.example.com/users/${user.id}`, {
    headers: { 'Authorization': `Bearer ${loginResponse.json('token')}` }
  });

  check(profileResponse, {
    'profile retrieved': (r) => r.status === 200,
    'profile response time < 300ms': (r) => r.timings.duration < 300,
  });

  if (profileResponse.status !== 200) {
    errorRate.add(1);
  }

  sleep(1);

  // Browse products
  const productsResponse = http.get('https://api.example.com/products');

  check(productsResponse, {
    'products retrieved': (r) => r.status === 200,
    'products response time < 400ms': (r) => r.timings.duration < 400,
  });

  if (productsResponse.status !== 200) {
    errorRate.add(1);
  }

  sleep(2);
}
