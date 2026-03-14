import { ResultAsync, fromPromise } from "neverthrow";
import { TerminalError, getErrorOrUndefined } from "../errors";
import { spawn } from "bun";

export const execute = (parts: string | string[]): ResultAsync<string, TerminalError> => {
  const command = splitParts(parts);

  const proc = spawn(command);

  return fromPromise(
    new Response(proc.stdout).text(),
    error =>
      new TerminalError(`Failed to execute command: ${command}`, {
        command: command.join(" "),
        exitCode: proc.exitCode,
        cause: getErrorOrUndefined(error),
      }),
  );
};

const splitParts = (parts: string | string[]) => {
  if (Array.isArray(parts)) {
    return parts;
  }

  return parts.split(" ");
};
