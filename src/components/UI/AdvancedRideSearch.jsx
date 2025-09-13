// components/AdvancedRideSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedRideSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    timeWindow: 2,
    routeDeviation: 10,
    enRouteMatching: true,
    sortBy: 'relevance'
  });
  
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const response = await fetch(`/api/Ride/search?${params}`);
      const data = await response.json();
      
      // Handle the enhanced response
      if (data.rides) {
        // Navigate to results page with data
        navigate('/search-results', { 
          state: { 
            rides: data.rides, 
            metadata: data.metadata 
          } 
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="advanced-search-container">
      <div className="search-form">
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            value={searchParams.from}
            onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
            placeholder="Enter departure location"
          />
        </div>
        
        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            value={searchParams.to}
            onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
            placeholder="Enter destination"
          />
        </div>
        
        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
        </div>
        
        <div className="advanced-options">
          <div className="form-group">
            <label>Time Window (±hours)</label>
            <select 
              value={searchParams.timeWindow}
              onChange={(e) => setSearchParams({...searchParams, timeWindow: parseInt(e.target.value)})}
            >
              <option value={1}>±1 hour</option>
              <option value={2}>±2 hours</option>
              <option value={4}>±4 hours</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={searchParams.enRouteMatching}
                onChange={(e) => setSearchParams({...searchParams, enRouteMatching: e.target.checked})}
              />
              Enable en-route matching
            </label>
          </div>
        </div>
        
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? 'Searching...' : 'Search Rides'}
        </button>
      </div>
    </div>
  );
};

export default AdvancedRideSearch;