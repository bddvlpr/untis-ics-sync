import { Router } from "express";
import { classesQueue } from "../queue";

const router = Router();

router.get("/", async (req, res) => {
  const classJobs = await classesQueue.getJobs([
    "waiting",
    "active",
    "delayed",
  ]);

  const classJob = classJobs.length ? classJobs[0] : await classesQueue.add({});
  const classes = await classJob.finished();

  if (!classes) {
    return res.status(500).send("Could not retrieve classes.");
  }

  res.status(200).send(classes);
});

export default router;
