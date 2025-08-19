import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Mock base query for demo purposes
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("x-auth-token",token);
    }
    return headers;
  },
});

// Mock data for demo
const mockRides = [
  {
    id: "1",
    driverId: "user1",
    driver: {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      rating: 4.8,
      totalTrips: 45,
      verificationStatus: "verified",
    },
    vehicleId: "vehicle1",
    vehicle: {
      id: "vehicle1",
      type: "car",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      color: "Blue",
      licensePlate: "ABC123",
      features: ["AC", "Bluetooth", "USB Charging"],
    },
    from: {
      id: "loc1",
      name: "New York",
      address: "123 Main St, New York, NY",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    to: {
      id: "loc2",
      name: "Boston",
      address: "456 Park Ave, Boston, MA",
      coordinates: { lat: 42.3601, lng: -71.0589 },
    },
    departureTime: "2024-12-20T09:00:00Z",
    arrivalTime: "2024-12-20T13:00:00Z",
    availableSeats: 3,
    pricePerSeat: 25,
    description: "Comfortable ride with good music!",
    status: "active",
    bookings: [],
    createdAt: "2024-12-19T10:00:00Z",
    route: {
      distance: 350,
      duration: 240,
    },
  },
  {
    id: "2",
    driverId: "user2",
    driver: {
      id: "user2",
      name: "Sarah Chen",
      email: "sarah@example.com",
      phone: "+1234567891",
      rating: 4.9,
      totalTrips: 28,
      verificationStatus: "verified",
    },
    vehicleId: "vehicle2",
    vehicle: {
      id: "vehicle2",
      type: "bike",
      make: "Yamaha",
      model: "MT-07",
      year: 2021,
      color: "Black",
      licensePlate: "XYZ789",
      features: ["Helmet Provided", "Storage Box"],
    },
    from: {
      id: "loc3",
      name: "San Francisco",
      address: "789 Mission St, San Francisco, CA",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    to: {
      id: "loc4",
      name: "Los Angeles",
      address: "321 Sunset Blvd, Los Angeles, CA",
      coordinates: { lat: 34.0522, lng: -118.2437 },
    },
    departureTime: "2024-12-21T08:00:00Z",
    arrivalTime: "2024-12-21T14:30:00Z",
    availableSeats: 1,
    pricePerSeat: 40,
    description: "Scenic coastal route, experienced rider",
    status: "active",
    bookings: [],
    createdAt: "2024-12-19T11:00:00Z",
    route: {
      distance: 560,
      duration: 390,
    },
  },
];

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Ride", "Booking", "User", "Vehicle", "Chat", "Notification"],
  endpoints: (builder) => ({
    // Rides endpoints
    getRides: builder.query({
      query: (filters) => {
        console.log("searching for rides:", filters);
        return {
          url: "/Ride/search", // ✅ removed space
          method: "GET",
          params: filters,
        };
      },
      transformResponse: (response) => {
        console.log("API Response:", response);
        // Ensure we always return an array
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.data)) {
          return response.data;
        } else if (response && response.rides && Array.isArray(response.rides)) {
          return response.rides;
        } else {
          console.warn("Unexpected response format:", response);
          // Return mock data as fallback for demo purposes
          return mockRides;
        }
      },
      providesTags: ["Ride"],
    }),

    getRideById: builder.query({
      query: (id) => `/rides/${id}`,
      providesTags: (result, error, id) => [{ type: "Ride", id }],
    }),

    createRide: builder.mutation({
      query: (rideData) => {
        console.log("The Publish Ride Data before hitting backend ",rideData); // ✅ Moved inside function body
        return {
          url: "/Ride/Ride",
          method: "POST",
          body: rideData,
        };
      },
      invalidatesTags: ["Ride"],
    }),

    updateRide: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/rides/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Ride", id }],
    }),

    deleteRide: builder.mutation({
      query: (id) => ({
        url: `/rides/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ride"],
    }),

  // Bookings endpoints
createBooking: builder.mutation({
  query: (bookingData) => {
    // const token = localStorage.getItem("token"); // or however you store JWT
    console.log("The booking Data is ",bookingData)
    return {
      url: "/booking",
      method: "POST",
      body: bookingData,
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}`, // pass JWT
      },
    };
  },
  invalidatesTags: ["Booking", "Ride"],
}),


    getUserBookings: builder.query({
      query: (userId) => `/users/${userId}/bookings`,
      providesTags: ["Booking"],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Booking", "Ride"],
    }),

    // Users endpoints
    getUserProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    updateUserProfile: builder.mutation({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Vehicles endpoints
    getUserVehicles: builder.query({
      query: (userId) => `/users/${userId}/vehicles`,
      providesTags: ["Vehicle"],
    }),

    addVehicle: builder.mutation({
      query: (vehicleData) => ({
        url: "/vehicles",
        method: "POST",
        body: vehicleData,
      }),
      invalidatesTags: ["Vehicle"],
    }),

    // Chat endpoints
    getChatByRide: builder.query({
      query: (rideId) => ({
        url: `/chats/ride/${rideId}`,
      }),
      providesTags: ["Chat"],
    }),

    sendMessage: builder.mutation({
      query: ({ chatId, content, messageType = 'text' }) => ({
        url: `/chats/message`,
        method: "POST",
        body: { content, messageType },
      }),
      invalidatesTags: ["Chat"],
    }),
    
    sendLogMessage: builder.mutation({
      query: ({ rideId,senderId,receiverId,initiatedAt,timeStamp }) => ({
        url: `/chats/initiate`,
        method: "POST",
        body: { rideId,senderId,receiverId,initiatedAt,timeStamp},
      }),
      invalidatesTags: ["Chat"],
    }),

    getMyChats: builder.query({
      query: () => ({
        url: '/chats/my',
      }),
      providesTags: ["Chat"],
    }),

    markMessagesAsRead: builder.mutation({
      query: (chatId) => ({
        url: `/chats/${chatId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Chat"],
    }),

    // Notification endpoints
    getMyNotifications: builder.query({
      query: (params) => ({
        url: '/notification/my',
        params,
      }),
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notification/read-all',
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useLazyGetRidesQuery,
  useGetRideByIdQuery,
  useCreateRideMutation,
  useUpdateRideMutation,
  useDeleteRideMutation,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserVehiclesQuery,
  useAddVehicleMutation,
  useGetChatByRideQuery,
  useSendMessageMutation,
  useGetMyChatsQuery,
  useMarkMessagesAsReadMutation,
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useSendLogMessageMutation
} = api;
