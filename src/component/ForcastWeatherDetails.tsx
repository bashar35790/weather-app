import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { formatTemp, getTempColorClass, getTempBgClass } from "@/utils/temperatureUtils";

export interface ForcastWeatherDetails extends WeatherDetailsProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

const ForcastWeatherDetails = (props: ForcastWeatherDetails) => {
  const {
    weatherIcon = "02d",
    date = "10.09",
    day = "Tusday",
    temp,
    feels_like,
    // temp_min,
    // temp_max,
    description,
  } = props;

  return (
    <Container className={`gap-4 backdrop-blur-md border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${getTempBgClass(temp ?? 0)}`}>
      {/* left section  */}
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p className="font-semibold text-slate-700">{date}</p>
          <p className="text-sm text-slate-500">{day}</p>
        </div>

        <div className="flex flex-col px-4 border-r border-white/30">
          <span className={`text-3xl font-bold ${getTempColorClass(temp ?? 0)}`}>{formatTemp(temp ?? 0)}</span>
          <p className="text-slate-600 text-sm mt-1">
            <span>Feels like </span>
            <span className="font-semibold">{formatTemp(feels_like ?? 0)}</span>
          </p>
          <p className="capitalize text-slate-500 text-sm">{description}</p>
        </div>
      </section>

      {/* right section  */}

      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </Container>
  );
};
export default ForcastWeatherDetails;
