# app

Fastify + TypeScript server, feature-based.

## Run

```
pnpm install
pnpm build      # TypeScript (src/) -> JavaScript (dist/)
pnpm start      # node dist/server.js on port 3000
```

Change the port: `PORT=3001 pnpm start` (bash) or `$env:PORT=3001; pnpm start` (PowerShell).

## Run with PM2

```
pnpm pm2:fork       # 1 copy
pnpm pm2:cluster    # 1 copy per CPU core (8), round-robin
pnpm pm2:stop       # remove all
```

| Command | What it does |
|---|---|
| `pm2 list` | All copies, pid, restarts (↺), CPU, RAM |
| `pm2 logs` | Live logs (files: `logs/out.log`, `logs/error.log`) |
| `pm2 monit` | Live dashboard |
| `pm2 reload lab-cluster` | Replace workers one by one (deploys) |
| `pm2 kill` | Stop PM2 itself |

`scripts/pm2-start.mjs` restarts the PM2 daemon with `NODE_CLUSTER_SCHED_POLICY=rr`.
Windows lets the OS pick the worker, which keeps picking the same few. Linux uses round-robin by default.

## Endpoints

| URL | What it does |
|---|---|
| `GET /health` | "I'm alive" + which process (pid) answered |
| `GET /products?page=1&limit=20` | Fake products from memory. Light and fast. |
| `GET /heavy?ms=200` | Keeps the CPU busy for `ms` milliseconds (max 5000). Blocks the process. |
| `GET /crash` | Answers, then crashes its own process (PM2 demo) |

## Structure

```
src/
├── server.ts            starts listening on PORT
├── app.ts               builds Fastify, registers each feature
└── features/
    ├── health/          router
    ├── products/        data + controller + router
    └── heavy/           controller + router
```
