import { createServer } from "./server";

(() => {
  createServer(Number(process.env.SERVER_PORT) || 3000);
})();
