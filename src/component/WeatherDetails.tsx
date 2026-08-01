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
    <div className="flex flex-col items-center gap-2 px-3 py-2 min-w-[92px] rounded-2xl bg-white/40 border border-white/50 shadow-sm backdrop-blur-md dark:bg-white/5 dark:border-white/10">
      <p className="whitespace-nowrap text-[11px] uppercase tracking-wide font-semibold text-slate-600 dark:text-slate-300">
        {props.information}
      </p>
      <div className="grid place-items-center h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-200 text-blue-600 shadow-inner dark:from-sky-500/20 dark:to-blue-600/20 dark:text-sky-300 text-xl">
        {props.icon}
      </div>
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
        {props.value}
      </p>
    </div>
  );
}
export default WeatherDetails;
