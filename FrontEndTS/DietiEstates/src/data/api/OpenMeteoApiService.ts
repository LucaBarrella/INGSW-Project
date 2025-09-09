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
        0: 'sunny', // Clear
        1: 'cloud', // Mostly Clear
        2: 'cloud', // Partly Cloudy
        3: 'cloud', // Overcast
        45: 'blur-on', // Fog
        48: 'ac_unit', // Icy Fog
        51: 'water-drop', // L. Drizzle
        53: 'umbrella', // Drizzle
        55: 'umbrella', // H. Drizzle
        56: 'ac_unit', // L. Icy Drizzle
        57: 'ac_unit', // Icy Drizzle
        61: 'water-drop', // L. Rain
        63: 'umbrella', // Rain
        65: 'umbrella', // H. Rain
        66: 'ac_unit', // L. Icy Rain
        67: 'ac_unit', // Icy Rain
        71: 'ac_unit', // L. Snow
        73: 'ac_unit', // Snow
        75: 'ac_unit', // H. Snow
        77: 'ac_unit', // Snow Grains
        80: 'water-drop', // L. Showers
        81: 'umbrella', // Showers
        82: 'umbrella', // H. Showers
        85: 'ac_unit', // L. Snow Showers
        86: 'ac_unit', // Snow Showers
        95: 'thunderstorm', // Thunder Storm
        96: 'thunderstorm', // T-Storm + L. Hail
        99: 'thunderstorm', // T-Storm + Hail
    };
    return iconMapping[code] || 'help'; // Default icon for unknown codes
}