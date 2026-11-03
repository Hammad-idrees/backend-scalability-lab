# Scaling Lab: Your Step-by-Step Guide

Hi! This is your roadmap. We'll go one step at a time. Read a step, then we build it together.

**What we're really learning:**
A beginner builds an app and asks, *"Does it work?"*
An architect asks, *"How many people can use it at once? What breaks first? How do I prove it?"*

By the end of this lab, you'll be able to answer those questions with real numbers.

---

## The story in one picture

Here's where we start and where we end:

```
START (Step 1):
   users ──────────> [ one Node app ]          ← uses only 1 of your 8 CPU cores

END (Step 5):
   users ──HTTPS──> [ Nginx ] ──┬──> [ app copy 1 ]
                                ├──> [ app copy 2 ]   ← all cores busy,
                                └──> [ app copy ... ]    traffic shared,
                                                         crashes auto-fixed
   ...and k6 measures every change along the way.
```

---

## A few words you'll hear a lot

- **Process**: one running copy of a program.
- **CPU core**: one "brain" inside your CPU. Your PC has **8**.
- **Node is single-threaded**: one Node app uses only **1** core, even if you have 8.
- **Req/s (requests per second)**: how many API calls the server handles each second. More is better.
- **Latency**: how long one request takes. Less is better.
- **p95**: "95% of users got a reply faster than this." It tells you what most people actually feel.
- **Load test**: pretending to be many users at once to see how the server copes.

---

## ✅ Step 0: Get the tools ready (DONE)

We installed everything you need:

- **Node.js**: runs the app
- **pnpm**: installs packages
- **PM2**: runs many copies of the app and restarts them if they crash
- **k6**: pretends to be many users
- **Docker**: runs Nginx
- **git**: saves your progress after each step

Nothing else to do here. 🎉

---

## Step 1: Build a simple app

**In one line:** We build a tiny API and discover its biggest weakness.

### What we'll do
1. Create a Fastify + TypeScript project inside the `app/` folder.
2. Organize it by feature: one folder per feature.
3. Add three endpoints:
   - `/health`: just says "I'm alive"
   - `/products`: returns a list of fake products (quick and easy)
   - `/heavy`: does a lot of math on purpose (slow, like resizing an image)
4. Start it with plain Node on port `3000`.

### What you'll try
1. Open `localhost:3000/products` in your browser. It's instant.
2. Now open `/heavy` in **5 tabs at once**. Notice they finish **one by one**, not together.
3. While those are loading, open `/products` again. It's stuck waiting too!
4. Open Task Manager. Node is using about **1 core**. The other 7 are doing nothing.

### What you'll learn
> One Node app uses one core. If one request is slow and heavy, **everyone else waits.**

That's the problem we fix next.

**Finish line:** All 3 endpoints work, you saw the "waiting" problem, and you saved with git.

---

## Step 2: Use all your CPU cores with PM2

**In one line:** We run 8 copies of the app so all 8 cores share the work.

### Why PM2?
Think of PM2 as a manager for your app. It:
- Starts your app and keeps it running in the background
- Runs **many copies** of it at once (called *cluster mode*)
- **Restarts** a copy automatically if it crashes
- Shows you logs and how much CPU/RAM each copy uses

### Two modes to know
- **Fork mode**: 1 copy. Basically the same as before.
- **Cluster mode**: many copies, all sharing port `3000`. PM2 passes incoming requests around to them, one after another.

### What we'll do
1. Create a PM2 config file (`ecosystem.config.cjs`) so we don't type long commands.
2. Start the app in **fork mode** (1 copy).
3. Start it in **cluster mode** (8 copies).
4. Add a `/crash` endpoint that breaks the app on purpose.

### What you'll try
1. Fork mode: repeat the "5 tabs of `/heavy`" test. Still slow.
2. Cluster mode: same test. Now they finish **together**! 🚀
3. Task Manager: many cores busy now.
4. Visit `/crash` and watch `pm2 list`. The broken copy dies and PM2 brings a new one back by itself.

### Handy PM2 commands
- `pm2 list`: see all copies
- `pm2 logs`: see what they print
- `pm2 monit`: live dashboard
- `pm2 reload`: restart without any downtime
- `pm2 delete all`: stop and remove everything

### What you'll learn
> Real servers never run as a bare `node server.js`. A process manager keeps them using all cores and back on their feet after a crash.

**Finish line:** You ran both modes, saw a crash auto-fixed, and saved with git.

---

## Step 3: Measure it with k6

