// agent.js
const { getWeather, getForecast } = require('./weatherService');

// Session Memory
let sessionContext = {
    lastCity: null
};

async function processUserMessage(userText) {
    const text = userText.toLowerCase();
    let city = null;
    let isTomorrow = text.includes("tomorrow");
    let isFollowUp = text.includes("how about") || text.includes("and") || text.includes("what about");

    // BETTER CITY DETECTION (GLOBAL) 
    const cityMatch = text.match(/\b(?:in|at|for|like)\s+([a-zA-Z\s]+?)(?:tomorrow|$|\?|\.|!|please)/i);
    
    if (cityMatch && cityMatch[1]) {
        city = cityMatch[1].trim();
        // Clean up 
        city = city.replace("tomorrow", "").replace("please", "").trim();
    }
    
    // Fallback: If "How about [City]?"
    else if (isFollowUp) {
        // Remove "how about", "what about", "and"
        const cleanText = text.replace("how about", "").replace("what about", "").replace("and", "").replace("?", "").trim();
        if (cleanText.length > 2) { 
             city = cleanText;
        }
    }

    // CONTEXT MEMORY 
    if (city) {
        sessionContext.lastCity = city;
    } else if (sessionContext.lastCity) {
        city = sessionContext.lastCity; // Use previous city
    } else {
        return "I didn't catch the city name. Which city do you want to check?";
    }

    // Capitalize for display
    const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

    // FETCH DATA 
    let data;
    if (isTomorrow) {
        data = await getForecast(city);
    } else {
        data = await getWeather(city);
    }

    // HANDLE ERRORS
    if (!data) {
        return `I couldn't find weather data for "${cityDisplay}". Please try saying the city name clearly, like "Weather in Mumbai".`;
    }

    // GENERATE RESPONSE 
    if (isTomorrow) {
        let advice = data.rainChance > 40 ? "You might want to carry an umbrella!" : "It should be a dry day.";
        return `Tomorrow in ${data.city}, there is a ${data.rainChance}% chance of rain. The temperature will be around ${data.temp} degrees Celsius. ${advice}`;
    } else {
        let comment = "It's a beautiful day!";
        if (data.temp > 30) comment = "It's quite hot outside.";
        if (data.temp < 10) comment = "It's pretty cold, wrap up warm!";
        if (data.description.includes("rain")) comment = "Don't forget your umbrella!";

        if (isFollowUp) {
            return `In ${data.city}, it is currently ${data.temp} degrees with ${data.description}. ${comment}`;
        } else {
            return `Let me check... The weather in ${data.city} is ${data.temp} degrees Celsius and ${data.description}. ${comment}`;
        }
    }
}

module.exports = { processUserMessage };