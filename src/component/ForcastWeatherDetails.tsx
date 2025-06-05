import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailsProps } from "./WeatherDetails";
import { kelvinToCelsius } from "@/utils/convertKelvinToCelcuous";

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
    <Container className="gap-4">
      {/* left section  */}
      <section className="flex gap4 items-center px-4">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span className="text-3xl">{kelvinToCelsius(temp ?? 0)}°</span>
          <p>
            <span>Feels like</span>
            <span>{kelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalize">{description}</p>
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
