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
  useLazyGetRidesQuery, // <-- lazy query
} from "../store/slices/api";
import RideCard from "../components/UI/RideCard";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";

export default function Search() {
  const [filters, setFilters] = useState({
    vehicleType: "all",
    sortBy: "departure",
    maxPrice: undefined,
  });

  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const [showFilters, setShowFilters] = useState(false);

  const [triggerSearch, { data: rides = [], isFetching, error }] =
    useLazyGetRidesQuery();

  const handleSearch = (e) => {
    e.preventDefault();
    // Send all search form & filter data to backend
    triggerSearch({
      ...searchForm,
      ...filters,
    });
  };

  const handleBookRide = (ride) => {
    console.log("Booking ride:", ride);
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
              <Input
                label="From"
                placeholder="Departure city"
                icon={MapPin}
                value={searchForm.from}
                onChange={(e) =>
                  setSearchForm((prev) => ({ ...prev, from: e.target.value }))
                }
                fullWidth
              />

              <Input
                label="To"
                placeholder="Destination city"
                icon={MapPin}
                value={searchForm.to}
                onChange={(e) =>
                  setSearchForm((prev) => ({ ...prev, to: e.target.value }))
                }
                fullWidth
              />

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
                Failed to load rides. Please try again.
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
                  key={ride.id}
                  ride={ride}
                  onBook={handleBookRide}
                  onView={handleViewRide}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
