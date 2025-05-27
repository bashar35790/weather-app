
  export default function getDayOrNightIcon(iconName: string, dateTimeString:string): string {

    const currentHour =  new Date(dateTimeString).getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    return isDay ? iconName.replace(/.$/,"d") : iconName.replace(/.$/,"n");
    
  }