import { execute } from '../../utils/terminal';
import { parseJson } from '../../utils/json';
import type { HyprlandQueryPort } from '../ports/query.port';
import type { Monitor } from '../types/monitor';

export const hyprctlQueryAdapter: HyprlandQueryPort = {
  getMonitors: () => execute('hyprctl monitors -j').andThen(parseJson<Monitor[]>),
};
