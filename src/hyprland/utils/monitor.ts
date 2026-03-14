import { Result, err, ok } from "neverthrow";
import type {
  ActiveMonitorConfiguration,
  BitDepth,
  ColorManagementPreset,
  Monitor,
  MonitorConfiguration,
  SdrEotf,
  Transform,
  Vrr,
} from "../types/monitor";
import { ParseError } from "../../errors";

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
    args.push("transform", String(configuration.transform));
  }
  if (configuration.mirrorOf != null) {
    args.push("mirror", configuration.mirrorOf);
  }
  if (configuration.bitdepth != null) {
    args.push("bitdepth", String(configuration.bitdepth));
  }
  if (configuration.cm != null) {
    args.push("cm", configuration.cm);
  }
  if (configuration.sdrBrightness != null) {
    args.push("sdrbrightness", String(configuration.sdrBrightness));
  }
  if (configuration.sdrSaturation != null) {
    args.push("sdrsaturation", String(configuration.sdrSaturation));
  }
  if (configuration.sdrEotf != null) {
    args.push("sdr_eotf", String(configuration.sdrEotf));
  }
  if (configuration.vrr != null) {
    args.push("vrr", String(configuration.vrr));
  }
  if (configuration.icc != null) {
    args.push("icc", configuration.icc);
  }

  return args.join(",");
}

export function createMonitorConfiguration(
  monitor: Monitor,
  configuration: Partial<ActiveMonitorConfiguration>,
): ActiveMonitorConfiguration {
  return {
    name: monitor.name,
    width: monitor.width,
    height: monitor.height,
    refreshRate: monitor.refreshRate,
    x: monitor.x,
    y: monitor.y,
    scale: monitor.scale,
    mirrorOf: monitor.mirrorOf,
    transform: monitor.transform,
    sdrBrightness: monitor.sdrBrightness,
    sdrSaturation: monitor.sdrSaturation,
    vrr: monitor.vrr,
    cm: monitor.colorManagementPreset,
    ...configuration,
  };
}

export function parseMonitorConfiguration(
  configuration: string | string[],
): Result<MonitorConfiguration, ParseError> {
  const parts = typeof configuration === "string" ? configuration.split(",") : configuration;

  if (parts.length >= 2 && parts[1] === "disabled") {
    return ok({ name: parts[0], disabled: true as const });
  }

  if (parts.length < 4) {
    return err(new ParseError("Invalid monitor configuration", { value: parts.join(",") }));
  }

  const [name, resolution, position, scale, ...remaining] = parts;

  const [res, refreshRateStr] = resolution.split("@");
  const [widthStr, heightStr] = res.split("x");
  const [xStr, yStr] = position.split("x");

  const result: MonitorConfiguration = {
    name,
    width: parseInt(widthStr),
    height: parseInt(heightStr),
    refreshRate: parseInt(refreshRateStr),
    x: parseInt(xStr),
    y: parseInt(yStr),
    scale: parseFloat(scale),
    mirrorOf: null,
  };

  let i = 0;
  while (i < remaining.length) {
    const key = remaining[i];
    const val = remaining[i + 1];

    if (val == null) {
      return err(new ParseError(`Missing value for ${key}`, { value: key }));
    }

    switch (key) {
      case "transform":
        result.transform = parseInt(val) as Transform;
        break;
      case "mirror":
        result.mirrorOf = val;
        break;
      case "bitdepth":
        result.bitdepth = parseInt(val) as BitDepth;
        break;
      case "cm":
        result.cm = val as ColorManagementPreset;
        break;
      case "sdrbrightness":
        result.sdrBrightness = parseFloat(val);
        break;
      case "sdrsaturation":
        result.sdrSaturation = parseFloat(val);
        break;
      case "sdr_eotf":
        result.sdrEotf = parseInt(val) as SdrEotf;
        break;
      case "vrr":
        result.vrr = parseInt(val) as Vrr;
        break;
      case "icc":
        result.icc = val;
        break;
      default:
        return err(new ParseError(`Unknown configuration option: ${key}`, { value: key }));
    }

    i += 2;
  }

  return ok(result);
}
