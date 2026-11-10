const apiKey = "01e38cb3e1f2be1b8f8b1c9bc775d45b"; // आपकी API Key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const aqiLevel = document.getElementById("aqiLevel");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    try {
        // 1. मौसम और कोऑर्डिनेट्स (Lat, Lon) लाने के लिए Weather API
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=hi`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod === 200) {
            cityName.innerText = `${data.name}, ${data.sys.country}`;
            temp.innerText = `तापमान: ${data.main.temp}°C`;
            desc.innerText = `स्थिति: ${data.weather[0].description}`;
            humidity.innerText = `नमी (Humidity): ${data.main.humidity}%`;
            windSpeed.innerText = `हवा की गति (Wind): ${data.wind.speed} m/s`;

            // शहर के Lat और Lon निकालकर AQI API कॉल करना
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            getAqiData(lat, lon);

            weatherResult.classList.remove("hidden");
        } else {
            alert("शहर का नाम गलत है! कृपया सही नाम दर्ज करें।");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

async function getAqiData(lat, lon) {
    try {
        // 2. AQI, PM2.5 और PM10 लाने के लिए Air Pollution API
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(aqiUrl);
        const data = await response.json();

        const aqi = data.list[0].main.aqi;
        const components = data.list[0].components;

        let aqiText = "";
        if (aqi === 1) aqiText = "अच्छा (Good)";
        else if (aqi === 2) aqiText = "संतोषजनक (Fair)";
        else if (aqi === 3) aqiText = "मध्यम (Moderate)";
        else if (aqi === 4) aqiText = "खराब (Poor)";
        else if (aqi === 5) aqiText = "बहुत खराब (Very Poor)";

        aqiLevel.innerText = `AQI स्तर: ${aqiText} (Level ${aqi})`;
        pm25.innerText = `PM2.5: ${components.pm2_5} µg/m³`;
        pm10.innerText = `PM10: ${components.pm10} µg/m³`;

    } catch (error) {
        console.error("Error fetching AQI data:", error);
    }
}