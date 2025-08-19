import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Car,
  Bike,
  Plus,
  FileText,
  X,
  Route,
} from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import { useCreateRideMutation } from "../store/slices/api";
import LocationAutocomplete from "../components/UI/LocationAutocomplete";
import MapSelector from "../components/UI/MapSelector";
import { isLocationTooGeneral, getLocationSuggestion } from "../utils/locationValidator";

export default function Publish() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [createRide, { isLoading }] = useCreateRideMutation();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    vechileType: "car",
    from: {
      name: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    to: {
      name: "",
      address: "",
      coordinates: { lat: 0, lng: 0 },
    },
    stops: [], // Add stops array
    departureDate: "",
    departureTime: "",
    availableSeats: 3,
    pricePerSeat: 0,
    description: "",
    vehicleInfo: {
      make: "",
      model: "",
      plateNumber: "",
      year: "",
      color: "",
    },
  });

const [showMapSelector, setShowMapSelector] = useState(false);
const [mapSelectorFor, setMapSelectorFor] = useState(null); // 'from', 'to', or 'stop-{index}'
const [locationWarnings, setLocationWarnings] = useState({ from: null, to: null });
const [stopLocationWarnings, setStopLocationWarnings] = useState({});
const [showRouteModal, setShowRouteModal] = useState(false);
const [selectedRoute, setSelectedRoute] = useState(null);

  // Handle location selection
  const handleLocationSelect = (field, location) => {
    if (!location) {
      setForm(prev => ({
        ...prev,
        [field]: {
          name: "",
          address: "",
          coordinates: { lat: 0, lng: 0 },
        }
      }));
      setLocationWarnings(prev => ({ ...prev, [field]: null }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [field]: {
        name: location.name,
        address: location.address,
        coordinates: location.coordinates,
      }
    }));

    // Check if location is too general
    if (isLocationTooGeneral(location)) {
      const suggestion = getLocationSuggestion(location);
      setLocationWarnings(prev => ({ ...prev, [field]: suggestion }));
    } else {
      setLocationWarnings(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle stop location selection
  const handleStopLocationSelect = (stopIndex, location) => {
    if (!location) {
      setForm(prev => ({
        ...prev,
        stops: prev.stops.map((stop, idx) => 
          idx === stopIndex 
            ? { name: "", address: "", coordinates: { lat: 0, lng: 0 } }
            : stop
        )
      }));
      setStopLocationWarnings(prev => ({ ...prev, [stopIndex]: null }));
      return;
    }

    setForm(prev => ({
      ...prev,
      stops: prev.stops.map((stop, idx) => 
        idx === stopIndex 
          ? {
              name: location.name,
              address: location.address,
              coordinates: location.coordinates,
            }
          : stop
      )
    }));

    // Check if location is too general
    if (isLocationTooGeneral(location)) {
      const suggestion = getLocationSuggestion(location);
      setStopLocationWarnings(prev => ({ ...prev, [stopIndex]: suggestion }));
    } else {
      setStopLocationWarnings(prev => ({ ...prev, [stopIndex]: null }));
    }
  };

  // Add a new stop
  const addStop = () => {
    setForm(prev => ({
      ...prev,
      stops: [...prev.stops, {
        name: "",
        address: "",
        coordinates: { lat: 0, lng: 0 },
      }]
    }));
  };

  // Remove a stop
  const removeStop = (index) => {
    setForm(prev => ({
      ...prev,
      stops: prev.stops.filter((_, idx) => idx !== index)
    }));
    // Clear warnings for removed stop
    setStopLocationWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[index];
      return newWarnings;
    });
  };

  // Handle map selection
  const handleMapSelection = (location) => {
    if (mapSelectorFor) {
      if (mapSelectorFor.startsWith('stop-')) {
        const stopIndex = parseInt(mapSelectorFor.split('-')[1]);
        handleStopLocationSelect(stopIndex, location);
      } else {
        handleLocationSelect(mapSelectorFor, location);
      }
    }
    setShowMapSelector(false);
    setMapSelectorFor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate that we have coordinates
      if (!form.from.coordinates.lat || !form.from.coordinates.lng) {
        alert("Please select a valid departure location with coordinates.");
        return;
      }

      if (!form.to.coordinates.lat || !form.to.coordinates.lng) {
        alert("Please select a valid destination location with coordinates.");
        return;
      }

      // Validate stops if any
      const validStops = form.stops.filter(stop => 
        stop.name && stop.coordinates.lat && stop.coordinates.lng
      );

      // Create coordinates arrays immutably
      const originCoords = [
        form.from.coordinates.lng,
        form.from.coordinates.lat,
      ];

      const destinationCoords = [
        form.to.coordinates.lng,
        form.to.coordinates.lat,
      ];

      // Format stops for backend
      const formattedStops = validStops.map((stop, index) => ({
        name: stop.name,
        location: {
          type: "Point",
          coordinates: [stop.coordinates.lng, stop.coordinates.lat],
        },
        routeIndex: index + 1, // Position in the route
      }));

      const rideData = {
        origin: {
          name: form.from.name,
          location: {
            type: "Point",
            coordinates: originCoords,
          },
        },
        destination: {
          name: form.to.name,
          location: {
            type: "Point",
            coordinates: destinationCoords,
          },
        },
        stops: formattedStops, // Add stops to ride data
        dateTime: new Date(
          `${form.departureDate}T${form.departureTime}`
        ).toISOString(),
        availableSeats: form.availableSeats,
        pricePerSeat: form.pricePerSeat,
        description: form.description || undefined,
        vechileInfo: {
          make: form.vehicleInfo.make,
          model: form.vehicleInfo.model,
          plateNumber: form.vehicleInfo.plateNumber,
          year: form.vehicleInfo.year,
          color: form.vehicleInfo.color,
          VechileType: form.vechileType,
        },
      };

      console.log("Submitting ride data:", rideData);
      await createRide(rideData).unwrap();
      navigate("/rides/my-rides", {
        state: { message: "Ride published successfully!" },
      });
    } catch (error) {
      console.error("Failed to create ride:", error);
      
      // Handle specific error types
      if (error.status === 400 && error.data?.message) {
        alert(`Error: ${error.data.message}`);
      } else if (error.status === 409) {
        alert("Error: A vehicle with this license plate number already exists. Please use a different plate number.");
      } else if (error.status === 401) {
        alert("Error: Please log in to publish a ride.");
      } else if (error.status === 422) {
        alert("Error: Please check your input and try again.");
      } else {
        alert("Failed to create ride. Please try again.");
      }
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return form.vechileType && form.from.name && form.to.name;
      case 2:
        return form.vehicleInfo.make && 
               form.vehicleInfo.model && 
               form.vehicleInfo.plateNumber && 
               form.vehicleInfo.year && 
               form.vehicleInfo.color;
      case 3:
        return form.departureDate && form.departureTime;
      case 4:
        return form.availableSeats > 0 && form.pricePerSeat > 0;
      case 5:
        return true; // Description is optional
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Publish Your Ride
          </h1>
          <p className="text-xl text-gray-600">
            Share your journey and earn money while helping others travel
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center space-x-2 ${
                stepNumber <= step
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {stepNumber === 1 && "Route"}
                {stepNumber === 2 && "Vehicle"}
                {stepNumber === 3 && "Schedule"}
                {stepNumber === 4 && "Pricing"}
                {stepNumber === 5 && "Details"}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Route */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-6 w-6" />
                  <span>Route Details</span>
                </h2>

                {/* Vehicle Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose your vehicle type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, vechileType: "car" }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all ${
                        form.vechileType === "car"
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Car className="h-8 w-8 mx-auto mb-3" />
                      <div className="text-center">
                        <h3 className="font-semibold">Car</h3>
                        <p className="text-sm text-gray-500">
                          Comfortable and spacious
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, vechileType: "bike" }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all ${
                        form.vechileType === "bike"
                          ? "border-green-600 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Bike className="h-8 w-8 mx-auto mb-3" />
                      <div className="text-center">
                        <h3 className="font-semibold">Motorcycle</h3>
                        <p className="text-sm text-gray-500">
                          Fast and adventurous
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Route with Location Autocomplete */}
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <LocationAutocomplete
                        label="From (Departure Location)"
                        placeholder="e.g., 123 Main St, New York"
                        value={form.from.name}
                        onChange={(e) => {
                          setForm(prev => ({
                            ...prev,
                            from: { ...prev.from, name: e.target.value }
                          }));
                        }}
                        onLocationSelect={(location) => handleLocationSelect('from', location)}
                        required
                        showCurrentLocation={true}
                      />
                      
                      {locationWarnings.from && (
                        <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-yellow-800">{locationWarnings.from}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setMapSelectorFor('from');
                                setShowMapSelector(true);
                              }}
                              className="mt-1 text-sm text-yellow-800 underline hover:text-yellow-900"
                            >
                              Select exact location on map
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <LocationAutocomplete
                        label="To (Destination Location)"
                        placeholder="e.g., 456 Oak Ave, Boston"
                        value={form.to.name}
                        onChange={(e) => {
                          setForm(prev => ({
                            ...prev,
                            to: { ...prev.to, name: e.target.value }
                          }));
                        }}
                        onLocationSelect={(location) => handleLocationSelect('to', location)}
                        required
                        showCurrentLocation={true}
                      />
                      
                      {locationWarnings.to && (
                        <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-yellow-800">{locationWarnings.to}</p>
                            <button
                              type="button"
                              onClick={() => {
                                setMapSelectorFor('to');
                                setShowMapSelector(true);
                              }}
                              className="mt-1 text-sm text-yellow-800 underline hover:text-yellow-900"
                            >
                              Select exact location on map
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stops Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        <Route className="inline h-4 w-4 mr-2" />
                        Stops (Optional)
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addStop}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Stop</span>
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      Add intermediate stops where passengers can be picked up or dropped off
                    </p>

                    {form.stops.length > 0 && (
                      <div className="space-y-3">
                        {form.stops.map((stop, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Stop {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeStop(index)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <LocationAutocomplete
                                placeholder={`e.g., Stop ${index + 1} location`}
                                value={stop.name}
                                onChange={(e) => {
                                  setForm(prev => ({
                                    ...prev,
                                    stops: prev.stops.map((s, idx) => 
                                      idx === index 
                                        ? { ...s, name: e.target.value }
                                        : s
                                    )
                                  }));
                                }}
                                onLocationSelect={(location) => handleStopLocationSelect(index, location)}
                                showCurrentLocation={false}
                              />
                              
                              {stopLocationWarnings[index] && (
                                <div className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                  <div className="flex-shrink-0">
                                    <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-yellow-800">{stopLocationWarnings[index]}</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setMapSelectorFor(`stop-${index}`);
                                        setShowMapSelector(true);
                                      }}
                                      className="mt-1 text-yellow-800 underline hover:text-yellow-900"
                                    >
                                      Select exact location on map
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {form.stops.length === 0 && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <Route className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm">No stops added yet</p>
                        <p className="text-xs">Click "Add Stop" to include intermediate locations</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Car className="h-6 w-6" />
                  <span>Vehicle Information</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Vehicle Make"
                    placeholder="e.g., Toyota, Honda, Yamaha"
                    value={form.vehicleInfo.make}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicleInfo: {
                          ...prev.vehicleInfo,
                          make: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    required
                  />

                  <Input
                    label="Vehicle Model"
                    placeholder="e.g., Camry, Civic, R15"
                    value={form.vehicleInfo.model}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicleInfo: {
                          ...prev.vehicleInfo,
                          model: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    required
                  />

                  <Input
                    label="License Plate Number"
                    placeholder="e.g., ABC123"
                    value={form.vehicleInfo.plateNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicleInfo: {
                          ...prev.vehicleInfo,
                          plateNumber: e.target.value.toUpperCase(),
                        },
                      }))
                    }
                    fullWidth
                    required
                  />

                  <Input
                    label="Vehicle Year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="e.g., 2022"
                    value={form.vehicleInfo.year}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicleInfo: {
                          ...prev.vehicleInfo,
                          year: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    required
                  />

                  <Input
                    label="Vehicle Color"
                    placeholder="e.g., Blue, Red, Black"
                    value={form.vehicleInfo.color}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicleInfo: {
                          ...prev.vehicleInfo,
                          color: e.target.value,
                        },
                      }))
                    }
                    fullWidth
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Vehicle Information Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure your license plate number is correct and unique</li>
                    <li>• Provide accurate vehicle details for passenger safety</li>
                    <li>• This information helps passengers identify your vehicle</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <span>Schedule</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Departure Date"
                    type="date"
                    icon={Calendar}
                    value={form.departureDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        departureDate: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    fullWidth
                    required
                  />

                  <Input
                    label="Departure Time"
                    type="time"
                    icon={Clock}
                    value={form.departureTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        departureTime: e.target.value,
                      }))
                    }
                    fullWidth
                    required
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    Schedule Tips
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Choose a date at least 24 hours in advance</li>
                    <li>• Consider traffic patterns for departure time</li>
                    <li>• Be flexible with pickup times for better bookings</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Pricing</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Seats
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            availableSeats: Math.max(
                              1,
                              prev.availableSeats - 1
                            ),
                          }))
                        }
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        disabled={form.availableSeats <= 1}
                      >
                        -
                      </button>
                      <span className="text-2xl font-semibold w-12 text-center">
                        {form.availableSeats}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            availableSeats: Math.min(
                              form.vechileType === "bike" ? 1 : 8,
                              prev.availableSeats + 1
                            ),
                          }))
                        }
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        disabled={
                          form.availableSeats >=
                          (form.vechileType === "bike" ? 1 : 8)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {form.vechileType === "bike"
                        ? "Maximum 1 passenger for motorcycles"
                        : "Maximum 8 passengers"}
                    </p>
                  </div>

                  <Input
                    label="Price per Seat ($)"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    icon={DollarSign}
                    value={form.pricePerSeat || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pricePerSeat: parseFloat(e.target.value) || 0,
                      }))
                    }
                    fullWidth
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Pricing Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Consider fuel costs, tolls, and wear & tear</li>
                    <li>• Check similar rides for competitive pricing</li>
                    <li>• Factor in distance and duration</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 5: Description & Review */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="h-6 w-6" />
                  <span>Additional Details</span>
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ride Description (Optional)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell passengers about your ride, any stops, music preferences, etc."
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.description.length}/300 characters
                  </p>
                </div>

                {/* Review */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Review Your Ride
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <div className="flex items-center space-x-2">
                        {form.vechileType === "car" ? (
                          <Car className="h-4 w-4" />
                        ) : (
                          <Bike className="h-4 w-4" />
                        )}
                        <span className="capitalize">{form.vechileType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vehicle Details:</span>
                      <span className="text-gray-900">
                        {form.vehicleInfo.make} {form.vehicleInfo.model} ({form.vehicleInfo.plateNumber})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="text-gray-900">
                        {form.from.name} → {form.to.name}
                      </span>
                    </div>

                    {form.stops.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Stops:</span>
                        <span className="text-gray-900">
                          {form.stops.map(stop => stop.name).join(' → ')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="text-gray-900">
                        {form.departureDate} at {form.departureTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Seats & Price:</span>
                      <span className="text-gray-900">
                        {form.availableSeats} seats at ${form.pricePerSeat} each
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>

              {step < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(step)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !isStepValid(step)}
                  className="min-w-[120px]"
                >
                  {isLoading ? "Publishing..." : "Publish Ride"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Map Selector Modal */}
      {showMapSelector && (
        <MapSelector
          initialLocation={mapSelectorFor ? 
            (mapSelectorFor.startsWith('stop-') ? 
              form.stops[parseInt(mapSelectorFor.split('-')[1])] : 
              form[mapSelectorFor]
            ) : null
          }
          onLocationSelect={handleMapSelection}
          onClose={() => {
            setShowMapSelector(false);
            setMapSelectorFor(null);
          }}
          title={`Select Exact ${
            mapSelectorFor === 'from' ? 'Departure' : 
            mapSelectorFor === 'to' ? 'Destination' : 
            mapSelectorFor.startsWith('stop-') ? `Stop ${parseInt(mapSelectorFor.split('-')[1]) + 1}` : 
            'Location'
          }`}
        />
      )}
    </div>
  );
}
