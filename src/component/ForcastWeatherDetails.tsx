import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import {
  formatTemp,
  getTempColorClass,
  getTempBgClass,
} from "@/utils/temperatureUtils";
import type { Unit } from "@/app/atom";

export interface ForcastWeatherDetails extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  description: string;
  unit: Unit;
}

const ForcastWeatherDetails = (props: ForcastWeatherDetails) => {
  const {
    weatherIcon = "02d",
    date = "10.09",
    day = "Tusday",
    temp,
    feels_like,
    description,
    unit,
    ...rest
  } = props;

  return (
    <Container className={`flex-col md:flex-row gap-4 backdrop-blur-md border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${getTempBgClass(temp ?? 0)}`}>
      {/* left section  */}
      <section className="flex gap-4 items-center px-4 w-full md:w-fit">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p className="font-semibold text-slate-700 dark:text-slate-200">{date}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{day}</p>
        </div>

        <div className="flex flex-col px-4 md:border-r border-white/30">
          <span className={`text-3xl font-bold ${getTempColorClass(temp ?? 0)}`}>{formatTemp(temp ?? 0, unit)}</span>
          <p className="text-slate-600 text-sm mt-1 dark:text-slate-400">
            <span>Feels like </span>
            <span className="font-semibold dark:text-slate-200">{formatTemp(feels_like ?? 0, unit)}</span>
          </p>
          <p className="capitalize text-slate-500 text-sm dark:text-slate-400">{description}</p>
        </div>
      </section>

      {/* right section  */}

      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...rest} />
      </section>
    </Container>
  );
};
export default ForcastWeatherDetails;
