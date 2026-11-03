# Results

Same machine (8 cores, Windows 11), k6 on the same PC as the app. Numbers are relative, not absolute.
Change one thing at a time.

## Step 3: load test (k6/load.js, ~50s, no sleep)

| # | Setup | Endpoint | VUs | Req/s | Avg | p95 | p99 | Errors |
|---|---|---|---|---|---|---|---|---|
| 1 | Fork (1 copy) | `/products` | 50 | 5,400 | 7.3 ms | 12.1 ms | 14.0 ms | 0% |
| 2 | Cluster (8 copies) | `/products` | 50 | 13,028 | 2.9 ms | 6.0 ms | 9.0 ms | 0% |
| 3 | Fork (1 copy) | `/heavy?ms=50` | 20 | 20 | 821 ms | 1,060 ms | 1,060 ms | 0% |
| 4 | Cluster (8 copies) | `/heavy?ms=50` | 20 | 146 | 110 ms | 153 ms | 156 ms | 0% |

- `/products`: cluster = **2.4x** more req/s. Not 8x: k6 itself uses a lot of CPU on the same PC.
- `/heavy`: cluster = **7.4x** more req/s. CPU-bound work scales almost with the number of cores.

## Step 3: stress test (k6/stress.js, cluster, `/heavy?ms=50`)

| Users | Req/s | Avg | Max | Errors |
|---|---|---|---|---|
| 0 → 50 | 140 | 164 ms | 484 ms | 0 |
| 50 → 100 | 152 | 471 ms | 1,413 ms | 0 |
| 100 → 200 | 157 | 893 ms | 2,235 ms | 0 |
| 200 → 400 | 157 | 1,569 ms | 9,461 ms | 0 |
| 400 → 800 | 171 | 2,783 ms | 10,253 ms | 304 (timeouts) |

- Capacity is **~150–170 req/s**. More users don't add req/s, they only wait longer.
- Under 500 ms up to **~50–100 users**. Timeouts start around **400 users**.

## Step 3: deploy test (k6/deploy.js, cluster, `/health`, 20 VUs, 30s)

| Command during traffic | Requests | Failed | Max latency |
|---|---|---|---|
| `pm2 restart` | 360,660 | **316** | 4,980 ms |
| `pm2 reload` | 414,733 | **0** | 49 ms |

## Step 5: through Nginx

| # | Setup | Endpoint | VUs | Req/s | Avg | p95 | p99 | Errors |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |
