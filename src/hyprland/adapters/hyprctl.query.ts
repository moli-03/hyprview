import { execute } from '../../utils/terminal';
import { parseJson } from '../../utils/json';
import type { HyprlandQueryPort } from '../ports/query.port';
import type { Monitor, MonitorConfiguration } from '../types/monitor';

export const hyprctlQueryAdapter: HyprlandQueryPort = {
  getMonitors: () => execute('hyprctl monitors -j').andThen(parseJson<Monitor[]>),
  applyMonitorConfiguration: (configuration: MonitorConfiguration) => {
    const args: string[] = [
      configuration.name,
      `${configuration.x}x${configuration.y}@${configuration.refreshRate}`,
      `${configuration.width}x${configuration.height}`,
      `${configuration.scale}`,
    ];

    if (configuration.mirrorOf != null) {
      args.push('mirror');
      args.push(configuration.mirrorOf);
    }

    return execute(['hyprctl', 'monitor', args.join(', ')]).map(() => void 0);
  },
};
