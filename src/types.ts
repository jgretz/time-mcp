// Result type — prefer over throwing
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type TimeInfo = {
  iso: string; // UTC ISO 8601 instant
  timezone: string; // resolved IANA zone
  local: string; // human-readable local time in that zone
  utcOffset: string; // e.g. "GMT-04:00"
  weekday: string;
};
