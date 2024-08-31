export const handleCopyCoordinates = (weather) => {
    if (weather?.coord) {
      const coordinates = `Lat: ${weather.coord.lat}, Lon: ${weather.coord.lon}`;
      navigator.clipboard.writeText(coordinates)
        .then(() => alert('Coordenadas copiadas al portapapeles'))
        .catch(() => alert('Error al copiar las coordenadas'));
    }
  };