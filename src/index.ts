import { createServer } from "./server";

(() => {
  createServer(
    Number(process.env.HTTP_PORT) || 8080,
    Number(process.env.HTTPS_PORT) || 8443
  );
})();
