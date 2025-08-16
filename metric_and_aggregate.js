import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';
import { Counter } from 'k6/metrics';

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<100'], // 95% of request should below 100ms
    http_req_duration: ['max<2000'], // 
    http_req_failed: ['rate<0.1'],
    http_reqs: ['count>20'], // ensure when running http reqs happens more than 20 times
    vus: ['value>9'],
    checks: ['rate>=0.99']
  }
};

let myCounter = new Counter('my_counter');

export default function () {
  const response = http.get('https://test.k6.io/' + (exec.scenario.iterationInTest === 1 ? 'foo' : ''));
  // const response = http.get('https://test.k6.io');

  myCounter.add(1);
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
