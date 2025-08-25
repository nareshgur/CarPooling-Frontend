import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3000";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const RouteSelectorMap = ({ onRouteSelect }) => {
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Backend proxy for geocoding
  const geocode = async (place) => {
    const res = await fetch(
      `${API_BASE}/api/directions/geocode?query=${encodeURIComponent(place)}`
    );
    if (!res.ok) {
      throw new Error(`Geocode failed for "${place}" (${res.status})`);
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  };

  const fetchRoutes = async () => {
    setErrMsg("");
    setLoading(true);
    setRoutes([]);
    setSelectedIndex(null);

    try {
      if (!originText.trim() || !destinationText.trim()) {
        setErrMsg("Please enter both origin and destination.");
        return;
      }

      const originCoords = await geocode(originText.trim());
      const destCoords = await geocode(destinationText.trim());

      if (!originCoords || !destCoords) {
        setErrMsg("Could not find coordinates for one of the locations.");
        return;
      }

      setOrigin(originCoords);
      setDestination(destCoords);

      const res = await fetch(`${API_BASE}/api/directions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinates: [
            [originCoords.lng, originCoords.lat],
            [destCoords.lng, destCoords.lat],
          ],
          alternatives: true,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Backend directions failed (${res.status}): ${text}`);
      }

      const data = await res.json();
      if (!data?.routes?.length) {
        console.warn("Directions response without routes:", data);
        setErrMsg("No routes found for this pair. Try different locations.");
        return;
      }

      const decodedRoutes = data.routes.map((r) => {
        const coords = polyline.decode(r.geometry);
        return coords.map(([lat, lng]) => [lat, lng]);
      });

      setRoutes(decodedRoutes);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setErrMsg(err.message || "Failed to fetch routes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={originText}
          placeholder="Origin city"
          onChange={(e) => setOriginText(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="text"
          value={destinationText}
          placeholder="Destination city"
          onChange={(e) => setDestinationText(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={fetchRoutes}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? "Finding..." : "Find Routes"}
        </button>
      </div>

      {errMsg && <div className="text-sm text-red-600 mb-2">{errMsg}</div>}

      <MapContainer
        center={origin || { lat: 20, lng: 78 }}
        zoom={origin ? 8 : 5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {origin && (
          <Marker position={origin}>
            <Popup>Origin: {originText || "Selected"}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination}>
            <Popup>Destination: {destinationText || "Selected"}</Popup>
          </Marker>
        )}

        {routes.map((coords, idx) => (
          <Polyline
            key={idx}
            positions={coords}
            color={selectedIndex === idx ? "blue" : "gray"}
            weight={selectedIndex === idx ? 6 : 4}
            opacity={selectedIndex === idx ? 0.9 : 0.5}
            eventHandlers={{
              click: () => {
                setSelectedIndex(idx);
                if (onRouteSelect) {
                  onRouteSelect({
                    origin: { name: originText, ...origin },
                    destination: { name: destinationText, ...destination },
                    routeGeometry: coords,
                  });
                }
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteSelectorMap;
