import React, { useState } from "react";
import { X, Check, MapPinned } from "lucide-react";
import RouteSelectorMap from "./RouteSelectorMap";
import Button from "./Button";

export default function RouteChoiceModal({ origin, destination, initialRoute = null, onConfirm, onClose }) {
  const [chosen, setChosen] = useState(initialRoute);

  const km = (m) => (m / 1000).toFixed(1);
  const min = (s) => Math.round(s / 60);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Choose your route</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-0">
          <RouteSelectorMap
            origin={origin}
            destination={destination}
            onRouteSelect={(r) => setChosen(r)}
          />
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-700">
            {chosen ? (
              <span>
                Selected: {km(chosen.distance)} km • {min(chosen.duration)} min
              </span>
            ) : (
              <span>Tap an alternative on the map to select</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => chosen && onConfirm(chosen)} disabled={!chosen} icon={Check}>
              Use this route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}