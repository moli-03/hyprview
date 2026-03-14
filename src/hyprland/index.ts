export type { HyprlandQueryPort, HyprlandQueryError } from "./ports/query.port";
export type {
  Monitor,
  MonitorConfiguration,
  ActiveMonitorConfiguration,
  DisabledMonitorConfiguration,
} from "./types/monitor";

import hyprctlQueryAdapter from "./adapters/hyprctl.query";

export const queryPort = hyprctlQueryAdapter;
