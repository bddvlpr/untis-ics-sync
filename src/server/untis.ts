import dotenv from "dotenv";
import WebUntis from "webuntis";

const createUntis = () => {
  dotenv.config();

  var untis;

  if (process.env.UNTIS_USERNAME && process.env.UNTIS_PASSWORD) {
    untis = new WebUntis(
      process.env.UNTIS_SCHOOL || "some school",
      process.env.UNTIS_USERNAME!,
      process.env.UNTIS_PASSWORD!,
      process.env.UNTIS_BASEURL || "x.webuntis.com"
    );
  } else untis = new WebUntis.WebUntisAnonymousAuth(process.env.UNTIS_SCHOOL || "some school", process.env.UNTIS_BASEURL || "x.webuntis.com");

  untis.login();
  return untis;
};

export default createUntis();
