const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 1000 * 60 * 60 * 24 * 365],
  ["month", 1000 * 60 * 60 * 24 * 30],
  ["week", 1000 * 60 * 60 * 24 * 7],
  ["day", 1000 * 60 * 60 * 24],
  ["hour", 1000 * 60 * 60],
  ["minute", 1000 * 60],
];

export function formatRelativeTime(iso: string, locale: string = "es"): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, ms] of UNITS) {
    const value = diffMs / ms;
    if (Math.abs(value) >= 1) {
      return formatter.format(Math.round(value), unit);
    }
  }
  return formatter.format(0, "minute");
}
