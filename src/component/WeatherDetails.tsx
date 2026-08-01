import React from "react";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { MdAir } from "react-icons/md";

export interface WeatherDetailsProps {
  visibility: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

const WeatherDetails = (props: WeatherDetailsProps) => {
  const {
    visibility = "25k",
    humidity = "61%",
    windSpeed = "7 km/h",
    airPressure = "1012 hpa",
    sunrise = "6.20",
    sunset = "18.48",
  } = props;

  return (
    <>
      <SingleWeatherDetails
        icon={<LuEye />}
        information="Visibility"
        value={visibility}
      />
      <SingleWeatherDetails
        icon={<FiDroplet />}
        information="Humidity"
        value={humidity}
      />
      <SingleWeatherDetails
        icon={<MdAir />}
        information="Wind Speed"
        value={windSpeed}
      />
      <SingleWeatherDetails
        icon={<ImMeter />}
        information="Air Pressure"
        value={airPressure}
      />
      <SingleWeatherDetails
        icon={<LuSunrise />}
        information="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetails
        icon={<LuSunset />}
        information="Sunset"
        value={sunset}
      />
    </>
  );
};

export interface SingleWeatherDetailsProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}
function SingleWeatherDetails(props: SingleWeatherDetailsProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80 dark:text-slate-200">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
export default WeatherDetails;
