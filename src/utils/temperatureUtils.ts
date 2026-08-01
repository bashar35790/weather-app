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
    return "bg-sky-100/40 border-sky-200/60 ring-sky-100/60 dark:bg-sky-500/10 dark:border-sky-400/20 dark:ring-sky-400/10";
  if (temp >= 15 && temp <= 28)
    return "bg-emerald-100/40 border-emerald-200/60 ring-emerald-100/60 dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:ring-emerald-400/10";
  return "bg-orange-100/40 border-orange-200/60 ring-orange-100/60 dark:bg-orange-500/10 dark:border-orange-400/20 dark:ring-orange-400/10";
}
