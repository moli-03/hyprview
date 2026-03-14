import { Result, fromThrowable } from "neverthrow";
import { JsonParseError, getErrorOrUndefined } from "../errors";

export function parseJson<T>(json: string): Result<T, JsonParseError> {
  const mapper = fromThrowable(
    JSON.parse,
    error =>
      new JsonParseError(`Failed to parse JSON`, {
        json,
        cause: getErrorOrUndefined(error),
      }),
  );

  return mapper(json);
}
