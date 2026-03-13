export type Monitor = {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  refreshRate: number;
  focused: boolean;
  mirrored: boolean;
  mirrorOf: string | null;
};
