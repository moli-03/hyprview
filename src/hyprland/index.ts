export type { HyprlandQueryPort, HyprlandQueryError } from "./ports/query.port";
export type { Monitor, MonitorConfiguration } from "./types/monitor";

import hyprctlQueryAdapter from "./adapters/hyprctl.query";

export const queryPort = hyprctlQueryAdapter;
