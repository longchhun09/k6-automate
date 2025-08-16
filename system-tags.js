import http from 'k6/http';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'],
        'http_req_duration{status:200}': ['p(95)<1000'],
        'http_req_duration{status:201}': ['p(95)<1000']
    }
}

export default function () {
    http.get('https://f009b2de144c4a51840e01a2ccb2f8f6.api.mockbin.io');
    http.get('https://99053bb2f0744da68242f4c447a27d9d.api.mockbin.io');
}

// Generate HTML report
export function handleSummary(data) {
    return {
        'result.html': htmlReport(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}