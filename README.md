# Weather App

A premium, fully responsive weather dashboard built with Next.js. It shows current conditions, an hourly breakdown, and a 5-day forecast for any city, with a glassmorphic UI, animated aurora background, dark mode, and a Celsius/Fahrenheit toggle.

## Overview

- **Search any city** — debounced autocomplete with geocoding suggestions (shows city, state, country).
- **Current location** — uses the browser's geolocation to fetch weather for where you are.
- **Hourly forecast** — rolling breakdown for the current day, with day/night icons based on the city's local time.
- **5-day forecast** — daily summary cards with feels-like temp, visibility, wind, humidity, pressure, sunrise, and sunset.
- **Dark mode** — class-based theme with a manual toggle; defaults to the system preference and persists across sessions.
- **°C / °F toggle** — converts temps on the fly and persists the choice.
- **Premium glassmorphism** — frosted-glass cards, an animated aurora backdrop, smooth scrolling, and reveal-on-scroll animations.

## Key Technologies

| Tech | Purpose |
| --- | --- |
| [Next.js 16](https://nextjs.org) (App Router) | Framework, routing, and server API routes |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling (incl. class-based `dark:` variant) |
| [TanStack React Query v5](https://tanstack.com/query) | Data fetching, caching, retries, refetching |
| [Jotai](https://jotai.org) | Global state + `atomWithStorage` for persisted preferences |
| [Axios](https://axios.dev) | HTTP client for the OpenWeatherMap API |
| [OpenWeatherMap](https://openweathermap.org) | Weather data (geocoding, 5-day/3-hour forecast) |
| [date-fns](https://date-fns.org) | Date/time formatting |
| [react-icons](https://react-icons.github.io/react-icons) | Icons |

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Add your OpenWeatherMap API key to a `.env.local` file:

   ```bash
   WEATHER_KEY=your_openweather_api_key
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Project Structure

```
src/
├── app/
│   ├── api/weather/route.ts   # server-side proxy to OpenWeatherMap (keeps key secret)
│   ├── atom.ts                # Jotai atoms (place, unit, theme)
│   ├── page.tsx               # main weather dashboard
│   ├── providers.tsx          # React Query client + theme application
│   └── layout.tsx             # root layout + fonts
├── component/
│   ├── Navbar.tsx             # floating glass nav, search, toggles
│   ├── SearchBox.tsx          # pill-shaped search input
│   ├── Container.tsx          # glass card primitive
│   ├── WeatherDetails.tsx     # metric icon chips (visibility, wind, etc.)
│   ├── ForcastWeatherDetails.tsx
│   ├── WeatherIcon.tsx
│   └── Reveal.tsx             # reveal-on-scroll wrapper
└── utils/
    ├── cityTime.ts            # city-local date/hour from UTC offset
    ├── temperatureUtils.ts    # °C/°F conversion + temp color classes
    ├── getNightOrDayIcon.ts
    ├── converWindSpeed.ts
    ├── mitersToKilomiters.ts
    └── cn.ts
```

## Challenges & Decisions So Far

- **City-local timezone handling** — OpenWeather forecast times are UTC, so days/hourly icons and daily grouping are computed with the city's `timezone` offset instead of the browser's local clock (`getCityLocalDate`/`getCityLocalHour`). Day/night icons are chosen from the city-local hour, not the visitor's hour.
- **Temp-unit conversion without breaking colors** — the background/card color coding is keyed to °C thresholds, so temperatures are converted only for display (`formatTemp`) while color classification always uses the raw °C value.
- **Race conditions in search** — autocomplete uses a ~400ms debounce with `AbortController` to cancel in-flight requests, plus a "searching" flag so pressing Enter mid-request resolves to the correct suggestions instead of a false "Location not found".
- **API key security** — the key is only used inside a server route (`/api/weather`); it is never sent to or stored in the browser.
- **Class-based dark mode in Tailwind v4** — required a custom `@custom-variant dark` and applying a `.dark` class on `<html>`, while still defaulting to the system preference and persisting the user's choice.
- **Glassmorphism readability** — translucent glass over colorful blobs hurt text contrast, so overlay strength was reduced and text colors/weights were tuned for both themes.
- **Forecast data limits** — OpenWeather's forecast endpoint caps the number of entries, so the UI intentionally shows a "5-Day Forecast" rather than 7 days.
- **Responsive layout** — no grid framework is used; cards and sections stack on mobile via Tailwind breakpoints (`flex-col md:flex-row`) and long content scrolls horizontally.

## Deployment

The app is configured for Netlify (`netlify.toml`). Set the `WEATHER_KEY` environment variable in your host's dashboard before deploying.
