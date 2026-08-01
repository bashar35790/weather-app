import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const placeAtom = atom("Dhaka,Bangladesh");

export type Unit = "celsius" | "fahrenheit";
export type Theme = "light" | "dark";

export const unitAtom = atomWithStorage<Unit>("weather-unit", "celsius");

export const themeAtom = atomWithStorage<Theme | null>("weather-theme", null);
