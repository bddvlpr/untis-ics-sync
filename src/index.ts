import { createServer } from "./server";

(() => {
  createServer(
    Number(process.env.HTTP_PORT) || 80,
    Number(process.env.HTTPS_PORT) || 443
  );
})();
