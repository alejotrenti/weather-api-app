import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Crear un icono personalizado
const customIcon = new L.Icon({
  iconUrl: '/loc.svg', // Reemplaza con la ruta de tu icono
  iconSize: [35, 51], // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje del icono
  popupAnchor: [1, -34], // Punto donde se ancla el popup
  shadowSize: [41, 41], // Tamaño de la sombra
});

const MapComponent = ({ lat, lon, cityName }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 10); // Cambia la vista del mapa a la nueva ubicación
    }
  }, [lat, lon]);

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={10}
      style={{ height: '235px', width: '100%' }}
      whenCreated={(map) => { mapRef.current = map; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lon]} icon={customIcon}>
        <Popup>
          {cityName} <br /> Coordenadas: [{lat}, {lon}]
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
