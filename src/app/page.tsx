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
      <div className="flex flex-col gap-4 bg-gradient-to-br from-blue-100 to-white min-h-screen text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
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
    <div className="flex flex-col gap-4 bg-gradient-to-br from-blue-100 to-white min-h-screen text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data  */}
        {isPending ? (
          <WeatherSkeleton />
        ) : !firstData ? (
          <EmptyState />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end dark:text-white">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className={`flex-col md:flex-row gap-4 sm:gap-10 px-4 sm:px-6 items-center shadow-sm border ${getTempBgClass(firstData?.main?.temp ?? 0)}`}>
                  <div className="flex flex-col px-4">
                    <span className={`text-5xl font-bold tracking-tighter ${getTempColorClass(firstData?.main?.temp ?? 0)}`}>
                      {formatTemp(firstData?.main?.temp ?? 0, unit)}
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatTemp(firstData?.main?.feels_like ?? 0, unit)}
                      </span>
                    </p>
                    <p className="space-x-2 text-xs">
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        {formatTemp(firstData?.main?.temp_min ?? 0, unit)} ↓{" "}
                      </span>
                      <span className="font-medium text-slate-500 dark:text-slate-400">
                        {" "}
                        {formatTemp(firstData?.main?.temp_max ?? 0, unit)} ↑
                      </span>
                    </p>
                  </div>
                  {/* time and weather icon  */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 ">
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
                  <p className="capitalize dark:text-slate-200">
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
                <Container className="flex-1 bg-white/30 backdrop-blur-md px-6 gap-4 justify-between overflow-x-auto shadow-sm">
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

            {/* 7 days data  */}
            <section className="flex w-full flex-col gap-4  ">
              <p className="text-2xl dark:text-white">5-Day Forecast</p>
              {firstDataForEachDate.map((d, i) => (
                <ForcastWeatherDetails
                  key={i}
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
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

const WeatherSkeleton = () => {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 animate-pulse">
      {/* Today Data */}
      <section className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-48 dark:bg-gray-700" />
          <div className="flex flex-col md:flex-row gap-10 items-center bg-white px-6 py-4 rounded shadow dark:bg-slate-800">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 w-24 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 w-24 bg-gray-300 rounded dark:bg-gray-700" />
            </div>
            <div className="flex gap-4 overflow-x-auto w-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="h-4 w-12 bg-gray-300 rounded dark:bg-gray-700" />
                  <div className="h-8 w-8 bg-gray-300 rounded-full dark:bg-gray-700" />
                  <div className="h-4 w-10 bg-gray-300 rounded dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description + Details */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white px-4 py-4 rounded shadow flex flex-col items-center gap-2 w-full md:w-32 dark:bg-slate-800">
          <div className="h-4 w-20 bg-gray-300 rounded dark:bg-gray-700" />
          <div className="h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-700" />
        </div>
        <div className="bg-yellow-300/80 px-6 py-4 rounded flex gap-4 w-full overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 items-start w-24">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-16 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 7 Days Forecast */}
      <section className="flex flex-col gap-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-300 rounded" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white rounded shadow dark:bg-slate-800"
          >
            <div className="h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-700" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-32 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 w-20 bg-gray-300 rounded dark:bg-gray-700" />
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
