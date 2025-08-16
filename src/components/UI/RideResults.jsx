// components/RideResults.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const RideResults = () => {
  const location = useLocation();
  const { rides, metadata } = location.state || { rides: [], metadata: {} };
  const [sortBy, setSortBy] = useState('relevance');

  const sortedRides = [...rides].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevanceScore - a.relevanceScore;
      case 'price':
        return a.pricePerSeat - b.pricePerSeat;
      case 'time':
        return new Date(a.dateTime) - new Date(b.dateTime);
      default:
        return b.relevanceScore - a.relevanceScore;
    }
  });

  return (
    <div className="ride-results">
      <div className="results-header">
        <h2>Found {rides.length} rides</h2>
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="relevance">Best Match</option>
            <option value="price">Price (Low to High)</option>
            <option value="time">Departure Time</option>
          </select>
        </div>
      </div>
      
      <div className="rides-list">
        {sortedRides.map((ride) => (
          <div key={ride._id} className="ride-card">
            <div className="ride-header">
              <div className="route-info">
                <div className="origin">{ride.origin.name}</div>
                <div className="arrow">→</div>
                <div className="destination">{ride.destination.name}</div>
              </div>
              <div className="relevance-score">
                Match: {Math.round(ride.relevanceScore)}%
              </div>
            </div>
            
            <div className="ride-details">
              <div className="time-price">
                <div className="time">
                  {new Date(ride.dateTime).toLocaleString()}
                </div>
                <div className="price">₹{ride.pricePerSeat}</div>
              </div>
              
              <div className="driver-info">
                <div className="driver-name">{ride.driverId?.name}</div>
                <div className="driver-rating">⭐ {ride.driverId?.rating || 'N/A'}</div>
              </div>
              
              <div className="seats">
                {ride.availableSeats} seats available
              </div>
            </div>
            
            {ride.stops && ride.stops.length > 0 && (
              <div className="stops-info">
                <small>Via: {ride.stops.map(stop => stop.name).join(', ')}</small>
              </div>
            )}
            
            <button className="book-button">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideResults;