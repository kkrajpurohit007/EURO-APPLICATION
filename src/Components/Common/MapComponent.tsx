import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  latitude: number;
  longitude: number;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
  draggable?: boolean;
  height?: string;
  zoom?: number;
}

// Component to update map center when lat/lng changes
const MapUpdater: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const map = useMap();
  
  useEffect(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);
  
  return null;
};

// Component to update marker position when lat/lng changes
const MarkerUpdater: React.FC<{ 
  latitude: number; 
  longitude: number; 
  markerRef: React.RefObject<L.Marker | null>;
}> = ({ latitude, longitude, markerRef }) => {
  useEffect(() => {
    if (markerRef.current && latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude, markerRef]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  onMarkerDragEnd,
  draggable = true,
  height = "400px",
  zoom = 13,
}) => {
  const markerRef = useRef<L.Marker>(null);

  // Default to a valid location if coordinates are invalid
  const validLat = latitude && !isNaN(latitude) ? latitude : 40.7128; // Default: New York
  const validLng = longitude && !isNaN(longitude) ? longitude : -74.006; // Default: New York

  const handleDragEnd = () => {
    if (markerRef.current && onMarkerDragEnd) {
      const position = markerRef.current.getLatLng();
      onMarkerDragEnd(position.lat, position.lng);
    }
  };

  return (
    <div style={{ height, width: "100%", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={[validLat, validLng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater latitude={validLat} longitude={validLng} />
        <Marker
          position={[validLat, validLng]}
          draggable={draggable}
          ref={markerRef}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        />
        <MarkerUpdater latitude={validLat} longitude={validLng} markerRef={markerRef} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;

