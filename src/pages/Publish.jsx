import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, DollarSign, Car, Bike, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useSelector } from "react-redux";
import Button from "../components/UI/Button";
import RouteSelectorMap from "../components/UI/RouteSelectorMap"; 
import { useCreateRideMutation } from "../store/slices/api";

const Publish = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const user = useSelector((state) => state.auth.user);
  const [publishRide] = useCreateRideMutation();

  // ✅ Step 1: Route
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  // ✅ Step 2: Vehicle
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [availableSeats, setAvailableSeats] = useState(1);

  // ✅ Step 3: Ride details
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = async () => {
    try {
      const payload = {
        origin: {
          name: origin?.name,
          coordinates: [origin?.lng, origin?.lat],
        },
        destination: {
          name: destination?.name,
          coordinates: [destination?.lng, destination?.lat],
        },
        vechileInfo: {
          VechileType: vehicleType,
          make: vehicleMake,
          model: vehicleModel,
          plateNumber: vehicleNumber,
        },
        // 👇 flatten ride details
        dateTime: date,   // combine date + time if needed
        availableSeats: passengers,
        pricePerSeat: price,
        passengers: passengers,
      };
  
      const res = await publishRide(payload).unwrap();
      console.log("Ride published:", res);
      navigate("/rides");
    } catch (error) {
      console.error("Error publishing ride:", error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center">Publish a Ride</h2>

      {/* Stepper */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${
              step === s ? "bg-blue-600" : "bg-gray-400"
            }`}
          >
            {step > s ? <Check size={18} /> : s}
          </div>
        ))}
      </div>

      {/* Step 1: Route */}
      {step === 1 && (
        <div>
          <h3 className="font-semibold mb-3">Step 1: Select Route</h3>
          <RouteSelectorMap
            onRouteSelect={({ origin, destination }) => {
              setOrigin(origin);
              setDestination(destination);
            }}
          />
          <div className="flex justify-end mt-4">
            <Button onClick={() => setStep(2)}>
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle */}
      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-3">Step 2: Vehicle Details</h3>
          <div className="space-y-3">
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
            <input
              type="text"
              placeholder="Vehicle Make (eg:TATA"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Vehicle Model (eg:PUNCH)"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              min="1"
              max="6"
              placeholder="Available Seats"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)}>
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Ride details */}
      {step === 3 && (
        <div>
          <h3 className="font-semibold mb-3">Step 3: Ride Details</h3>
          <div className="space-y-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Passengers Allowed"
              min="1"
              max={availableSeats}
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button onClick={handleSubmit}>Publish Ride</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publish;
