import { fetchWeatherByCoords } from './fetchWeather';

export const fetchLocation = (setCity, setWeather) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude, setWeather);
    }, error => {
      console.error('Error obteniendo la ubicación:', error);
      setCity('Buenos Aires'); // Ciudad predeterminada si no se puede obtener la ubicación
    });
  } else {
    console.error('Geolocalización no soportada');
    setCity('Buenos Aires'); // Ciudad predeterminada si geolocalización no está disponible
  }
};