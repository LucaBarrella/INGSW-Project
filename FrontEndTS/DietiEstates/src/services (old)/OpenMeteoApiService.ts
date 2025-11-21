import { fetchWeatherApi } from 'openmeteo';

export async function getMeteoForTheDay(latitude: number, longitude: number, date: Date){
    const params = {
        "latitude": latitude,
        "longitude": longitude,
        "minutely_15": "weather_code",
	    "timezone": "auto",
        "start_date": date.toISOString().split("T")[0],
        "end_date": date.toISOString().split("T")[0],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const minutely_15 = response.minutely15()!;
    return minutely_15.variables(0)!.valuesArray();
}

export function getTimeFromIndex(index: number){
    return `${Math.floor(index/4).toString().padStart(2, '0')}:${((index%4)*15).toString().padStart(2, '0')}`;
}



export function getEmojiFromMeteoCode(code: number) {
    const iconMapping: { [key: number]: string } = {
        0: 'meteocons:clear-day-fill', // Clear
        1: 'meteocons:partly-cloudy-day-fill', // Mostly Clear
        2: 'meteocons:partly-cloudy-day-fill', // Partly Cloudy
        3: 'meteocons:overcast-day-fill', // Overcast
        45: 'meteocons:fog-day-fill', // Fog
        48: 'meteocons:fog-day-fill', // Icy Fog
        51: 'meteocons:partly-cloudy-day-drizzle-fill', // L. Drizzle
        53: 'meteocons:overcast-day-drizzle-fill', // Drizzle
        55: 'meteocons:extreme-day-drizzle-fill', // H. Drizzle
        56: 'meteocons:partly-cloudy-day-hail-fill', // L. Icy Drizzle
        57: 'meteocons:overcast-day-hail-fill', // Icy Drizzle
        61: 'meteocons:partly-cloudy-day-rain-fill', // L. Rain
        63: 'meteocons:overcast-day-rain-fill', // Rain
        65: 'meteocons:extreme-day-rain-fill', // H. Rain
        66: 'meteocons:partly-cloudy-day-hail-fill', // L. Icy Rain
        67: 'meteocons:overcast-day-hail-fill', // Icy Rain
        71: 'meteocons:partly-cloudy-day-snow-fill', // L. Snow
        73: 'meteocons:overcast-day-snow-fill', // Snow
        75: 'meteocons:extreme-day-snow-fill', // H. Snow
        77: 'meteocons:partly-cloudy-day-snow-fill', // Snow Grains
        80: 'meteocons:partly-cloudy-day-rain-fill', // L. Showers
        81: 'meteocons:overcast-day-rain-fill', // Showers
        82: 'meteocons:extreme-day-rain-fill', // H. Showers
        85: 'meteocons:overcast-day-snow-fill', // L. Snow Showers
        86: 'meteocons:extreme-day-snow-fill', // Snow Showers
        95: 'meteocons:thunderstorms-day-extreme-fill', // Thunder Storm
        96: 'meteocons:thunderstorms-day-extreme-snow-fill', // T-Storm + L. Hail
        99: 'meteocons:thunderstorms-day-extreme-snow-fill', // T-Storm + Hail
    };
    return iconMapping[code] || 'material-symbols:help'; // Default icon for unknown codes
}