// MyRides.jsx
import React, { useEffect, useState } from "react";
import { useLazyFetchMyRidesQuery } from "../store/slices/api";
import './MyRides.css'; // import a CSS file for styling

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [fetchRides, { isLoading }] = useLazyFetchMyRidesQuery();

  useEffect(() => {
    fetchRides()
      .then((res) => {
        if (res.data){
            setRides(res.data);
            console.log("Res data is ",res.data)
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="myrides-container">
      <h2>My Rides</h2>
      {isLoading ? (
        <p>Loading your rides...</p>
      ) : rides?.length > 0 ? (
        rides.map((ride) => (
          <div key={ride._id} className="ride-card">
            <div className="ride-info">
              <p><strong>From:</strong> {ride.origin?.name}</p>
              <p><strong>To:</strong> {ride.destination?.name}</p>
              <p><strong>Date:</strong> {new Date(ride.dateTime).toLocaleString()}</p>
              <p><strong>Vehicle:</strong> {ride.vechile?.make || "Not specified"}</p>
              <p><strong>Plate Number:</strong> {ride.vechile?.plateNumber || "Not specified"}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No rides found</p>
      )}
    </div>
  );
};

export default MyRides;
