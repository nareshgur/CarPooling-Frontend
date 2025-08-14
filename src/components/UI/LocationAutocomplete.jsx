import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, X } from "lucide-react";

// Minimal free geocoder using OpenStreetMap Nominatim
const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

async function nominatimSearch(query) {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    limit: "7",
    // accept-language can help quality; set as needed
    "accept-language": "en",
  });
  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((p) => ({
    name: p.name || (p.display_name ? p.display_name.split(",")[0] : query),
    address: p.display_name,
    coordinates: { lat: parseFloat(p.lat), lng: parseFloat(p.lon) },
    osmId: p.osm_id,
    osmType: p.osm_type,
    class: p.class,
    type: p.type,
  }));
}

async function nominatimReverse(lat, lng) {
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
    name:
      p.name ||
      (p.display_name ? p.display_name.split(",")[0] : `${lat}, ${lng}`),
    address: p.display_name,
    coordinates: { lat, lng },
    osmId: p.osm_id,
    osmType: p.osm_type,
    class: p.class,
    type: p.type,
  };
}

const LocationAutocomplete = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Search for a location...",
  label,
  required = false,
  className = "",
  showCurrentLocation = true,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Handle manual input changes with debounce
  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    onChange?.(e);

    clearTimeout(debounceRef.current);
    if (v.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setShowSuggestions(true);
      const results = await nominatimSearch(v.trim());
      setSuggestions(results);
      setIsLoading(false);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (s) => {
    setInputValue(s.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(s);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = await nominatimReverse(latitude, longitude);
        setIsLoading(false);
        if (loc) {
          setInputValue(loc.name);
          onLocationSelect(loc);
        } else {
          alert("Could not resolve your current location.");
        }
      },
      (err) => {
        console.error(err);
        setIsLoading(false);
        alert("Could not get your current location. Check permissions.");
      }
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required={required}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {showCurrentLocation && (
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              title="Use current location"
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setSuggestions([]);
                setShowSuggestions(false);
                onLocationSelect(null);
              }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-1"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((s, idx) => (
                <li key={`${s.osmId}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionSelect(s)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="font-medium text-gray-900">{s.name}</div>
                    <div className="text-sm text-gray-500">{s.address}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;