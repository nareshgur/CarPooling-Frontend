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
} from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import { useCreateRideMutation } from "../store/slices/api";
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
    departureDate: "",
    departureTime: "",
    availableSeats: 3,
    pricePerSeat: 0,
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create coordinates arrays immutably
      const originCoords = [
        form.from.coordinates.lng,
        form.from.coordinates.lat,
      ];

      const destinationCoords = [
        form.to.coordinates.lng,
        form.to.coordinates.lat,
      ];

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
        dateTime: new Date(
          `${form.departureDate}T${form.departureTime}`
        ).toISOString(),
        availableSeats: form.availableSeats,
        pricePerSeat: form.pricePerSeat,
        description: form.description || undefined,
        vechileInfo: {
          make: "Toyota",
          model: "Corolla",
          plateNumber: "ABC124",
          VechileType: form.vechileType,
        },
      };

      await createRide(rideData).unwrap();
      navigate("/rides/my-rides", {
        state: { message: "Ride published successfully!" },
      });
    } catch (error) {
      console.error("Failed to create ride:", error);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return form.vehicleType && form.from.name && form.to.name;
      case 2:
        return form.departureDate && form.departureTime;
      case 3:
        return form.availableSeats > 0 && form.pricePerSeat > 0;
      case 4:
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
            Share your journey and help others travel smart
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-8">
          <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>
            Route
          </span>
          <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>
            Time
          </span>
          <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>
            Details
          </span>
          <span className={step >= 4 ? "text-blue-600 font-medium" : ""}>
            Review
          </span>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Route & Vehicle */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="h-6 w-6" />
                  <span>Route & Vehicle</span>
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
                        setForm((prev) => ({ ...prev, vehicleType: "car" }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all ${
                        form.vehicleType === "car"
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
                        setForm((prev) => ({ ...prev, vehicleType: "bike" }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all ${
                        form.vehicleType === "bike"
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

                {/* Route */}
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="From (Departure City)"
                      placeholder="e.g., New York"
                      icon={MapPin}
                      value={form.from.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          from: {
                            ...prev.from,
                            name: e.target.value,
                            address: `${e.target.value}, USA`, // Mock address
                            coordinates: { lat: 40.7128, lng: -74.006 }, // Mock coordinates
                          },
                        }))
                      }
                      fullWidth
                      required
                    />

                    <Input
                      label="To (Destination City)"
                      placeholder="e.g., Boston"
                      icon={MapPin}
                      value={form.to.name}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          to: {
                            ...prev.to,
                            name: e.target.value,
                            address: `${e.target.value}, USA`, // Mock address
                            coordinates: { lat: 42.3601, lng: -71.0589 }, // Mock coordinates
                          },
                        }))
                      }
                      fullWidth
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="h-6 w-6" />
                  <span>When are you leaving?</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
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
              </div>
            )}

            {/* Step 3: Seats & Price */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Users className="h-6 w-6" />
                  <span>Seats & Pricing</span>
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
                              form.vehicleType === "bike" ? 1 : 8,
                              prev.availableSeats + 1
                            ),
                          }))
                        }
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        disabled={
                          form.availableSeats >=
                          (form.vehicleType === "bike" ? 1 : 8)
                        }
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {form.vehicleType === "bike"
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

            {/* Step 4: Description & Review */}
            {step === 4 && (
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
                        {form.vehicleType === "car" ? (
                          <Car className="h-4 w-4" />
                        ) : (
                          <Bike className="h-4 w-4" />
                        )}
                        <span className="capitalize">{form.vehicleType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span>
                        {form.from.name} → {form.to.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span>
                        {form.departureDate} at {form.departureTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Available Seats:</span>
                      <span>{form.availableSeats}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price per Seat:</span>
                      <span className="text-green-600 font-semibold">
                        ${form.pricePerSeat}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                      <span>Total Potential Earnings:</span>
                      <span className="text-green-600">
                        ${form.pricePerSeat * form.availableSeats}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div>
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
              </div>

              <div>
                {step < 4 ? (
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
                    icon={Plus}
                    loading={isLoading}
                    disabled={!isStepValid(step)}
                  >
                    Publish Ride
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
