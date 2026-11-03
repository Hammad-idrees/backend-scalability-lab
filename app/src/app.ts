// Builds the Fastify app and plugs in every feature.
// Adding a feature = one import + one register line here. Nothing else changes.
import Fastify from "fastify";
import healthRouter from "./features/health/health.router.js";
import productsRouter from "./features/products/products.router.js";
import heavyRouter from "./features/heavy/heavy.router.js";
import crashRouter from "./features/crash/crash.router.js";

export const buildApp = () => {
  const app = Fastify({ logger: false });

  app.register(healthRouter, { prefix: "/health" });
  app.register(productsRouter, { prefix: "/products" });
  app.register(heavyRouter, { prefix: "/heavy" });
  app.register(crashRouter, { prefix: "/crash" });

  return app;
};
