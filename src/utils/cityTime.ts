export function getCityLocalDate(dt: number, timezone: number): string {
  return new Date((dt + timezone) * 1000).toISOString().split("T")[0];
}

export function getCityLocalHour(dt: number, timezone: number): number {
  return new Date((dt + timezone) * 1000).getUTCHours();
}
