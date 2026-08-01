import { getCityLocalHour } from "./cityTime";

export default function getDayOrNightIcon(
  iconName: string,
  dt: number,
  timezone: number
): string {
  const hour = getCityLocalHour(dt, timezone);
  const isDay = hour >= 6 && hour < 18;
  return isDay ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}
