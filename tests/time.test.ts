import { describe, it, expect } from 'bun:test';
import { getTimeInfo, isValidTimeZone, DEFAULT_TIMEZONE } from '../src/time.ts';

// A fixed instant: 2026-06-15T18:30:00Z (summer → EDT, GMT-04:00 in NY).
const FIXED = new Date('2026-06-15T18:30:00Z');

describe('isValidTimeZone', () => {
  it('accepts a valid IANA zone', () => {
    expect(isValidTimeZone('America/New_York')).toBe(true);
    expect(isValidTimeZone('Asia/Tokyo')).toBe(true);
  });

  it('rejects an unknown zone', () => {
    expect(isValidTimeZone('Mars/Phobos')).toBe(false);
    expect(isValidTimeZone('EST5EDT-nonsense')).toBe(false);
  });
});

describe('getTimeInfo', () => {
  it('returns the UTC instant as ISO 8601', () => {
    const result = getTimeInfo(FIXED, DEFAULT_TIMEZONE);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.iso).toBe('2026-06-15T18:30:00.000Z');
  });

  it('resolves Eastern with the summer DST offset', () => {
    const result = getTimeInfo(FIXED, 'America/New_York');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.timezone).toBe('America/New_York');
    expect(result.value.utcOffset).toBe('GMT-04:00');
    expect(result.value.weekday).toBe('Monday');
    // 18:30 UTC = 2:30 PM in New York during EDT
    expect(result.value.local).toContain('2:30');
  });

  it('honors an overridden timezone', () => {
    const result = getTimeInfo(FIXED, 'Asia/Tokyo');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.utcOffset).toBe('GMT+09:00');
    // 18:30 UTC = 3:30 AM next day in Tokyo
    expect(result.value.local).toContain('3:30');
  });

  it('errors on an unknown timezone', () => {
    const result = getTimeInfo(FIXED, 'Not/AZone');
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toContain('Unknown timezone');
  });
});
