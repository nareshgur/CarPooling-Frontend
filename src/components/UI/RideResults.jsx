// components/RideResults.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Route } from 'lucide-react';

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

  const renderRouteWithStops = (ride) => {
    const locations = [ride.origin.name];
    
    if (ride.stops && ride.stops.length > 0) {
      // Sort stops by routeIndex if available, otherwise by array order
      const sortedStops = ride.stops.sort((a, b) => 
        (a.routeIndex || 0) - (b.routeIndex || 0)
      );
      locations.push(...sortedStops.map(stop => stop.name));
    }
    
    locations.push(ride.destination.name);
    
    return (
      <div className="route-info">
        {locations.map((location, index) => (
          <React.Fragment key={index}>
            <div className="location">
              {index === 0 ? 'From' : index === locations.length - 1 ? 'To' : `Stop ${index}`}
              <span className="location-name">{location}</span>
            </div>
            {index < locations.length - 1 && (
              <div className="arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

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
              {renderRouteWithStops(ride)}
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Route className="h-4 w-4" />
                  <span>Via: {ride.stops.map(stop => stop.name).join(' → ')}</span>
                </div>
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