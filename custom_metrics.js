//
// Create a custom metrics to track on a specific page.
// Scenarios: news page should be below 150ms when 95%
//
import http from 'k6/http';
import { sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const options = {
  vus: 10,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<100'], // 95% of request should below 100ms
    my_counter: ['count>10'],
    response_time_news_page: ['p(95)<150', 'p(99)<200']
  }
};

let myCounter = new Counter('my_counter');
let newsPageResponseTrend = new Trend('response_time_news_page');

export default function () {
  // const response = http.get('https://test.k6.io/' + (exec.scenario.iterationInTest === 1 ? 'foo' : ''));
  let response = http.get('https://test.k6.io');

  myCounter.add(1);
  sleep(2);

  response = http.get('https://test.k6.io/news.php');

  newsPageResponseTrend.add(response.timings.duration);
  sleep(1);
}
