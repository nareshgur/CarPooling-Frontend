// Utility to check if a location is too general (like a district or large area)
export const isLocationTooGeneral = (location) => {


  console.log("The location details received to the too General Method is ",location)
  if (!location || !location.address) return true;

  const address = location.address.toLowerCase();
  
  // Check for general area indicators
  const generalIndicators = [
    'district',
    'county',
    'state',
    'province',
    'region',
    'area',
    'zone',
    'borough',
    'municipality',
    'township'
  ];

  // Check if address contains general area terms
  const hasGeneralTerms = generalIndicators.some(term => 
    address.includes(term)
  );

  // Check if the address is very short (might be just a city name)
  const addressParts = location.address.split(',').map(part => part.trim());
  const hasSpecificDetails = addressParts.length >= 3; // Should have street, city, state/country

  // Check if coordinates are at city center (common for general locations)
  const isAtCityCenter = checkIfAtCityCenter(location.coordinates);

  return hasGeneralTerms || !hasSpecificDetails || isAtCityCenter;
};

// Check if coordinates are at a city center (approximate)
const checkIfAtCityCenter = (coordinates) => {
  if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
    return false;
  }
  
  // This is a simplified check - in a real app, you might want to use
  // a more sophisticated algorithm or API to determine if coordinates
  // are at a city center vs a specific address
  
  // For now, we'll assume that if the coordinates are very round numbers
  // (like 40.0000, -74.0000), they might be approximate city centers
  const lat = Math.abs(coordinates.lat);
  const lng = Math.abs(coordinates.lng);
  
  // Check if coordinates are very round (likely approximate)
  const latRounded = Math.round(lat * 10000) / 10000;
  const lngRounded = Math.round(lng * 10000) / 10000;
  
  return lat === latRounded && lng === lngRounded;
};

// Get location precision level
export const getLocationPrecision = (location) => {
  if (!location || !location.address) return 'unknown';

  const address = location.address.toLowerCase();
  
  if (address.includes('street') || address.includes('avenue') || 
      address.includes('road') || address.includes('drive') ||
      address.includes('lane') || address.includes('way')) {
    return 'street';
  }
  
  if (address.includes('neighborhood') || address.includes('area')) {
    return 'neighborhood';
  }
  
  if (address.includes('district') || address.includes('county')) {
    return 'district';
  }
  
  if (address.includes('city') || address.includes('town')) {
    return 'city';
  }
  
  return 'general';
};

// Suggest action based on location precision
export const getLocationSuggestion = (location) => {
  const precision = getLocationPrecision(location);
  
  switch (precision) {
    case 'street':
      return null; // Good enough
    case 'neighborhood':
      return 'Consider selecting a more specific location on the map for better pickup coordination.';
    case 'district':
    case 'city':
      return 'This location covers a large area. Please select an exact location on the map or use your current location.';
    default:
      return 'Please select a specific location for better ride coordination.';
  }
};
