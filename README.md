# k6 Performance Testing Tool

This project contains performance tests using [k6](https://k6.io/), a modern load testing tool for developers and DevOps engineers.

## What is k6?

k6 is a modern load testing tool built for developers and DevOps engineers. It's designed to be:

- **Developer-friendly**: Write tests in JavaScript with a simple, familiar API
- **Performance-focused**: Built for high-performance load testing
- **Cloud-native**: Easy integration with CI/CD pipelines and cloud platforms
- **Extensible**: Rich ecosystem of extensions and integrations

## Prerequisites

- **macOS**: Homebrew (recommended) or direct download
- **Linux**: Package managers or direct download
- **Windows**: Chocolatey, Scoop, or direct download

## Installation

### macOS (Recommended)
```bash
brew install k6
```

### Alternative Installation Methods

1. **Direct Download**: Visit [k6.io/download](https://k6.io/download)
2. **Docker**: `docker pull grafana/k6`
3. **npm**: `npm install -g k6`

## Project Structure

```
k6-tool/
├── README.md           # This file
├── package.json        # Project configuration
├── scenarios.js        # Main test scenarios
├── custom-tags.js      # Custom test scenarios
└── static-test-files/  # Test data and static files
```

## Running Tests

### Basic Test Execution

```bash
# Run the main test scenario
k6 run scenarios.js

# Run with npm script
npm test

# Run custom tags test
k6 run custom-tags.js
```

### Test Options

You can override test options via command line:

```bash
# Run with different virtual users
k6 run --vus 20 scenarios.js

# Run for different duration
k6 run --duration 60s scenarios.js

# Run with stages (ramp-up, steady, ramp-down)
k6 run --stage 30s:10 --stage 1m:20 --stage 30s:0 scenarios.js
```

### Output Options

```bash
# Save results to JSON
k6 run --out json=results.json scenarios.js

# Save results to CSV
k6 run --out csv=results.csv scenarios.js

# Send results to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 scenarios.js

# Generate HTML report (requires k6-html-reporter)
k6 run --out json=results.json scenarios.js && k6-html-reporter results.json
```

## Test Configuration

### Basic Test Structure

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 10,              // Number of virtual users
  duration: '30s',      // Test duration
  thresholds: {         // Performance thresholds
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be below 1%
  },
};

export default function () {
  const response = http.get('https://test.k6.io');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

### Advanced Options

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up to 10 users
    { duration: '5m', target: 10 },  // Stay at 10 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>100'],         // Should handle at least 100 req/s
  },
};
```

## Common Test Scenarios

### 1. Load Testing
```javascript
export const options = {
  vus: 50,
  duration: '5m',
};
```

### 2. Stress Testing
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};
```

### 3. Spike Testing
```javascript
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 10 },
  ],
};
```

### 4. Soak Testing
```javascript
export const options = {
  vus: 10,
  duration: '1h',
};
```

## HTTP Methods

```javascript
// GET request
const response = http.get('https://api.example.com/users');

// POST request with JSON body
const payload = JSON.stringify({ name: 'John', email: 'john@example.com' });
const params = { headers: { 'Content-Type': 'application/json' } };
const response = http.post('https://api.example.com/users', payload, params);

// PUT request
const response = http.put('https://api.example.com/users/1', payload, params);

// DELETE request
const response = http.del('https://api.example.com/users/1');
```

## Checks and Assertions

```javascript
import { check } from 'k6';

const response = http.get('https://api.example.com/users');

check(response, {
  'status is 200': (r) => r.status === 200,
  'response time < 500ms': (r) => r.timings.duration < 500,
  'response has users': (r) => r.json().length > 0,
  'user has name': (r) => r.json()[0].name !== undefined,
});
```

## Environment Variables

```javascript
// Set environment variables
export const options = {
  vus: __ENV.VUS || 10,
  duration: __ENV.DURATION || '30s',
};

// Use in requests
const baseUrl = __ENV.BASE_URL || 'https://test.k6.io';
const response = http.get(`${baseUrl}/api/users`);
```

## Running with Environment Variables

```bash
# Set environment variables
VUS=20 DURATION=60s k6 run scenarios.js

# Or use a .env file
k6 run --env-file .env scenarios.js
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]

jobs:
  k6:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run k6
        uses: grafana/k6-action@v0.3.0
        with:
          filename: scenarios.js
          flags: --out json=results.json
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: results.json
```

## Monitoring and Visualization

### Real-time Monitoring

```bash
# Send results to Grafana Cloud
k6 run --out cloud scenarios.js

# Send to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 scenarios.js

# Send to Prometheus
k6 run --out prometheus scenarios.js
```

### HTML Reports

Install the HTML reporter:
```bash
npm install k6-html-reporter
```

Generate HTML report:
```bash
k6 run --out json=results.json scenarios.js
k6-html-reporter results.json
```

## Best Practices

1. **Start Small**: Begin with low virtual user counts and gradually increase
2. **Set Realistic Thresholds**: Base thresholds on actual requirements
3. **Use Meaningful Checks**: Verify both response status and content
4. **Monitor Resources**: Watch CPU, memory, and network usage
5. **Test in Staging**: Always test against staging environments first
6. **Document Scenarios**: Keep clear documentation of test purposes
7. **Version Control**: Keep test scripts in version control
8. **Regular Testing**: Integrate performance tests into your CI/CD pipeline

## Troubleshooting

### Common Issues

1. **High Memory Usage**: Reduce virtual users or test duration
2. **Network Timeouts**: Increase timeout values or check network connectivity
3. **Test Failures**: Verify target application is running and accessible
4. **Slow Performance**: Check system resources and network latency

### Debug Mode

```bash
# Run with debug logging
k6 run --log-level=debug scenarios.js

# Run with verbose output
k6 run --verbose scenarios.js
```

## Resources

- [k6 Documentation](https://k6.io/docs/)
- [k6 Examples](https://github.com/grafana/k6-examples)
- [k6 Community](https://community.k6.io/)
- [k6 Blog](https://k6.io/blog/)

## License

This project is licensed under the MIT License.
