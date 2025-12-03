const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

async function getWeather(city) {
    try {
        // Log what we are sending to check for hidden spaces
        console.log(`Fetching weather for: "${city}" with Key: ${API_KEY ? 'Present' : 'Mwissing'}`);
        
        const response = await axios.get(CURRENT_URL, { 
            params: { q: city, appid: API_KEY, units: 'metric' } 
        });
        
        return { 
            type: 'current', 
            temp: Math.round(response.data.main.temp), 
            description: response.data.weather[0].description, 
            city: response.data.name 
        };
    } catch (error) {
        // real error 
        if (error.response) {
            console.error("OpenWeatherMap Error:", error.response.data);
            console.error("Status Code:", error.response.status);
        } else {
            console.error("Network/Code Error:", error.message);
        }
        return null; 
    }
}

async function getForecast(city) {
    try {
        const response = await axios.get(FORECAST_URL, { 
            params: { q: city, appid: API_KEY, units: 'metric' } 
        });
        const data = response.data.list[8]; 
        return { 
            type: 'forecast', 
            temp: Math.round(data.main.temp), 
            description: data.weather[0].description, 
            rainChance: Math.round(data.pop * 100), 
            city: response.data.city.name 
        };
    } catch (error) {
        console.error("Forecast Error:", error.message);
        return null; 
    }
}
module.exports = { getWeather, getForecast };