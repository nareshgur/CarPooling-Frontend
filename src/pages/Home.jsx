import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Car, Bike, Users, Shield, Clock, MapPin } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function Home() {
  const features = [
    {
      icon: Car,
      title: 'Car Pooling',
      description: 'Share rides in comfortable cars with verified drivers and passengers.',
    },
    {
      icon: Bike,
      title: 'Bike Pooling',
      description: 'Experience the thrill of motorcycle rides while saving money.',
    },
    {
      icon: Shield,
      title: 'Verified Users',
      description: 'All users are verified for your safety and peace of mind.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about your ride status and changes.',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Happy Users' },
    { number: '50K+', label: 'Daily Rides' },
    { number: '100+', label: 'Cities' },
    { number: '4.8★', label: 'Average Rating' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Share Rides,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  Save Money
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect with fellow travelers for car and bike rides. Split costs, reduce emissions, 
                and make new friends on your journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <Link to="/search" className="w-full sm:w-auto">
                <Button icon={Search} size="xl" fullWidth className="sm:w-auto">
                  Find a Ride
                </Button>
              </Link>
              <Link to="/publish" className="w-full sm:w-auto">
                <Button icon={Plus} variant="secondary" size="xl" fullWidth className="sm:w-auto">
                  Publish a Ride
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Car className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-medium">Cars</span>
              </div>
              <div className="text-3xl text-gray-300">&</div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Bike className="h-8 w-8 text-green-600" />
                <span className="text-lg font-medium">Bikes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Why Choose RideShare?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide safe, affordable, and convenient ride sharing for both cars and motorcycles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center h-full">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is simple and takes just a few minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="bg-blue-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">1. Search</h3>
              <p className="text-gray-600">
                Enter your destination and find rides that match your route and schedule.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-green-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">2. Book</h3>
              <p className="text-gray-600">
                Connect with verified drivers and passengers, then book your seat.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-orange-100 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">3. Travel</h3>
              <p className="text-gray-600">
                Enjoy your journey with great company while saving money and the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of travelers who choose RideShare for their daily commutes and long-distance trips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/search" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="xl" 
                  icon={Search}
                  fullWidth
                  className="bg-white text-blue-600 hover:bg-gray-50 border-white sm:w-auto"
                >
                  Find Rides
                </Button>
              </Link>
              <Link to="/publish" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="xl" 
                  icon={Plus}
                  fullWidth
                  className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600 sm:w-auto"
                >
                  Offer Rides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}