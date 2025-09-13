import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import { Loader2 } from "lucide-react";
import {toast} from 'react-toastify'

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:3000";

// Fix Leaflet icons
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

  // Geocode helper
  const geocode = async (place) => {
    const res = await fetch(
      `${API_BASE}/api/directions/geocode?query=${encodeURIComponent(place)}`
    );
    if (!res.ok) throw new Error(`Geocode failed for "${place}" (${res.status})`);
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
        const msg = "Please enter both origin and destination."
        setErrMsg(msg);
        toast.error(msg)
        return;
      }

      const originCoords = await geocode(originText.trim());
      const destCoords = await geocode(destinationText.trim());

      if (!originCoords || !destCoords) {
        const msg = "Could not find coordinates for one of the locations."
        setErrMsg(msg);
        toast.error(msg)
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
          preference: "fastest",
        }),
      });

      // const result = await res.json()
      console.log("The routes that we fetched fromt the backend is",res)

      if (!res.ok) {
        let useMsg = "Something went wrong while fetching directions"

        if(res.status===404) useMsg = "No route could be found. Please try different locations."

        if(res.status===500) useMsg = "Server error. Please try again later."
        const text = await res.text().catch(() => "");
        // const msg = `Something went wrong !... `;
        toast.error(useMsg)
        throw new Error(`(${res.status}): ${text}`);
      }

      const data = await res.json();
      if (!data?.routes?.length) {
        const msg = "No routes found. Try different locations."
        setErrMsg(msg);
        toast.warning(msg)
        return;
      }

      const decodedRoutes = data.routes.map((r) => {
        const coords = polyline.decode(r.geometry);
        return {
          coords: coords.map(([lat, lng]) => [lat, lng]),
          summary: r.summary,
          distance: (r.summary.distance / 1000).toFixed(1), // km
          duration: Math.round(r.summary.duration / 60), // mins
        };
      });
      
      console.log("The decoded routes are",decodedRoutes)
      setRoutes(decodedRoutes);
    } catch (err) {
      const msg = err.message || "Failed to fetch routes."
      setErrMsg(msg);
      // toast.error(msg)
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setOrigin(null);
    setDestination(null);
    setRoutes([]);
    setOriginText("");
    setDestinationText("");
    setSelectedIndex(null);
    setErrMsg("");
  };

  return (
    <div className="space-y-4">
      {/* Input Controls */}
      <div className="flex gap-2">
        <input
          type="text"
          value={originText}
          placeholder="Origin city"
          onChange={(e) => setOriginText(e.target.value)}
          className="border p-2 rounded-lg w-1/2 shadow-sm"
        />
        <input
          type="text"
          value={destinationText}
          placeholder="Destination city"
          onChange={(e) => setDestinationText(e.target.value)}
          className="border p-2 rounded-lg w-1/2 shadow-sm"
        />
        <button
          onClick={fetchRoutes}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-60 flex items-center"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Finding..." : "Find"}
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-2 bg-gray-300 text-black rounded-lg shadow hover:bg-gray-400"
        >
          Clear
        </button>
      </div>

      {/* {errMsg && <div className="text-sm text-red-600">{errMsg}</div>} */}

      {/* Map */}
      <MapContainer
        center={origin || { lat: 20, lng: 78 }}
        zoom={origin ? 9 : 5}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-md"
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

        {routes.map((route, idx) => (
          <Polyline
            key={idx}
            positions={route.coords}
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
                    routeGeometry: route.coords,
                  });
                }
              },
            }}
          />
        ))}
      </MapContainer>

      {/* Route Details List */}
      {routes.length > 0 && (
        <div className="space-y-2">
          {routes.map((r, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg shadow cursor-pointer transition ${
                selectedIndex === idx
                  ? "bg-blue-100 border border-blue-400"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setSelectedIndex(idx)}
            >
              <p className="font-semibold">Route {idx + 1}</p>
              <p className="text-sm text-gray-600">
                {r.distance} km · {r.duration} mins
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteSelectorMap;
