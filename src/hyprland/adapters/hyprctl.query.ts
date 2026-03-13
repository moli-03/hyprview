import { execute } from '../../utils/terminal';
import { parseJson } from '../../utils/json';
import type { HyprlandQueryPort } from '../ports/query.port';
import type { Monitor, MonitorConfiguration } from '../types/monitor';
import { formatMonitorConfiguration } from '../utils/monitor';

export const hyprctlQueryAdapter: HyprlandQueryPort = {
  getMonitors: () => execute('hyprctl monitors -j').andThen(parseJson<Monitor[]>),
  applyMonitorConfiguration: (configuration: MonitorConfiguration) => {
    const monitorConfiguration = formatMonitorConfiguration(configuration);
    return execute(['hyprctl', 'monitor', monitorConfiguration]).map(() => void 0);
  },
};
