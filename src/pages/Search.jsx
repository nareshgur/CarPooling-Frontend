import React, { useState } from "react";
import {
  Search as SearchIcon,
  MapPin,
  Calendar,
  Users,
  Car,
  Bike,
  SlidersHorizontal,
} from "lucide-react";
import {
  useLazyGetRidesQuery,
} from "../store/slices/api";
import RideCard from "../components/UI/RideCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import LocationAutocomplete from "../components/UI/LocationAutocomplete";
import MapSelector from "../components/UI/MapSelector";
import { isLocationTooGeneral, getLocationSuggestion } from "../utils/locationValidator";
import { useCreateBookingMutation } from "../store/slices/api"

export default function Search() {
  const [filters, setFilters] = useState({
    vehicleType: "all",
    sortBy: "departure",
    maxPrice: undefined,
  });

  const [createBooking, {isLoading}] = useCreateBookingMutation();
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [mapSelectorFor, setMapSelectorFor] = useState(null);
  const [locationWarnings, setLocationWarnings] = useState({ from: null, to: null });
  const [selectedLocations, setSelectedLocations] = useState({ from: null, to: null });

  const [triggerSearch, { data: ridesData, isFetching, error }] =
    useLazyGetRidesQuery();

  // Ensure rides is always an array
  const rides = Array.isArray(ridesData) ? ridesData : [];

  // Handle location selection
  const handleLocationSelect = (field, location) => {
    if (!location) {
      setSearchForm(prev => ({ ...prev, [field]: "" }));
      setSelectedLocations(prev => ({ ...prev, [field]: null }));
      setLocationWarnings(prev => ({ ...prev, [field]: null }));
      return;
    }

    setSearchForm(prev => ({ ...prev, [field]: location.name }));
    setSelectedLocations(prev => ({ ...prev, [field]: location }));

    // Check if location is too general
    if (isLocationTooGeneral(location)) {
      const suggestion = getLocationSuggestion(location);
      setLocationWarnings(prev => ({ ...prev, [field]: suggestion }));
    } else {
      setLocationWarnings(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle map selection
  const handleMapSelection = (location) => {
    if (mapSelectorFor) {
      handleLocationSelect(mapSelectorFor, location);
    }
    setShowMapSelector(false);
    setMapSelectorFor(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validate search form
    if (!searchForm.from && !searchForm.to) {
      alert("Please enter at least origin or destination");
      return;
    }
    
    // Prepare search data with coordinates
    const searchData = {
      ...searchForm,
      ...filters,
    };

    // Add coordinates if available
    if (selectedLocations.from && selectedLocations.from.coordinates) {
      searchData.lat = selectedLocations.from.coordinates.lat;
      searchData.lng = selectedLocations.from.coordinates.lng;
      searchData.maxDistance = 50000; // 50km radius
    }

    if (selectedLocations.to && selectedLocations.to.coordinates) {
      searchData.destLat = selectedLocations.to.coordinates.lat;
      searchData.destLng = selectedLocations.to.coordinates.lng;
      searchData.destMaxDistance = 50000; // 50km radius
    }

    console.log("Searching with data:", searchData);
    
    // Send all search form & filter data to backend
    console.log("Triggering search with:", searchData);
    triggerSearch(searchData);
    
    // Debug: Log the response data
    console.log("Current rides data:", ridesData);
    console.log("Is ridesData an array?", Array.isArray(ridesData));
  };

  const handleBookRide = (ride) => {
    console.log("Booking ride:", ride); 
    createBooking({rideId:ride.rideId,message:ride.message
    })
  };

  const handleViewRide = (ride) => {
    console.log("Viewing ride:", ride);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Find Your Perfect Ride
          </h1>
          <p className="text-xl text-gray-600">
            Search for car and bike rides that match your journey
          </p>
        </div>

        {/* Search Form */}
        <Card className="sticky top-20 z-40">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <LocationAutocomplete
                  label="From"
                  placeholder="Departure location"
                  value={searchForm.from}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, from: e.target.value }))}
                  onLocationSelect={(location) => handleLocationSelect('from', location)}
                  showCurrentLocation={true}
                />
                
                {locationWarnings.from && (
                  <div className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-yellow-800">{locationWarnings.from}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setMapSelectorFor('from');
                          setShowMapSelector(true);
                        }}
                        className="text-xs text-yellow-800 underline hover:text-yellow-900"
                      >
                        Select exact location
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <LocationAutocomplete
                  label="To"
                  placeholder="Destination location"
                  value={searchForm.to}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, to: e.target.value }))}
                  onLocationSelect={(location) => handleLocationSelect('to', location)}
                  showCurrentLocation={true}
                />
                
                {locationWarnings.to && (
                  <div className="flex items-start space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-yellow-800">{locationWarnings.to}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setMapSelectorFor('to');
                          setShowMapSelector(true);
                        }}
                        className="text-xs text-yellow-800 underline hover:text-yellow-900"
                      >
                        Select exact location
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Date"
                type="date"
                icon={Calendar}
                value={searchForm.date}
                onChange={(e) =>
                  setSearchForm((prev) => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
                fullWidth
              />

              <Input
                label="Passengers"
                type="number"
                min="1"
                max="8"
                icon={Users}
                value={searchForm.passengers}
                onChange={(e) =>
                  setSearchForm((prev) => ({
                    ...prev,
                    passengers: parseInt(e.target.value),
                  }))
                }
                fullWidth
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                icon={SearchIcon}
                size="lg"
                className="flex-1"
              >
                Search Rides
              </Button>

              <Button
                type="button"
                variant="outline"
                icon={SlidersHorizontal}
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto"
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="bg-gray-50" padding="md">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Advanced Filters
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type
                      </label>
                      <select
                        value={filters.vehicleType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            vehicleType: e.target.value,
                          }))
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="all">All Vehicles</option>
                        <option value="car">Cars Only</option>
                        <option value="bike">Bikes Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Price per Seat
                      </label>
                      <input
                        type="number"
                        placeholder="Any price"
                        value={filters.maxPrice || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          }))
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                          }))
                        }
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="departure">Departure Time</option>
                        <option value="price">Price (Low to High)</option>
                        <option value="duration">Duration</option>
                        <option value="rating">Driver Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </form>
        </Card>

        {/* Vehicle Type Tabs */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, vehicleType: "all" }))
            }
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              filters.vehicleType === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span>All Rides</span>
          </button>

          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, vehicleType: "car" }))
            }
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              filters.vehicleType === "car"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Car className="h-4 w-4" />
            <span>Cars</span>
          </button>

          <button
            onClick={() =>
              setFilters((prev) => ({ ...prev, vehicleType: "bike" }))
            }
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              filters.vehicleType === "bike"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Bike className="h-4 w-4" />
            <span>Bikes</span>
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {rides.length} rides found
            </h2>
            {rides.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Sorted by {filters.sortBy}</span>
              </div>
            )}
          </div>

          {isFetching ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <p className="text-red-600 mb-4">
                Failed to load rides: {error?.data?.message || error?.error || 'Unknown error'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This might be because the backend server is not running or there's a connection issue.
              </p>
              <Button onClick={handleSearch}>Retry</Button>
            </Card>
          ) : rides.length === 0 ? (
            <Card className="text-center py-12">
              <div className="space-y-4">
                <SearchIcon className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No rides found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or check back later for
                    new rides.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({ sortBy: "departure", vehicleType: "all" })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              {rides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onBook={handleBookRide}
                  onView={handleViewRide}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Selector Modal */}
      {showMapSelector && (
        <MapSelector
          initialLocation={mapSelectorFor ? selectedLocations[mapSelectorFor] : null}
          onLocationSelect={handleMapSelection}
          onClose={() => {
            setShowMapSelector(false);
            setMapSelectorFor(null);
          }}
          title={`Select Exact ${mapSelectorFor === 'from' ? 'Departure' : 'Destination'} Location`}
        />
      )}
    </div>
  );
}