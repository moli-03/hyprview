export type ColorManagementPreset =
  | 'none'
  | 'srgb'
  | 'hdr'
  | 'hdredid'
  | 'dcip3'
  | 'dp3'
  | 'adobe'
  | 'wide'
  | 'edid'
  | 'auto';
export type Transform = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  vrr: 0 | 1 | 2;
  solitary: string;
  solitaryBlockedBy: string[];
  activelyTearing: boolean;
  tearingBlockedBy: string[];
  directScanoutTo: string;
  directScanoutBlockedBy: string[];
  disabled: boolean;
  currentFormat: string;
  mirrorOf: string;
  availableModes: string[];
  colorManagementPreset: ColorManagementPreset;
  sdrBrightness: number;
  sdrSaturation: number;
  sdrMinLuminance: number;
  sdrMaxLuminance: number;
};

export type MonitorConfiguration = {
  name: string;
  width: number;
  height: number;
  refreshRate: number;
  x: number;
  y: number;
  scale: number;
  mirrorOf: string | null;
  disabled?: boolean;
  transform?: Transform;
  bitdepth?: 8 | 10;
  cm?: ColorManagementPreset;
  sdrBrightness?: number;
  sdrSaturation?: number;
  sdrEotf?: 0 | 1 | 2;
  vrr?: 0 | 1 | 2;
  icc?: string;
};
