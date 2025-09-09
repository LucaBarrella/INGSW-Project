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
    const emojiMapping: { [key: number]: string } = {
        0: '☀️', // Clear
        1: '🌤️', // Mostly Clear
        2: '⛅', // Partly Cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️❄️', // Icy Fog
        51: '🌧️', // L. Drizzle
        53: '🌧️', // Drizzle
        55: '🌧️', // H. Drizzle
        56: '🌧️❄️', // L. Icy Drizzle
        57: '🌧️❄️', // Icy Drizzle
        61: '🌧️', // L. Rain
        63: '🌧️', // Rain
        65: '🌧️', // H. Rain
        66: '🌧️❄️', // L. Icy Rain
        67: '🌧️❄️', // Icy Rain
        71: '🌨️', // L. Snow
        73: '🌨️', // Snow
        75: '🌨️', // H. Snow
        77: '🌨️', // Snow Grains
        80: '🌧️', // L. Showers
        81: '🌧️', // Showers
        82: '🌧️', // H. Showers
        85: '🌨️', // L. Snow Showers
        86: '🌨️', // Snow Showers
        95: '⛈️', // Thunder Storm
        96: '⛈️🌧️', // T-Storm + L. Hail
        99: '⛈️🌧️', // T-Storm + Hail
    };
    return emojiMapping[code] || '❓';
}