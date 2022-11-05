const OPEN_WEATHER_API_KEY = '6ffcaf07ed4d75360aedc7e7f437d965'

export interface IOpenWeatherData {
  name: string
  main: {
    feels_like: number
    humidity: number
    pressure: number
    temp: number
    temp_max: number
    temp_min: number
  }
  weather: {
    description: string
    icon: string
    id: number
    main: string
  }[]
  wind: {
    deg: number
    speed: number
  }
}

export type TempScale = 'metric' | 'imperial'

export async function fetchOpenWeatherData(
  city: string,
  tempScale: string
): Promise<IOpenWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempScale}&lang=zh_tw&appid=${OPEN_WEATHER_API_KEY}`
  )

  if (!res.ok) {
    throw new Error('City not found')
  }

  const data: IOpenWeatherData = await res.json()

  return data
}

export const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
