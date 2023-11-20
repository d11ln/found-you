import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: "ts-jest",
  testEnvironment: "node",
};

export default config;
