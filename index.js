const APP_ID = 'cf26e7b2c25b5acd18ed5c3e836fb235';
const DEFAULT_VALUE = '--';
const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');


const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windSpeed = document.querySelector('.wind-speed');


searchInput.addEventListener('change', (e) => {
    const location = e.target.value.trim();

    // Bước 1: Gọi Geocoding API
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APP_ID}`)
        .then(res => res.json())
        .then(geoData => {
            if (!geoData || geoData.length === 0) {
                alert('Không tìm thấy vị trí. Vui lòng nhập lại.');
                return;
            }

            const { lat, lon, name, state, country } = geoData[0];

            // Gọi API weather hiện tại
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric&lang=vi`)
                .then(res => res.json())
                .then(data => {
                    cityName.innerHTML = `${name}, ${state || ''}`;
                    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
                    weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

                    sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
                    sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
                    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE;
                    windSpeed.innerHTML = (data.wind.speed * 3.6).toFixed(2) || DEFAULT_VALUE;
                });

            // Gọi API dự báo
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric&lang=vi`)
                .then(res => res.json())
                .then(data => {
                    const forecastList = data.list;
                    const dailyData = {};

                    forecastList.forEach(item => {
                        const date = item.dt_txt.split(' ')[0];
                        const hour = item.dt_txt.split(' ')[1];
                        if (hour === '12:00:00') {
                            dailyData[date] = item;
                        }
                    });

                    const forecastContainer = document.querySelector('.forecast-list');
                    forecastContainer.innerHTML = ''; // clear old

                    Object.keys(dailyData).forEach(date => {
                        const item = dailyData[date];
                        const card = document.createElement('div');
                        card.className = 'forecast-card';
                        const day = moment(date).format('dddd');
                        card.innerHTML = `
                            <div>${day}</div>
                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather">
                            <div>${Math.round(item.main.temp)}°C</div>
                            <div>${item.weather[0].description}</div>
                        `;
                        forecastContainer.appendChild(card);
                    });
                });
        });
});