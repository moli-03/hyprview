import { ResultAsync } from "neverthrow";
import { execute } from "../../utils/terminal";
import { parseJson } from "../../utils/json";
import type { HyprlandQueryError, HyprlandQueryPort } from "../ports/query.port";
import type { Monitor, MonitorConfiguration } from "../types/monitor";
import { formatMonitorConfiguration, parseMonitorConfiguration } from "../utils/monitor";
import { Result } from "neverthrow";
import { safeSleep } from "../../utils/sleep";

export const createHyprctlQueryAdapter = (hyprlandConfigPath: string): HyprlandQueryPort => {
  const getMonitors = () =>
    execute(`hyprctl monitors all -j`)
      .andThen(parseJson<Monitor[]>)
      .map(monitors =>
        monitors.map(monitor => ({
          ...monitor,
          mirrorOf: monitor.mirrorOf == "none" ? null : monitor.mirrorOf,
        })),
      );

  const disableMonitor = (name: string): ResultAsync<string, HyprlandQueryError> => {
    return applyMonitorConfiguration({ name, disabled: true });
  };

  const applyMonitorConfiguration = (
    configuration: MonitorConfiguration,
  ): ResultAsync<string, HyprlandQueryError> => {
    const applyConfig = () =>
      execute(["hyprctl", "keyword", "monitor", formatMonitorConfiguration(configuration)]);

    // Disabled and mirrored configs don't need the disable-first step
    if (configuration.disabled === true || configuration.mirrorOf != null) {
      return applyConfig();
    }

    return getMonitors().andThen(monitors => {
      const current = monitors.find(m => m.name === configuration.name);
      const wasMirrored = current != null && current.mirrorOf != null;

      // If the monitor is not mirrored, we can apply the configuration directly
      if (!wasMirrored) {
        return applyConfig();
      }

      // Mirrored monitors need to be disabled first. Otherwise applications get messed up.
      // e.g. waybar will not launch on the no longer mirrored monitor, even if manually
      // killed and relaunched.
      return disableMonitor(configuration.name)
        .andThen(() => safeSleep(200))
        .andThen(applyConfig);
    });
  };

  const getMonitorConfigurations = () => {
    return execute(["sh", "-c", `grep -ri "monitor=" ${hyprlandConfigPath}`])
      .map(results => {
        const seen = new Set<string>();
        return results
          .split("\n")
          .filter(line => line.trim() !== "")
          .map(line => {
            const [_, config] = line.split("=");
            return config.split(",");
          })
          .filter(config => {
            const isDisabled = config.length === 2 && config[1] === "disabled";
            if (!isDisabled && config.length < 4) return false;
            const name = config[0];
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
          });
      })
      .andThen(configs => Result.combine(configs.map(parseMonitorConfiguration)));
  };

  return {
    getMonitors,
    applyMonitorConfiguration,
    getMonitorConfigurations,
  };
};

export default createHyprctlQueryAdapter("~/.config/hypr/hyprland.conf");
