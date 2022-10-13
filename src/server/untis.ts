import dotenv from "dotenv";
import WebUntis from "webuntis";
import env from "./env";

const createUntis = () => {
  dotenv.config();

  let untis;

  if (env.UNTIS_USERNAME && env.UNTIS_PASSWORD) {
    untis = new WebUntis(
      env.UNTIS_SCHOOL || "some school",
      env.UNTIS_USERNAME || "username",
      env.UNTIS_PASSWORD || "password",
      env.UNTIS_BASEURL || "x.webuntis.com"
    );
  } else
    untis = new WebUntis.WebUntisAnonymousAuth(
      env.UNTIS_SCHOOL || "some school",
      env.UNTIS_BASEURL || "x.webuntis.com"
    );

  untis.login();
  return untis;
};

export default createUntis();
