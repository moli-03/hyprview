import type { MonitorConfiguration } from '../types/monitor';

export function formatMonitorConfiguration(configuration: MonitorConfiguration): string {
  if (configuration.disabled === true) {
    return `${configuration.name},disabled`;
  }

  const args: string[] = [
    configuration.name,
    `${configuration.width}x${configuration.height}@${configuration.refreshRate}`,
    `${configuration.x}x${configuration.y}`,
    `${configuration.scale}`,
  ];

  if (configuration.transform != null) {
    args.push('transform', String(configuration.transform));
  }
  if (configuration.mirrorOf != null) {
    args.push('mirror', configuration.mirrorOf);
  }
  if (configuration.bitdepth != null) {
    args.push('bitdepth', String(configuration.bitdepth));
  }
  if (configuration.cm != null) {
    args.push('cm', configuration.cm);
  }
  if (configuration.sdrBrightness != null) {
    args.push('sdrbrightness', String(configuration.sdrBrightness));
  }
  if (configuration.sdrSaturation != null) {
    args.push('sdrsaturation', String(configuration.sdrSaturation));
  }
  if (configuration.sdrEotf != null) {
    args.push('sdr_eotf', String(configuration.sdrEotf));
  }
  if (configuration.vrr != null) {
    args.push('vrr', String(configuration.vrr));
  }
  if (configuration.icc != null) {
    args.push('icc', configuration.icc);
  }

  return args.join(',');
}
