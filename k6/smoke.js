// SMOKE TEST: "Does it even work?"
// 2 users for 10 seconds. If this fails, don't bother with bigger tests.
//
//   k6 run k6/smoke.js
//   k6 run -e ENDPOINT=/heavy?ms=50 k6/smoke.js
import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const ENDPOINT = __ENV.ENDPOINT || "/products";

export const options = {
  vus: 2, // 2 fake users
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate==0"], // not a single error allowed
  },
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "body has pid": (r) => r.body.includes('"pid"'),
  });
  sleep(1); // a real user waits a bit between clicks
}
