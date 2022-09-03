import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: "node",
  preset: "ts-jest",
  collectCoverage: true,
};

export default config;
