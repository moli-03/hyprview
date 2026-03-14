import { execute } from "../../utils/terminal";
import { parseJson } from "../../utils/json";
import type { HyprlandQueryPort } from "../ports/query.port";
import type { Monitor, MonitorConfiguration } from "../types/monitor";
import { formatMonitorConfiguration, parseMonitorConfiguration } from "../utils/monitor";
import { Result } from "neverthrow";

export const createHyprctlQueryAdapter = (hyprlandConfigPath: string): HyprlandQueryPort => {
  return {
    getMonitors: () => execute(`hyprctl monitors all -j`).andThen(parseJson<Monitor[]>),

    applyMonitorConfiguration: (configuration: MonitorConfiguration) => {
      const monitorConfiguration = formatMonitorConfiguration(configuration);
      return execute(["hyprctl", "keyword", "monitor", monitorConfiguration]);
    },

    getMonitorConfigurations: () => {
      return execute(["sh", "-c", `grep -ri "monitor=" ${hyprlandConfigPath}`])
        .map(results => {
          return results
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(line => {
              const [_, config] = line.split("=");
              return config.split(",");
            })
            .filter(config => config.length >= 4); // at least name, width, height, refreshRate (maybe there are some from hyprlock)
        })
        .andThen(configs => Result.combine(configs.map(parseMonitorConfiguration)));
    },
  };
};

export default createHyprctlQueryAdapter("~/.config/hypr/*");
