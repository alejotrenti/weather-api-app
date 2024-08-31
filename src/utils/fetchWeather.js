import { API_KEY, BASE_URL } from '../config';

export const fetchWeatherByCoords = (lat, lon, setWeather) => {
  fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=sp&units=metric`)
    .then(response => response.json())
    .then(data => setWeather(data))
    .catch(error => console.error('Error fetching data:', error));
};
