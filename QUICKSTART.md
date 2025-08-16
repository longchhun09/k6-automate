# k6 Quick Start Guide

Get up and running with k6 performance testing in minutes!

## 🚀 Quick Start

### 1. Verify Installation
```bash
k6 version
```

### 2. Run Your First Test
```bash
# Basic test
npm test

# Or directly with k6
k6 run scenarios.js
```

### 3. Available Test Scripts

```bash
# Basic scenario test
npm test

# Custom tags test (with thresholds)
npm run test:custom

# Load test with test data
npm run test:load

# Generate HTML report
npm run test:html
```

## 📁 Test Files Overview

| File | Purpose | Command |
|------|---------|---------|
| `scenarios.js` | Basic HTTP test | `k6 run scenarios.js` |
| `custom-tags.js` | Advanced test with custom metrics | `k6 run custom-tags.js` |
| `static-test-files/load-test-scenario.js` | Load test with test data | `k6 run static-test-files/load-test-scenario.js` |

## 🎯 Common Commands

### Basic Testing
```bash
# Run with 20 virtual users
k6 run --vus 20 scenarios.js

# Run for 2 minutes
k6 run --duration 2m scenarios.js

# Run with both custom VUs and duration
k6 run --vus 10 --duration 1m scenarios.js
```

### Output Options
```bash
# Save results to JSON
k6 run --out json=results.json scenarios.js

# Save results to CSV
k6 run --out csv=results.csv scenarios.js

# Generate HTML report
k6 run --out json=results.json scenarios.js && k6-html-reporter results.json
```

### Environment Variables
```bash
# Set environment variables
VUS=50 DURATION=5m k6 run scenarios.js

# Use .env file
k6 run --env-file .env scenarios.js
```

## 📊 Understanding Results

When you run a k6 test, you'll see output like this:

```
     █ TOTAL RESULTS 

    checks_total.......: 380     60.73927/s
    checks_succeeded...: 100.00% 380 out of 380
    checks_failed......: 0.00%   0 out of 380

    ✓ status is 200
    ✓ response time < 500ms

    HTTP
    http_req_duration..............: avg=138.32ms min=24.67ms  med=38.35ms  max=271.28ms p(90)=256.95ms p(95)=259.97ms
    http_req_failed................: 0.00%  0 out of 390
    http_reqs......................: 390    62.337672/s
```

### Key Metrics Explained

- **checks_total**: Total number of assertions made
- **checks_succeeded**: Percentage of passed assertions
- **http_req_duration**: Response time statistics
- **http_req_failed**: Percentage of failed requests
- **http_reqs**: Requests per second

## 🔧 Customization

### Modify Test Parameters
Edit the `options` object in your test file:

```javascript
export const options = {
  vus: 10,              // Number of virtual users
  duration: '30s',      // Test duration
  thresholds: {         // Performance thresholds
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

### Add Custom Metrics
```javascript
import { Counter, Rate } from 'k6/metrics';

const customCounter = new Counter('custom_counter');
const customRate = new Rate('custom_rate');

export default function () {
  // Your test logic here
  customCounter.add(1);
  customRate.add(1);
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Test fails immediately**: Check if the target URL is accessible
2. **High error rate**: Verify the API endpoints are working
3. **Slow performance**: Check your system resources

### Debug Mode
```bash
# Run with debug logging
k6 run --log-level=debug scenarios.js

# Run with verbose output
k6 run --verbose scenarios.js
```

## 📚 Next Steps

1. **Read the full README.md** for comprehensive documentation
2. **Explore the test files** to understand different testing patterns
3. **Modify the test data** in `static-test-files/test-data.json`
4. **Create your own test scenarios** based on your application needs

## 🆘 Need Help?

- Check the [k6 documentation](https://k6.io/docs/)
- Visit the [k6 community](https://community.k6.io/)
- Review the examples in this project

Happy testing! 🎉
