"use client";

import Navbar from "@/component/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/component/Container";
import { kelvinToCelsius } from "@/utils/convertKelvinToCelcuous";
import WeatherIcon from "@/component/WeatherIcon";
import getDayOrNightIcon from "../utils/getNightOrDayIcon";
import WeatherDetails from "@/component/WeatherDetails";
import { metersToKilometers } from "@/utils/mitersToKilomiters";
import { metersPerSecondToKilometersPerHour } from "@/utils/converWindSpeed";
import ForcastWeatherDetails from "@/component/ForcastWeatherDetails";

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

// Example usage:
// const weatherResponse: WeatherData = await fetchWeatherData();
// const weatherAPI = https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=df8b8624d659c25e75806e97c2e508e5&cnt=56

const Home = () => {
  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ["repoData"],

    queryFn: async () => {
      const { data } = await axios(
        `https://api.openweathermap.org/data/2.5/forecast?q=Dakha&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
  });
  const firstData = data?.list[0];
  console.log("data", data);



  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-bounce">Loding...</p>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col gap-4 bg-gray-100 max-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today data  */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              <div className="flex flex-col px-4">
                <span className="text-3xl">
                  {kelvinToCelsius(firstData?.main?.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                    {kelvinToCelsius(firstData?.main?.feels_like ?? 0)} °
                  </span>
                </p>
                <p className="space-x-2 text-xs">
                  <span>
                    {kelvinToCelsius(firstData?.main?.temp_min ?? 0)} °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {kelvinToCelsius(firstData?.main?.temp_max ?? 0)} °↑
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
                          d.dt_txt
                        )}
                      />
                      <p>{kelvinToCelsius(d?.main?.temp ?? 0)}°</p>
                    </div>
                  );
                })}
              </div>
            </Container>
          </div>
        </section>

        <div className="flex gap-4">
          {/* left site  */}
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <p>{firstData?.weather[0].description}</p>
            <WeatherIcon
              iconName={getDayOrNightIcon(
                firstData?.weather[0].icon ?? "",
                firstData?.dt_txt ?? ""
              )}
            />
          </Container>
          <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
            <WeatherDetails
              visability={metersToKilometers(firstData?.visibility ?? 10000)}
              airPresser={`${firstData?.main.pressure} hpa`}
              windSpeed={metersPerSecondToKilometersPerHour(firstData?.wind.speed ?? 1.64)}
              sunrise={format(fromUnixTime(data?.city.sunrise ?? 170294952),"H:mm")}
              sunset={format(fromUnixTime(data?.city.sunset ?? 170294952),"H:mm")}
              humidity = {`${firstData?.main.humidity}%`}
            />
          </Container>
          {/* right side  */}
        </div>

        {/* 7 days data  */}
        <section className="flex w-full flex-col gap-4  ">
              <p className="text-2xl">Forcast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForcastWeatherDetails
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "dd.MM") : "Not found"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={Math.abs(d?.main?.temp ?? 0)}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPresser={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${metersPerSecondToKilometersPerHour(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>



      </main>
    </div>
  );
};

export default Home;
