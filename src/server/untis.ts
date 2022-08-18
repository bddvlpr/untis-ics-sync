import dotenv from "dotenv";
import WebUntis from "webuntis";

const createUntis = () => {
  dotenv.config();

  const untis = new WebUntis(
    process.env.UNTIS_SCHOOL || "some school",
    process.env.UNTIS_USERNAME || "some username",
    process.env.UNTIS_PASSWORD || "some password",
    process.env.UNTIS_BASEURL || "x.webuntis.com"
  );
  untis.login();
  return untis;
};

export default createUntis();
