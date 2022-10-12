import { Router } from "express";
import { query, validationResult } from "express-validator";
import { Klasse } from "webuntis";
import redis from "../redis";
import untis from "../untis";

const router = Router();

router.get("/", async (req, res) => {
  const classes = await getClasses();
  if (classes) res.status(200).send(classes);
  else res.status(500).send("Error getting classes");
});

router.get("/search", query("name").isString().exists(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || !req.query) {
    return res.status(400).json({ errors: errors.array() });
  }
  const name = req.query.name;
  const classes = await getClasses();
  if (!classes) return res.status(500).send("Error getting classes");

  res
    .status(200)
    .send(
      classes.filter(
        (k) =>
          k.longName.toLowerCase().includes(name.toLowerCase()) ||
          k.name.toLowerCase().includes(name.toLowerCase())
      )
    );
});

const getClasses = async (): Promise<Klasse[] | undefined> => {
  const cachedClasses = await redis.get("classes");
  if (cachedClasses) {
    return JSON.parse(cachedClasses);
  }

  const classes = await untis.getClasses();
  await redis.set("classes", JSON.stringify(classes), {
    EX: Number(process.env.CACHE_EXPIRE_TIME) | 3600,
  });
  return classes;
};

export default router;
