"use client";

import Navbar from "@/component/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/component/Container";
import { formatTemp, getTempColorClass, getTempBgClass } from "@/utils/temperatureUtils";import WeatherIcon from "@/component/WeatherIcon";
import getDayOrNightIcon from "../utils/getNightOrDayIcon";
import { getCityLocalDate, getCityLocalHour } from "@/utils/cityTime";
import WeatherDetails from "@/component/WeatherDetails";
import { metersToKilometers } from "@/utils/mitersToKilomiters";
import { metersPerSecondToKilometersPerHour } from "@/utils/converWindSpeed";
import ForcastWeatherDetails from "@/component/ForcastWeatherDetails";
import Reveal from "@/component/Reveal";
import { useAtom } from "jotai";
import { placeAtom, unitAtom } from "./atom";

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: CityInfo;
}

interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface CityInfo {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

const Home = () => {
  const [place] = useAtom(placeAtom);
  const [unit] = useAtom(unitAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ["weather", place],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/weather?action=forecast&place=${place}`
      );
      return data;
    },
    retry: 1,
  });

  const firstData = data?.list[0];

  const timezone = data?.city.timezone ?? 0;

  const uniqueDates = [
    ...new Set(
      data?.list.map((entry) => getCityLocalDate(entry.dt, timezone))
    ),
  ];

  // Filtering data to get the first entry after 6 AM (city-local time) for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = getCityLocalDate(entry.dt, timezone);
      const entryTime = getCityLocalHour(entry.dt, timezone);
      return entryDate === date && entryTime >= 6;
    });
  });

  if (error)
    return (
      <div className="relative flex flex-col gap-4 bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 min-h-screen text-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
        <BackgroundFX />
        <Navbar location={data?.city.name} />
        <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
          <ErrorState
            place={place}
            message={getErrorMessage(error)}
            onRetry={refetch}
          />
        </main>
      </div>
    );

  return (
    <div className="relative flex flex-col gap-4 bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 min-h-screen text-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
      <BackgroundFX />
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data  */}
        {isPending ? (
          <WeatherSkeleton />
        ) : !firstData ? (
          <EmptyState />
        ) : (
          <>
            <Reveal>
              <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end font-semibold dark:text-white">
                  <p className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:to-indigo-300">
                    {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}
                  </p>
                  <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className={`flex-col md:flex-row gap-4 sm:gap-10 px-4 sm:px-6 items-center shadow-sm border ${getTempBgClass(firstData?.main?.temp ?? 0)}`}>
                  <div className="flex flex-col px-4">
                    <span className={`text-5xl font-bold tracking-tighter ${getTempColorClass(firstData?.main?.temp ?? 0)}`}>
                      {formatTemp(firstData?.main?.temp ?? 0, unit)}
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      <span>Feels like</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatTemp(firstData?.main?.feels_like ?? 0, unit)}
                      </span>
                    </p>
                    <p className="space-x-2 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatTemp(firstData?.main?.temp_min ?? 0, unit)} ↓{" "}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {" "}
                        {formatTemp(firstData?.main?.temp_max ?? 0, unit)} ↑
                      </span>
                    </p>
                  </div>
                  {/* time and weather icon  */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto scrollbar-thin w-full justify-between pr-3 ">
                    {data.list.map((d, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                        >
                          <p className="whitespace-nowrap">
                            {format(parseISO(d.dt_txt), "h:mm a")}
                          </p>
                          <WeatherIcon
                            iconName={getDayOrNightIcon(
                              d?.weather[0].icon,
                              d.dt,
                              timezone
                            )}
                          />
                          <p className={`font-bold ${getTempColorClass(d?.main?.temp ?? 0)}`}>{formatTemp(d?.main?.temp ?? 0, unit)}</p>
                        </div>
                      );
                    })}
                  </div>
                </Container>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* left site  */}
                <Container className="w-full md:w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize font-semibold text-slate-800 dark:text-slate-100">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt ?? 0,
                      timezone
                    )}
                  />
                </Container>
                <Container className="flex-1 px-6 gap-4 justify-between overflow-x-auto scrollbar-thin">
                  <WeatherDetails
                    visibility={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hpa`}
                    windSpeed={metersPerSecondToKilometersPerHour(
                      firstData?.wind.speed ?? 1.64
                    )}
                    sunrise={format(
                      fromUnixTime(data?.city.sunrise ?? 170294952),
                      "H:mm"
                    )}
                    sunset={format(
                      fromUnixTime(data?.city.sunset ?? 170294952),
                      "H:mm"
                    )}
                    humidity={`${firstData?.main.humidity}%`}
                  />
                </Container>
                {/* right side  */}
              </div>
              </section>
              </Reveal>

            {/* 7 days data  */}
            <Reveal delay={100}>
            <section className="flex w-full flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-sky-300 dark:to-indigo-300">
                  5-Day Forecast
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-sky-400/50 to-transparent dark:from-sky-400/30" />
              </div>
              {firstDataForEachDate.map((d, i) => (
                <Reveal key={i} delay={i * 80}>
                <ForcastWeatherDetails
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={getDayOrNightIcon(
                    d?.weather[0].icon ?? "01d",
                    d?.dt ?? 0,
                    timezone
                  )}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "EEEE") : "Not found"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main?.temp ?? 0}
                  unit={unit}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visibility={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${metersPerSecondToKilometersPerHour(
                    d?.wind.speed ?? 1.64
                  )} `}
                />
                </Reveal>
              ))}
              </section>
              </Reveal>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

const WeatherSkeleton = () => {
  const glass =
    "rounded-2xl bg-white/50 border border-white/60 ring-1 ring-inset ring-white/30 backdrop-blur-xl dark:bg-slate-900/40 dark:border-white/10 dark:ring-white/10";
  const bar = "rounded-full bg-slate-400/30 dark:bg-slate-300/10";

  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* Today Data */}
      <section className="space-y-4">
        <div className="h-6 w-48 rounded-full bg-slate-400/30 dark:bg-slate-300/10" />
        <div
          className={`${glass} flex flex-col md:flex-row gap-10 items-center px-6 py-4`}
        >
          <div className="flex flex-col gap-3">
            <div className={`h-9 w-20 ${bar}`} />
            <div className={`h-3 w-24 ${bar}`} />
            <div className={`h-3 w-24 ${bar}`} />
          </div>
          <div className="flex gap-4 overflow-x-auto w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`h-4 w-12 ${bar}`} />
                <div className={`h-10 w-10 rounded-full ${bar}`} />
                <div className={`h-4 w-10 ${bar}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description + Details */}
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className={`${glass} flex flex-col items-center gap-3 w-full md:w-40 px-4`}
        >
          <div className={`h-4 w-24 ${bar}`} />
          <div className={`h-12 w-12 rounded-full ${bar}`} />
        </div>
        <div
          className={`${glass} px-6 flex gap-8 w-full overflow-x-auto items-center justify-between`}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 items-center w-16">
              <div className={`h-3 w-16 ${bar}`} />
              <div className={`h-9 w-9 rounded-full ${bar}`} />
              <div className={`h-3 w-12 ${bar}`} />
            </div>
          ))}
        </div>
      </div>

      {/* 7 Days Forecast */}
      <section className="flex flex-col gap-4">
        <div className={`h-6 w-40 ${bar}`} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`${glass} flex items-center gap-4 p-4`}>
            <div className={`h-10 w-10 rounded-full ${bar}`} />
            <div className="flex flex-col gap-1">
              <div className={`h-3 w-32 ${bar}`} />
              <div className={`h-3 w-20 ${bar}`} />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

function getErrorMessage(error: Error): string {
  const responseError = (
    error as unknown as { response?: { data?: { error?: string } } }
  ).response?.data?.error;
  return responseError ?? error.message;
}

const ErrorState = ({
  place,
  message,
  onRetry,
}: {
  place: string;
  message: string;
  onRetry: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-6xl">🌦️</p>
      <div>
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Couldn&apos;t load the weather for &quot;{place}&quot;
        </p>
        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Try again
      </button>
    </div>
  );
};

const BackgroundFX = () => {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-sky-300/40 blur-3xl animate-blob dark:bg-sky-600/20" />
      <div className="absolute top-1/4 -right-32 h-[30rem] w-[30rem] rounded-full bg-indigo-300/40 blur-3xl animate-blob [animation-delay:-6s] dark:bg-indigo-600/20" />
      <div className="absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-300/30 blur-3xl animate-blob [animation-delay:-12s] dark:bg-violet-600/20" />
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-6xl">🌤️</p>
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        No forecast data available yet
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Search for a city above to see its weather.
      </p>
    </div>
  );
};
