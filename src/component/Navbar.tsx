"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MdOutlineLocationOn,
  MdWbSunny,
  MdMyLocation,
  MdOutlineDarkMode,
  MdOutlineLightMode,
} from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { placeAtom, themeAtom, unitAtom, type Theme } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };

interface Suggestion {
  name: string;
  state?: string;
  country?: string;
}

function suggestionLabel(s: Suggestion): string {
  const parts = [s.name];
  if (s.state && s.state !== s.name) parts.push(s.state);
  if (s.country) parts.push(s.country);
  return parts.join(", ");
}

function suggestionValue(s: Suggestion): string {
  return s.country ? `${s.name},${s.country}` : s.name;
}

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [, setPlace] = useAtom(placeAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [unit, setUnit] = useAtom(unitAtom);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pendingSubmitRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  function finishPendingSubmit(newSuggestions: Suggestion[]) {
    const pending = pendingSubmitRef.current;
    if (pending == null) return;
    pendingSubmitRef.current = null;

    if (newSuggestions.length > 0) {
      const match =
        newSuggestions.find((s) => s.name === pending) ?? newSuggestions[0];
      setPlace(suggestionValue(match));
      setShowSuggestions(false);
      setCity("");
    } else {
      setError(`Location not found for "${pending}"`);
    }
  }

  function searchSuggestions(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearching(false);
      finishPendingSubmit([]);
      return;
    }

    setSearching(true);
    const controller = new AbortController();
    abortRef.current = controller;

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `/api/weather?action=find&q=${encodeURIComponent(value)}`,
          { signal: controller.signal },
        );
        const newSuggestions: Suggestion[] = response.data ?? [];
        setSuggestions(newSuggestions);
        setError("");
        setShowSuggestions(true);
        setSearching(false);
        finishPendingSubmit(newSuggestions);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setSuggestions([]);
        setShowSuggestions(false);
        setError("Could not search for this location");
        setSearching(false);
        finishPendingSubmit([]);
      }
    }, 400);
  }

  function handleInputChange(value: string) {
    setCity(value);
    if (pendingSubmitRef.current !== null && pendingSubmitRef.current !== value) {
      pendingSubmitRef.current = null;
    }
    searchSuggestions(value);
  }

  function handleSuggestionClick(suggestion: Suggestion) {
    pendingSubmitRef.current = null;
    setShowSuggestions(false);
    setSuggestions([]);
    setCity("");
    setPlace(suggestionValue(suggestion));
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (searching) {
      pendingSubmitRef.current = city;
      return;
    }

    if (suggestions.length === 0) {
      setError("Location not found");
      return;
    }

    const match = suggestions.find((s) => s.name === city) ?? suggestions[0];
    setPlace(suggestionValue(match));
    setShowSuggestions(false);
    setCity("");
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `/api/weather?action=current&lat=${latitude}&lon=${longitude}`,
          );
          setPlace(response.data.name);
        } catch {
          setError("Could not get weather for your location");
        }
      },
      () => {
        setError("Could not access your location");
      },
    );
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-gray-700">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-2xl sm:text-3xl dark:text-gray-400">
              Weather
            </h2>
            <MdWbSunny className="text-2xl sm:text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center min-w-0">
            <button
              type="button"
              aria-label="Your Current Location"
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-xl sm:text-2xl text-gray-400 hover:opacity-80 hover:text-gray-600 cursor-pointer shrink-0 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <MdMyLocation />
            </button>
            <MdOutlineLocationOn className="text-2xl sm:text-3xl shrink-0" />
            <p className="text-slate-900/80 text-sm truncate dark:text-slate-100">
              {" "}
              {location}{" "}
            </p>
            <button
              type="button"
              onClick={() =>
                setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
              }
              title="Toggle temperature unit"
              aria-label="Toggle temperature unit"
              className="shrink-0 text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              {unit === "celsius" ? "°C" : "°F"}
            </button>
            <button
              type="button"
              onClick={() =>
                setTheme(
                  (theme === "dark" ? "light" : "dark") as Theme,
                )
              }
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
              className="shrink-0 text-xl sm:text-2xl text-gray-400 hover:text-gray-600 cursor-pointer dark:text-gray-500 dark:hover:text-gray-300"
            >
              {(theme ?? "light") === "dark" ? (
                <MdOutlineLightMode />
              ) : (
                <MdOutlineDarkMode />
              )}
            </button>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                {...{ showSuggestions, suggestions, handleSuggestionClick, error }}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden pt-2 pb-3">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            {...{ showSuggestions, suggestions, handleSuggestionClick, error }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: Suggestion[];
  handleSuggestionClick: (item: Suggestion) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 0) || error) && (
        <ul
          role="listbox"
          aria-label="Location suggestions"
          className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2 dark:bg-slate-800 dark:border-gray-600"
        >
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1"> {error} </li>
          )}
          {suggestions.map((item) => (
            <li
              key={`${item.name}-${item.country ?? ""}-${item.state ?? ""}`}
              role="option"
              aria-selected={false}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-slate-100"
            >
              {suggestionLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
