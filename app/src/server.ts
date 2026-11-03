// Starts the server. This is the file Node (and later PM2) runs.
import { buildApp } from "./app.js";

const PORT = Number(process.env.PORT) || 3000;

const app = buildApp();

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server (pid ${process.pid}) listening on http://localhost:${PORT}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
