import { fetchWeatherApi } from 'openmeteo';

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function getNextSevenDaysMeteo(latitude: number, longitude: number, start_date: Date){
    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "minutely_15": "weather_code",
	    "timezone": "auto",
        "start_date": start_date.toISOString().split("T")[0],
        "end_date": (addDays(start_date, 7)).toISOString().split("T")[0],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    );

    const minutely_15 = response.minutely_15()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        minutely_15: {
            time: [...Array((Number(minutely_15.timeEnd()) - Number(minutely_15.time())) / minutely_15.interval())].map(
                (_, i) => new Date((Number(minutely_15.time()) + i * minutely_15.interval() + utcOffsetSeconds) * 1000)
            ),
            weather_code: minutely_15.variables(0)!.valuesArray(),
        },
    };

    // 'weatherData' now contains a simple structure with arrays with datetime and weather data
    console.log("\nMinutely15 data", weatherData.minutely_15)
}