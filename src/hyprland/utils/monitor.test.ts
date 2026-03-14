import { describe, expect, test } from "bun:test";
import { formatMonitorConfiguration, parseMonitorConfiguration } from "./monitor";
import type { ActiveMonitorConfiguration } from "../types/monitor";
import { ParseError } from "../../errors";

const base: ActiveMonitorConfiguration = {
  name: "DP-1",
  width: 2560,
  height: 1440,
  refreshRate: 144,
  x: 1920,
  y: 0,
  scale: 1,
  mirrorOf: null,
};

describe("formatMonitorConfiguration", () => {
  describe("disabled", () => {
    test("disabled: true → name,disabled", () => {
      expect(formatMonitorConfiguration({ ...base, disabled: true })).toBe("DP-1,disabled");
    });

    test("disabled ignores all other fields", () => {
      expect(formatMonitorConfiguration({ name: "DP-1", disabled: true })).toBe("DP-1,disabled");
    });
  });

  describe("basic (bug fix)", () => {
    test("resolution before position", () => {
      expect(formatMonitorConfiguration(base)).toBe("DP-1,2560x1440@144,1920x0,1");
    });

    test("no spaces in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain(" ");
    });

    test("decimal scale", () => {
      expect(formatMonitorConfiguration({ ...base, scale: 1.5 })).toBe(
        "DP-1,2560x1440@144,1920x0,1.5",
      );
    });

    test("zero position", () => {
      expect(formatMonitorConfiguration({ ...base, x: 0, y: 0 })).toBe("DP-1,2560x1440@144,0x0,1");
    });
  });

  describe("mirror", () => {
    test("mirrorOf set → ends with ,mirror,<name>", () => {
      const result = formatMonitorConfiguration({ ...base, mirrorOf: "DP-1" });
      expect(result).toMatch(/,mirror,DP-1$/);
    });

    test("mirrorOf: null → no mirror in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain("mirror");
    });
  });

  describe("transform", () => {
    test("transform: 0 → ,transform,0", () => {
      expect(formatMonitorConfiguration({ ...base, transform: 0 })).toContain(",transform,0");
    });

    test("transform: 3 → ,transform,3", () => {
      expect(formatMonitorConfiguration({ ...base, transform: 3 })).toContain(",transform,3");
    });

    test("absent → not in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain("transform");
    });
  });

  describe("bitdepth", () => {
    test("bitdepth: 10 → ,bitdepth,10", () => {
      expect(formatMonitorConfiguration({ ...base, bitdepth: 10 })).toContain(",bitdepth,10");
    });

    test("bitdepth: 8 → ,bitdepth,8", () => {
      expect(formatMonitorConfiguration({ ...base, bitdepth: 8 })).toContain(",bitdepth,8");
    });

    test("absent → not in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain("bitdepth");
    });
  });

  describe("cm", () => {
    test("cm: hdr → ,cm,hdr", () => {
      expect(formatMonitorConfiguration({ ...base, cm: "hdr" })).toContain(",cm,hdr");
    });

    test("cm: srgb → ,cm,srgb", () => {
      expect(formatMonitorConfiguration({ ...base, cm: "srgb" })).toContain(",cm,srgb");
    });

    test("absent → not in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain(",cm,");
    });
  });

  describe("sdrBrightness", () => {
    test("sdrBrightness: 0.8 → ,sdrbrightness,0.8", () => {
      expect(formatMonitorConfiguration({ ...base, sdrBrightness: 0.8 })).toContain(
        ",sdrbrightness,0.8",
      );
    });
  });

  describe("sdrSaturation", () => {
    test("sdrSaturation: 1.0 → ,sdrsaturation,1", () => {
      expect(formatMonitorConfiguration({ ...base, sdrSaturation: 1.0 })).toContain(
        ",sdrsaturation,1",
      );
    });
  });

  describe("sdrEotf", () => {
    test("sdrEotf: 2 → ,sdr_eotf,2", () => {
      expect(formatMonitorConfiguration({ ...base, sdrEotf: 2 })).toContain(",sdr_eotf,2");
    });

    test("sdrEotf: 0 → ,sdr_eotf,0 (falsy trap)", () => {
      expect(formatMonitorConfiguration({ ...base, sdrEotf: 0 })).toContain(",sdr_eotf,0");
    });
  });

  describe("vrr", () => {
    test("vrr: 1 → ,vrr,1", () => {
      expect(formatMonitorConfiguration({ ...base, vrr: 1 })).toContain(",vrr,1");
    });

    test("vrr: 0 → ,vrr,0 (falsy trap)", () => {
      expect(formatMonitorConfiguration({ ...base, vrr: 0 })).toContain(",vrr,0");
    });

    test("absent → not in output", () => {
      expect(formatMonitorConfiguration(base)).not.toContain("vrr");
    });
  });

  describe("icc", () => {
    test("icc path → ends with ,icc,<path>", () => {
      expect(formatMonitorConfiguration({ ...base, icc: "/path/color.icc" })).toMatch(
        /,icc,\/path\/color\.icc$/,
      );
    });
  });

  describe("ordering (integration)", () => {
    test("all fields → exact full string in documented order", () => {
      const config: ActiveMonitorConfiguration = {
        name: "HDMI-A-1",
        width: 1920,
        height: 1080,
        refreshRate: 60,
        x: 0,
        y: 0,
        scale: 1,
        mirrorOf: null,
        transform: 1,
        bitdepth: 10,
        cm: "hdr",
        sdrBrightness: 0.5,
        sdrSaturation: 1.2,
        sdrEotf: 2,
        vrr: 1,
        icc: "/icc/profile.icc",
      };
      expect(formatMonitorConfiguration(config)).toBe(
        "HDMI-A-1,1920x1080@60,0x0,1,transform,1,bitdepth,10,cm,hdr,sdrbrightness,0.5,sdrsaturation,1.2,sdr_eotf,2,vrr,1,icc,/icc/profile.icc",
      );
    });
  });
});

