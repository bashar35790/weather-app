export function metersPerSecondToKilometersPerHour(speedMps: number): string {
  return `${(speedMps * 3.6).toFixed(0)} Km`;
}
