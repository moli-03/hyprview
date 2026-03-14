import { readFileSync } from "fs";
import { Result, err } from "neverthrow";
import { ConfigError, getErrorOrUndefined } from "../errors";
import { parseJson } from "../utils/json";
import { Config } from "./types";

export const loadConfig = (path: string): Result<Config, ConfigError> => {
  let raw: string;
  try {
    raw = readFileSync(path, "utf-8");
  } catch (e) {
    return err(
      new ConfigError(`Cannot read config: ${path}`, { path, cause: getErrorOrUndefined(e) }),
    );
  }
  return parseJson<Config>(raw).mapErr(
    e => new ConfigError(`Invalid JSON in config: ${path}`, { path, cause: e }),
  );
};
