import type { Unit } from "@/app/atom";

export function convertTemp(temp: number, unit: Unit): number {
  if (unit === "fahrenheit") return (temp * 9) / 5 + 32;
  return temp;
}

export function formatTemp(temp: number, unit: Unit = "celsius"): string {
  return `${Math.round(convertTemp(temp, unit))}${
    unit === "fahrenheit" ? "°F" : "°C"
  }`;
}

export function getTempColorClass(temp: number): string {
  if (temp < 15) return "text-blue-500 dark:text-blue-400";
  if (temp >= 15 && temp <= 28) return "text-emerald-500 dark:text-emerald-400";
  return "text-orange-500 dark:text-orange-400";
}

export function getTempBgClass(temp: number): string {
  if (temp < 15)
    return "bg-blue-50/60 border-blue-200/50 dark:bg-blue-900/40 dark:border-blue-700/40";
  if (temp >= 15 && temp <= 28)
    return "bg-emerald-50/60 border-emerald-200/50 dark:bg-emerald-900/40 dark:border-emerald-700/40";
  return "bg-orange-50/60 border-orange-200/50 dark:bg-orange-900/40 dark:border-orange-700/40";
}
