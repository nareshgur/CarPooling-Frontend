import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, X, Check } from "lucide-react";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

async function reverseGeocode(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    addressdetails: "1",
  });
  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const p = await res.json();
  return {
    name: p.name || (p.display_name ? p.display_name.split(",")[0] : `${lat}, ${lng}`),
    address: p.display_name,
    coordinates: { lat, lng },
  };
}

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapSelector = ({
  initialLocation = null,
  onLocationSelect,
  onClose,
  title = "Select Exact Location",
  className = "",
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const defaultCenter = initialLocation
      ? { lat: initialLocation.coordinates.lat, lng: initialLocation.coordinates.lng }
      : { lat: 20.5937, lng: 78.9629 }; // India center; change if needed

    const m = L.map(mapRef.current, { zoomControl: true }).setView(defaultCenter, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(m);

    const addOrMoveMarker = (lat, lng, name) => {
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const mk = L.marker([lat, lng], { draggable: true }).addTo(m);
        mk.on("dragend", async (e) => {
          const { lat: dlat, lng: dlng } = e.target.getLatLng();
          const loc = await reverseGeocode(dlat, dlng);
          if (loc) setSelectedLocation(loc);
        });
        setMarker(mk);
      }
    };

    m.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      const loc = await reverseGeocode(lat, lng);
      if (loc) {
        setSelectedLocation(loc);
        addOrMoveMarker(lat, lng, loc.name);
      }
    });

    if (initialLocation) {
      addOrMoveMarker(
        initialLocation.coordinates.lat,
        initialLocation.coordinates.lng,
        initialLocation.name
      );
    }

    setMap(m);
    setIsLoading(false);

    return () => m.remove();
  }, [initialLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        if (map) {
          map.setView([latitude, longitude], 15);
        }
        const loc = await reverseGeocode(latitude, longitude);
        if (loc) {
          setSelectedLocation(loc);
          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            const mk = L.marker([latitude, longitude], { draggable: true }).addTo(map);
            mk.on("dragend", async (e) => {
              const { lat: dlat, lng: dlng } = e.target.getLatLng();
              const l = await reverseGeocode(dlat, dlng);
              if (l) setSelectedLocation(l);
            });
            setMarker(mk);
          }
        }
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setIsLoading(false);
        alert("Could not get your current location. Check permissions.");
      }
    );
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <div ref={mapRef} className="w-full h-96" style={{ minHeight: "400px" }} />
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Use current location"
          >
            <Navigation className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {selectedLocation && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-500">
                  Lat: {selectedLocation.coordinates.lat.toFixed(6)}, Lng: {selectedLocation.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <p className="text-sm text-gray-600 mb-4">
            Click on the map to select an exact location, or use the current location button. You can also drag the marker to fine-tune the position.
          </p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Cancel
            </button>
            <button
              onClick={handleConfirmLocation}
              disabled={!selectedLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;