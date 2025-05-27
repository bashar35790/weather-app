import { cn } from '@/utils/cn';
import Image from 'next/image';
import React from 'react';

interface WeatherIconProps extends React.HTMLProps<HTMLDivElement> {
  iconName: string;
}

const WeatherIcon = ({ iconName, className, ...rest }: WeatherIconProps) => {
  return (
    <div {...rest} className={cn("relative w-20 h-20", className)}>
      <Image
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
        alt="weather-icon"
        width={100}
        height={100}
        className="absolute w-full h-full"
      />
    </div>
  );
};

export default WeatherIcon;
