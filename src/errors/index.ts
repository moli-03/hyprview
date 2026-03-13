type TerminalErrorOptions = {
  command: string;
  exitCode: number | null;
  cause?: Error;
};

export class TerminalError extends Error {
  readonly command: string;
  readonly exitCode: number | null;

  constructor(message: string, options: TerminalErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'TerminalError';
    this.command = options.command;
    this.exitCode = options.exitCode;
  }
}

type JsonParseErrorOptions = {
  json: string;
     cause?: Error;
};

export class JsonParseError extends Error {
  readonly json: string;

  constructor(message: string, options: JsonParseErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'JsonParseError';
    this.json = options.json;
  }
}

type ConfigErrorOptions = {
  path: string;
  cause?: Error;
};

export class ConfigError extends Error {
  readonly path: string;

  constructor(message: string, options: ConfigErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'ConfigError';
    this.path = options.path;
  }
}

export const getErrorOrUndefined = (error: unknown): Error | undefined => {
  if (error instanceof Error) {
    return error;
  }

  return undefined;
};
