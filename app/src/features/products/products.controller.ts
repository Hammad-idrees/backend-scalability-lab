// The logic: read the query, pick products, send them back. Light and fast.
import type { FastifyRequest } from "fastify";
import { products } from "./products.data.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type ListQuery = { limit?: string; page?: string };

export const list = async (req: FastifyRequest<{ Querystring: ListQuery }>) => {
  const limit = Math.min(Number(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const start = (page - 1) * limit;

  return {
    pid: process.pid,
    page,
    limit,
    total: products.length,
    items: products.slice(start, start + limit),
  };
};
