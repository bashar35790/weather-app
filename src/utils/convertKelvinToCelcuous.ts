export function kelvinToCelsius(kelvin: number): number {
    return parseFloat((kelvin - 273.15).toFixed(2)); // returns value with 2 decimal places
  }