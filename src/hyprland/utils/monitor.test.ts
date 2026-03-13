import { describe, expect, test } from 'bun:test';
import { formatMonitorConfiguration } from './monitor';
import type { MonitorConfiguration } from '../types/monitor';

const base: MonitorConfiguration = {
  name: 'DP-1',
  width: 2560,
  height: 1440,
  refreshRate: 144,
  x: 1920,
  y: 0,
  scale: 1,
  mirrorOf: null,
};

describe('formatMonitorConfiguration', () => {
  describe('disabled', () => {
    test('disabled: true → name,disabled', () => {
      expect(formatMonitorConfiguration({ ...base, disabled: true })).toBe('DP-1,disabled');
    });

    test('disabled ignores all other fields', () => {
      expect(
        formatMonitorConfiguration({
          ...base,
          disabled: true,
          transform: 3,
          bitdepth: 10,
          vrr: 1,
        }),
      ).toBe('DP-1,disabled');
    });
  });

  describe('basic (bug fix)', () => {
    test('resolution before position', () => {
      expect(formatMonitorConfiguration(base)).toBe('DP-1,2560x1440@144,1920x0,1');
    });

    test('no spaces in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain(' ');
    });

    test('decimal scale', () => {
      expect(formatMonitorConfiguration({ ...base, scale: 1.5 })).toBe(
        'DP-1,2560x1440@144,1920x0,1.5',
      );
    });

    test('zero position', () => {
      expect(formatMonitorConfiguration({ ...base, x: 0, y: 0 })).toBe('DP-1,2560x1440@144,0x0,1');
    });
  });

  describe('mirror', () => {
    test('mirrorOf set → ends with ,mirror,<name>', () => {
      const result = formatMonitorConfiguration({ ...base, mirrorOf: 'DP-1' });
      expect(result).toMatch(/,mirror,DP-1$/);
    });

    test('mirrorOf: null → no mirror in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain('mirror');
    });
  });

  describe('transform', () => {
    test('transform: 0 → ,transform,0', () => {
      expect(formatMonitorConfiguration({ ...base, transform: 0 })).toContain(',transform,0');
    });

    test('transform: 3 → ,transform,3', () => {
      expect(formatMonitorConfiguration({ ...base, transform: 3 })).toContain(',transform,3');
    });

    test('absent → not in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain('transform');
    });
  });

  describe('bitdepth', () => {
    test('bitdepth: 10 → ,bitdepth,10', () => {
      expect(formatMonitorConfiguration({ ...base, bitdepth: 10 })).toContain(',bitdepth,10');
    });

    test('bitdepth: 8 → ,bitdepth,8', () => {
      expect(formatMonitorConfiguration({ ...base, bitdepth: 8 })).toContain(',bitdepth,8');
    });

    test('absent → not in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain('bitdepth');
    });
  });

  describe('cm', () => {
    test('cm: hdr → ,cm,hdr', () => {
      expect(formatMonitorConfiguration({ ...base, cm: 'hdr' })).toContain(',cm,hdr');
    });

    test('cm: srgb → ,cm,srgb', () => {
      expect(formatMonitorConfiguration({ ...base, cm: 'srgb' })).toContain(',cm,srgb');
    });

    test('absent → not in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain(',cm,');
    });
  });

  describe('sdrBrightness', () => {
    test('sdrBrightness: 0.8 → ,sdrbrightness,0.8', () => {
      expect(formatMonitorConfiguration({ ...base, sdrBrightness: 0.8 })).toContain(
        ',sdrbrightness,0.8',
      );
    });
  });

  describe('sdrSaturation', () => {
    test('sdrSaturation: 1.0 → ,sdrsaturation,1', () => {
      expect(formatMonitorConfiguration({ ...base, sdrSaturation: 1.0 })).toContain(
        ',sdrsaturation,1',
      );
    });
  });

  describe('sdrEotf', () => {
    test('sdrEotf: 2 → ,sdr_eotf,2', () => {
      expect(formatMonitorConfiguration({ ...base, sdrEotf: 2 })).toContain(',sdr_eotf,2');
    });

    test('sdrEotf: 0 → ,sdr_eotf,0 (falsy trap)', () => {
      expect(formatMonitorConfiguration({ ...base, sdrEotf: 0 })).toContain(',sdr_eotf,0');
    });
  });

  describe('vrr', () => {
    test('vrr: 1 → ,vrr,1', () => {
      expect(formatMonitorConfiguration({ ...base, vrr: 1 })).toContain(',vrr,1');
    });

    test('vrr: 0 → ,vrr,0 (falsy trap)', () => {
      expect(formatMonitorConfiguration({ ...base, vrr: 0 })).toContain(',vrr,0');
    });

    test('absent → not in output', () => {
      expect(formatMonitorConfiguration(base)).not.toContain('vrr');
    });
  });

  describe('icc', () => {
    test('icc path → ends with ,icc,<path>', () => {
      expect(formatMonitorConfiguration({ ...base, icc: '/path/color.icc' })).toMatch(
        /,icc,\/path\/color\.icc$/,
      );
    });
  });

  describe('ordering (integration)', () => {
    test('all fields → exact full string in documented order', () => {
      const config: MonitorConfiguration = {
        name: 'HDMI-A-1',
        width: 1920,
        height: 1080,
        refreshRate: 60,
        x: 0,
        y: 0,
        scale: 1,
        mirrorOf: null,
        transform: 1,
        bitdepth: 10,
        cm: 'hdr',
        sdrBrightness: 0.5,
        sdrSaturation: 1.2,
        sdrEotf: 2,
        vrr: 1,
        icc: '/icc/profile.icc',
      };
      expect(formatMonitorConfiguration(config)).toBe(
        'HDMI-A-1,1920x1080@60,0x0,1,transform,1,bitdepth,10,cm,hdr,sdrbrightness,0.5,sdrsaturation,1.2,sdr_eotf,2,vrr,1,icc,/icc/profile.icc',
      );
    });
  });
});
