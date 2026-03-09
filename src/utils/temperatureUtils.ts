export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function getTempColorClass(temp: number): string {
  if (temp < 15) return "text-blue-500";
  if (temp >= 15 && temp <= 28) return "text-emerald-500";
  return "text-orange-500";
}

export function getTempBgClass(temp: number): string {
  if (temp < 15) return "bg-blue-50/60 border-blue-200/50";
  if (temp >= 15 && temp <= 28) return "bg-emerald-50/60 border-emerald-200/50";
  return "bg-orange-50/60 border-orange-200/50";
}
