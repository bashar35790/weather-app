# Weather App — Improvement & Bug-Fix Plan

Scope: Bug fixes + core improvements.
API key: removed from source code; user rotates the key in OpenWeather and `.env.local`.

## Phase 1 — Data-correctness & security
- `src/app/page.tsx:83` — delete the commented example URL that leaks the API key.
- `src/app/page.tsx:242` — remove `Math.abs()` so negative temps display correctly (also fixes temp color classes on cold days).
- Timezone fix — new util `getCityLocalDate(dt, tz)` / `getCityLocalHour(dt, tz)` using the `city.timezone` offset:
  - `page.tsx:107-122` daily grouping + "first entry after 6AM" selection → city-local date/hour.
  - `src/utils/getNightOrDayIcon.ts` — accept timezone (or epoch+tz), compute hour with UTC getters instead of browser-local `getHours()`; pass it through for hourly and 7-day forecast icons.
- `page.tsx:233` — change "Forcast (7 days)" → "5-Day Forecast" (OpenWeather caps `cnt` at 40).

## Phase 2 — Query & data flow
- `page.tsx` — queryKey `["weather", place]`; delete the `useEffect(refetch)` (kills double-fetch on mount + stale cache on city switch).
- `page.tsx:131` — replace bare-string error with a styled error card + "Try again" retry; keep Navbar visible.
- `page.tsx:145-148` — guard empty `data.list` (Invalid Date crash) with a fallback/empty state.
- `src/app/layout.tsx` — split into a **server** layout (exports `metadata` + `viewport`) and a client `src/app/providers.tsx` holding a stable `useState(() => new QueryClient())`.
- Remove Grammarly `data-*` attributes (`layout.tsx:37-38`).
- `src/app/globals.css:23` — `color: var(--color-foreground)`.

## Phase 3 — Search & Navbar
- `src/component/Navbar.tsx` — debounced input (~400ms) with `AbortController` to cancel in-flight requests; track a "searching" state so Enter never wrongly shows "Location not found"; clicking a suggestion immediately loads the city (no extra click); remove the artificial 500ms `setTimeout`s; wrap `MdMyLocation` in an accessible button.
- `src/app/api/weather/route.ts` — replace deprecated `/data/2.5/find` with `/geo/1.0/direct`; return `{name, country, state}` so suggestions show "New York, US" and duplicate names are disambiguated. Update `SuggestionBox` + state in Navbar accordingly.
- Skeleton now driven by real fetch state, not a manual timer.

## Phase 4 — Cleanup & polish
- Fix lint: `package.json` script → `eslint .`; move `.eslintrc.json` rules into `eslint.config.mjs`; fix the 3 errors (`any` via `axios.isAxiosError`, unused `_`, delete dead `API_KEY` in Navbar).
- `page.tsx:239-240` — format `day` as `EEEE` (day-of-week) so it's not duplicated with `date`.
- `src/utils/converWindSpeed.ts` — "Km" → "km/h"; typo "Loding..." → "Loading...".
- Rename `visability`→`visibility`, `airPresser`→`airPressure` (WeatherDetails, ForcastWeatherDetails, page) and drop unused `temp_min`/`temp_max` props.
- Add `metadata` (title/description).

## Out of scope
Dark mode, temp-unit toggle, full redesign.
