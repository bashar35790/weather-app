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
    <Container className={`flex-col md:flex-row gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(59,130,246,0.25)] ${getTempBgClass(temp ?? 0)}`}>
      {/* left section  */}
      <section className="relative z-10 flex gap-4 items-center px-4 w-full md:w-fit">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p className="font-semibold text-slate-800 dark:text-slate-100">{date}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{day}</p>
        </div>

        <div className="flex flex-col px-4 md:border-r border-white/40 dark:border-white/10">
          <span className={`text-4xl font-bold tracking-tight ${getTempColorClass(temp ?? 0)}`}>{formatTemp(temp ?? 0, unit)}</span>
          <p className="text-slate-700 text-sm mt-1 dark:text-slate-300">
            <span>Feels like </span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatTemp(feels_like ?? 0, unit)}</span>
          </p>
          <p className="capitalize font-medium text-slate-600 text-sm dark:text-slate-300">{description}</p>
        </div>
      </section>

      {/* right section  */}

      <section className="relative z-10 overflow-x-auto scrollbar-thin flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...rest} />
      </section>
    </Container>
  );
};
export default ForcastWeatherDetails;
