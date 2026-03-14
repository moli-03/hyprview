import { Config, Theme } from "./types";
import { DEFAULT_THEME } from "./defaults";

export const resolveTheme = (config: Config | null): Theme => {
  if (!config?.colors) return DEFAULT_THEME;

  const colors = config.colors;

  if ("base00" in colors) {
    return {
      background: colors.base00,
      muted: colors.base03,
      neutral: colors.base05,
      error: colors.base08,
      warning: colors.base09,
      secondary: colors.base0B,
      success: colors.base0B,
      primary: colors.base0D,
      border: colors.base0E,
    };
  }

  if ("primary" in colors) {
    return colors;
  }

  return DEFAULT_THEME;
};
