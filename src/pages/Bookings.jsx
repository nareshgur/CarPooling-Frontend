import React from "react";
import { useGetMyBookingsQuery } from "../store/slices/api";


export default function BookingsPage() {
    const {
        data: bookings = [],
        error,
        isLoading,
    } = useGetMyBookingsQuery();

    if (isLoading) {
        return <div className="p-6 text-gray-600">Loading your bookings...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Failed to load bookings. Please try again later.
            </div>
        );
    }

    if (!bookings.length) {
        return (
            <div className="p-6 text-gray-500">
                You don’t have any bookings yet.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="border rounded-lg p-4 shadow-sm bg-white"
                    >
                        <p className="font-medium text-gray-800">
                            Ride from {booking.pickup} → {booking.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                            Date: {new Date(booking.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            Status:{" "}
                            <span
                                className={`font-semibold ${booking.status === "confirmed"
                                        ? "text-green-600"
                                        : booking.status === "pending"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                            >
                                {booking.status}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
