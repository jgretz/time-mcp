import { ok, err } from './utils.ts';
import type { Result, TimeInfo } from './types.ts';

// US Eastern. Uses the IANA zone (not a fixed "EST") so DST is handled correctly.
export const DEFAULT_TIMEZONE = 'America/New_York';

export function isValidTimeZone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? '';
}

export function getTimeInfo(now: Date, timezone: string): Result<TimeInfo, string> {
  if (!isValidTimeZone(timezone)) {
    return err(
      `Unknown timezone: "${timezone}". Use an IANA name like "America/New_York", "Europe/London", or "Asia/Tokyo".`,
    );
  }

  const local = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(now);

  const offsetParts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  }).formatToParts(now);

  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  }).format(now);

  return ok({
    iso: now.toISOString(),
    timezone,
    local,
    utcOffset: partValue(offsetParts, 'timeZoneName'),
    weekday,
  });
}