describe("parseMonitorConfiguration", () => {
  describe("errors", () => {
    test("too few parts → ParseError", () => {
      const result = parseMonitorConfiguration("DP-1,1920x1080@60");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ParseError);
    });

    test("unknown key in remaining → ParseError", () => {
      const result = parseMonitorConfiguration("DP-1,1920x1080@60,0x0,1,unknown,value");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toContain("Unknown configuration option: unknown");
    });

    test("key with no value (odd remaining) → ParseError", () => {
      const result = parseMonitorConfiguration("DP-1,1920x1080@60,0x0,1,transform");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr().message).toContain("Missing value for transform");
    });
  });

  describe("disabled", () => {
    test("disabled config has no width/height/etc", () => {
      const config = parseMonitorConfiguration("DP-2,disabled")._unsafeUnwrap();
      expect(config).toEqual({ name: "DP-2", disabled: true });
    });

    test("array input: ['DP-2', 'disabled'] works", () => {
      const config = parseMonitorConfiguration(["DP-2", "disabled"])._unsafeUnwrap();
      expect(config).toEqual({ name: "DP-2", disabled: true });
    });
  });

  describe("basic (required fields only)", () => {
    test("parses all required fields correctly", () => {
      const result = parseMonitorConfiguration("DP-1,1920x1080@60,0x0,1");
      expect(result.isOk()).toBe(true);
      const config = result._unsafeUnwrap() as ActiveMonitorConfiguration;
      expect(config.name).toBe("DP-1");
      expect(config.width).toBe(1920);
      expect(config.height).toBe(1080);
      expect(config.refreshRate).toBe(60);
      expect(config.x).toBe(0);
      expect(config.y).toBe(0);
      expect(config.scale).toBe(1);
      expect(config.mirrorOf).toBeNull();
    });
  });

  describe("optional fields", () => {
    const parseActive = (s: string) =>
      parseMonitorConfiguration(s)._unsafeUnwrap() as ActiveMonitorConfiguration;

    test("transform → parsed as integer Transform", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,transform,3").transform).toBe(3);
    });

    test("mirror → sets mirrorOf", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,mirror,HDMI-A-1").mirrorOf).toBe("HDMI-A-1");
    });

    test("bitdepth 10 → parsed correctly", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,bitdepth,10").bitdepth).toBe(10);
    });

    test("bitdepth 8 → parsed correctly", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,bitdepth,8").bitdepth).toBe(8);
    });

    test("cm → ColorManagementPreset string", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,cm,hdr").cm).toBe("hdr");
    });

    test("sdrbrightness → float", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,sdrbrightness,0.8").sdrBrightness).toBeCloseTo(
        0.8,
      );
    });

    test("sdrsaturation → float", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,sdrsaturation,1.2").sdrSaturation).toBeCloseTo(
        1.2,
      );
    });

    test("sdr_eotf → 0|1|2", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,sdr_eotf,2").sdrEotf).toBe(2);
    });

    test("vrr → 0|1|2", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,vrr,1").vrr).toBe(1);
    });

    test("icc → string path", () => {
      expect(parseActive("DP-1,1920x1080@60,0x0,1,icc,/path/color.icc").icc).toBe(
        "/path/color.icc",
      );
    });
  });

  describe("round-trip", () => {
    test("format(parse(str)) === str for fully-featured config", () => {
      const str =
        "HDMI-A-1,1920x1080@60,0x0,1,transform,1,bitdepth,10,cm,hdr,sdrbrightness,0.5,sdrsaturation,1.2,sdr_eotf,2,vrr,1,icc,/icc/profile.icc";
      const result = parseMonitorConfiguration(str);
      expect(result.isOk()).toBe(true);
      expect(formatMonitorConfiguration(result._unsafeUnwrap())).toBe(str);
    });
  });

  describe("array input", () => {
    test("string[] works the same as comma-joined string", () => {
      const str = "DP-1,1920x1080@60,0x0,1,transform,2";
      const fromString = parseMonitorConfiguration(str)._unsafeUnwrap();
      const fromArray = parseMonitorConfiguration(str.split(","))._unsafeUnwrap();
      expect(fromString).toEqual(fromArray);
    });
  });
});
