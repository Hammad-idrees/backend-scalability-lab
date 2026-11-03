// Burns CPU on purpose, like resizing an image or hashing a password.
// While this loop runs, this process can't answer ANY other request:
// Node runs our JavaScript on a single thread.
import type { FastifyRequest } from "fastify";

const DEFAULT_MS = 200;
const MAX_MS = 5000;

type HeavyQuery = { ms?: string };

export const run = async (req: FastifyRequest<{ Querystring: HeavyQuery }>) => {
  const targetMs = Math.min(Number(req.query.ms) || DEFAULT_MS, MAX_MS);
  const started = Date.now();

  let result = 0;
  while (Date.now() - started < targetMs) {
    for (let i = 0; i < 10_000; i += 1) result += Math.sqrt(i);
  }

  return {
    pid: process.pid,
    workedMs: Date.now() - started,
    result: Math.round(result),
  };
};
