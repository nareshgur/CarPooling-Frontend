import React from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, Users, Star, Car, Bike, DollarSign } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export default function RideCard({ ride, onBook, onView, showActions = true }) {
  const departureTime = new Date(ride.departureTime);
  const duration = ride.route ? Math.round(ride.route.duration / 60) : 0;
  
  return (
    <Card hover={!!onView} onClick={onView}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-lg">
              {ride.vehicle.type === 'car' ? (
                <Car className="h-5 w-5 text-white" />
              ) : (
                <Bike className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {ride.vehicle.make} {ride.vehicle.model}
              </h3>
              <p className="text-sm text-gray-500">{ride.vehicle.color} • {ride.vehicle.year}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-2xl font-bold text-green-600">
              <DollarSign className="h-5 w-5" />
              <span>{ride.pricePerSeat}</span>
            </div>
            <p className="text-sm text-gray-500">per seat</p>
          </div>
        </div>

        {/* Route */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-0.5 h-8 bg-gray-300"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="font-medium text-gray-900">{ride.from.name}</p>
                <p className="text-sm text-gray-500">{ride.from.address}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">{ride.to.name}</p>
                <p className="text-sm text-gray-500">{ride.to.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Info */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <div>
              <p className="font-medium">{format(departureTime, 'HH:mm')}</p>
              <p>{format(departureTime, 'MMM d')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <div>
              <p className="font-medium">{ride.availableSeats} seats</p>
              <p>available</p>
            </div>
          </div>
          
          {duration > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <div>
                <p className="font-medium">{duration}h</p>
                <p>duration</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <div>
              <p className="font-medium">{ride.driver.rating}</p>
              <p>{ride.driver.totalTrips} trips</p>
            </div>
          </div>
        </div>

        {/* Driver */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
              <span className="text-white text-sm font-medium">
                {ride.driver.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{ride.driver.name}</p>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-500">
                  {ride.driver.verificationStatus === 'verified' ? '✓ Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {showActions && onBook && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(ride);
                }}
              >
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(ride);
                }}
                disabled={ride.availableSeats === 0}
              >
                {ride.availableSeats === 0 ? 'Full' : 'Book'}
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        {ride.description && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 italic">{ride.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
}