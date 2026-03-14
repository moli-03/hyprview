import { ResultAsync } from "neverthrow";
import type { Monitor, MonitorConfiguration } from "../types/monitor";
import { TerminalError, JsonParseError, ParseError } from "../../errors";

export type HyprlandQueryError = TerminalError | JsonParseError;

export type HyprlandQueryPort = {
  getMonitors: () => ResultAsync<Monitor[], HyprlandQueryError>;

  applyMonitorConfiguration: (
    configuration: MonitorConfiguration,
  ) => ResultAsync<string, HyprlandQueryError>;

  getMonitorConfigurations: () => ResultAsync<
    MonitorConfiguration[],
    HyprlandQueryError | ParseError
  >;
};
