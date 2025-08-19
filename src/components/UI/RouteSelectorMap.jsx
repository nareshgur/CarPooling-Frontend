import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

export default function RouteSelectorMap({ origin, destination, onRouteSelect }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) return;

    const map = L.map(mapRef.current).setView([origin.lat, origin.lng], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const control = L.Routing.control({
      waypoints: [L.latLng(origin.lat, origin.lng), L.latLng(destination.lat, destination.lng)],
      router: new L.Routing.OSRMv1({ serviceUrl: "https://router.project-osrm.org/route/v1" }),
      showAlternatives: true,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      altLineOptions: {
        styles: [
          { color: "black", opacity: 0.15, weight: 9 },
          { color: "white", opacity: 0.8, weight: 6 },
          { color: "blue", opacity: 0.7, weight: 3 },
        ],
      },
    }).addTo(map);

    control.on("routeselected", (e) => {
      const { coordinates, summary } = e.route;
      onRouteSelect?.({
        polyline: coordinates, // array of {lat, lng}
        distance: summary.totalDistance, // meters
        duration: summary.totalTime, // seconds
      });
    });

    return () => map.remove();
  }, [origin, destination, onRouteSelect]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
}