**In one line:** Stop guessing. Get real numbers.

### Why measure?
"Cluster mode feels faster" isn't good enough. We need proof, like *"cluster handled 4x more requests."*
These first numbers are our **baseline**: the "before" photo we'll compare everything against later.

### How k6 works
You write a small script that says:
- **How many fake users** (k6 calls them VUs, virtual users)
- **Which URL** they should hit
- **For how long**

Then k6 attacks your API and gives you a report.

### The three tests we'll write
1. **Smoke test**: a handful of users for 30 seconds. *"Does it even work?"*
2. **Load test**: normal traffic for about 2 minutes. *"Is it fast on a normal day?"*
3. **Stress test**: keep adding users. *"When does it break?"*

### What we'll do
1. Write the 3 scripts in the `k6/` folder.
2. Run them against **fork mode** (1 copy).
3. Run them against **cluster mode** (8 copies).
4. Write the numbers into `RESULTS.md`.

### What to look at in the report
- **Req/s**: how much work got done
- **p95**: how fast most users got their reply
- **Errors**: did anything fail?

### What to expect
- `/products`: cluster is better, but not hugely (it was already light).
- `/heavy`: cluster is **much** better (heavy work gets shared across cores).

### What you'll learn
> Always **measure before and after** a change. Change only **one thing at a time.**

**Finish line:** RESULTS.md has fork vs cluster numbers, and you saved with git.

---

## Step 4: Put Nginx in front

**In one line:** Nginx becomes the "front door" that every request walks through.

### Why Nginx?
Think of Nginx as a **receptionist**. Visitors (users) never walk straight into the offices (your app). They talk to the receptionist, who sends them to the right place. Nginx can:
- **Share traffic** across many app copies (load balancing)
- **Handle HTTPS**, so your app doesn't have to
- **Compress responses** (gzip) so they download faster
- **Keep working** if one app copy goes down

It's also super efficient: written in C, it handles thousands of connections with very little memory.

### We'll build it in 5 small pieces
1. **Basic forwarding**: Nginx on port `8080` passes requests to the app on `3000`.
2. **Load balancing**: run 2 separate app copies (`3001` and `3002`). Nginx takes turns sending requests to each.
3. **Speed and info**: Nginx reuses connections (keepalive) and tells the app the user's real IP.
4. **Gzip compression**: shrink responses. Compare the size before and after in your browser's DevTools.
5. **HTTPS**: create a test certificate so `https://localhost:8443` works. Your browser will show a warning. That's normal for a test certificate.

### Why we run Nginx in Docker
Nginx is made for Linux. The Windows version is slow. Docker gives us the real Linux version on your PC.

### What you'll try
- **Turn off one app copy.** Nginx automatically sends everyone to the other one. Users don't notice a thing. That's called *high availability*.

### What you'll learn
> Almost every real system has something like Nginx in front. It's the key to running **many servers** instead of one (horizontal scaling).

**Finish line:** All 5 pieces work, you saw traffic switch when one copy stopped, and you saved with git.

---

## Step 5: Measure again, through Nginx

**In one line:** Run the exact same k6 tests as Step 3, now through Nginx, and compare.

### What we'll do
1. Run the tests through Nginx → PM2 cluster.
2. Run them through Nginx → 2 load-balanced app copies.
3. Run with gzip **on** and **off**.
4. Put everything in `RESULTS.md` next to the Step 3 numbers.

### A surprise you might see 😮
On your single PC, going through Nginx might be **a little slower** than hitting the app directly. Why?
- It's one extra stop on the way.
- Docker on Windows adds a bit of network delay.

**That's okay!** Nginx doesn't exist to make one app on one PC faster. It exists to handle **many servers, HTTPS, compression, and failures.** Knowing that trade-off is what makes you think like an architect.

### What you'll learn
> Every tool has a cost. Good engineers know **when** a tool is worth it, and prove it with numbers.

**Finish line:** RESULTS.md is complete, you can explain why each number went up or down, and you saved with git.

---

## After that (optional)

If you want to keep going:
- **MongoDB**: a real database instead of fake data
- **Redis**: caching, to make `/products` even faster
- **Prometheus + Grafana**: live graphs of your server's health

---

## 4 simple rules for every step

1. **Change one thing at a time.** Otherwise you won't know what made the difference.
2. **Measure before and after.**
3. **Write it down** in RESULTS.md.
4. **Save with git** when the step is done.

---

Ready? Say **"start step 1"** and let's build. 🚀
