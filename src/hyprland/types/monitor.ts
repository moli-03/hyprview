export type ColorManagementPreset =
  | "none"
  | "srgb"
  | "hdr"
  | "hdredid"
  | "dcip3"
  | "dp3"
  | "adobe"
  | "wide"
  | "edid"
  | "auto";
export type Transform = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BitDepth = 8 | 10;
export type SdrEotf = 0 | 1 | 2;
export type Vrr = 0 | 1 | 2;

export type Monitor = {
  id: number;
  name: string;
  description: string;
  make: string;
  model: string;
  serial: string;
  width: number;
  height: number;
  physicalWidth: number;
  physicalHeight: number;
  refreshRate: number;
  x: number;
  y: number;
  activeWorkspace: { id: number; name: string };
  specialWorkspace: { id: number; name: string };
  reserved: [number, number, number, number];
  scale: number;
  transform: Transform;
  focused: boolean;
  dpmsStatus: boolean;
  vrr: Vrr;
  solitary: string;
  solitaryBlockedBy: string[];
  activelyTearing: boolean;
  tearingBlockedBy: string[];
  directScanoutTo: string;
  directScanoutBlockedBy: string[];
  disabled: boolean;
  currentFormat: string;
  mirrorOf: string | null;
  availableModes: string[];
  colorManagementPreset: ColorManagementPreset;
  sdrBrightness: number;
  sdrSaturation: number;
  sdrMinLuminance: number;
  sdrMaxLuminance: number;
};

export type DisabledMonitorConfiguration = {
  name: string;
  disabled: true;
};

export type ActiveMonitorConfiguration = {
  name: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  mirrorOf: string | null;
  disabled?: false;
  transform?: Transform;
  bitdepth?: BitDepth;
  cm?: ColorManagementPreset;
  sdrBrightness?: number;
  sdrSaturation?: number;
  sdrEotf?: SdrEotf;
  vrr?: Vrr;
  icc?: string;
};

export type MonitorConfiguration = DisabledMonitorConfiguration | ActiveMonitorConfiguration;
