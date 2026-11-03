# Scaling Lab

Hands-on practice for: PM2 → k6 → Nginx → k6 again.
Reference repo (read only): `../system-design-journey/season-1/2.vertical-vs-horizontal-scaling/`

Full step-by-step explanation: [GUIDE.md](GUIDE.md)
PM2 hands-on exercises: [PM2-PRACTICE.md](PM2-PRACTICE.md)

## Folders

| Path | What goes here | Step |
|---|---|---|
| `app/` | Fastify + TypeScript server, feature-based | 1, 2 |
| `k6/` | Load test scripts | 3, 5 |
| `nginx/` | Nginx config (runs in Docker) | 4 |
| `RESULTS.md` | Benchmark numbers from every run | 3, 5 |

## Steps

- [x] Step 0: Tools + project skeleton
- [x] Step 1: Base app (single process)
- [x] Step 2: PM2 (fork vs cluster, crash recovery)
- [x] Step 3: k6 baseline (no nginx)
- [ ] Step 4: Nginx (reverse proxy, load balancing, gzip, SSL)
- [ ] Step 5: k6 again through nginx, compare

## Machine

| Item | Value |
|---|---|
| OS | Windows 11 |
| CPU cores | 8 |
| Node | v22.18.0 |
| pnpm | 12.16.1 |
| PM2 | 7.1.1 |
| k6 | v2.3.0 |
| Docker | 29.9.2 (engine: 8 CPUs, ~8 GB RAM) |
