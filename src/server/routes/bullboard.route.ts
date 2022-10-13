import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { Router } from "express";
import basicAuth from "express-basic-auth";
import env from "../env";
import { classesQueue, holidaysQueue, timetableQueue } from "../queue";

const router = Router();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/bullboard");

createBullBoard({
  queues: [
    new BullAdapter(timetableQueue),
    new BullAdapter(classesQueue),
    new BullAdapter(holidaysQueue),
  ],
  serverAdapter,
});

if (env.BULLBOARD_PASSWORD) {
  router.use(
    "/",
    basicAuth({
      challenge: true,
      users: {
        admin: env.BULLBOARD_PASSWORD,
      },
    }),
    serverAdapter.getRouter()
  );
}

export default router;
