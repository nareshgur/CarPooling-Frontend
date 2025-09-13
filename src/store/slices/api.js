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
          url: "/Ride/search", 
          method: "GET",
          params: filters,
        };
      },
      // transformResponse: (response) => {
      //   console.log("API Response:", response);
      //   // Ensure we always return an array
      //   if (Array.isArray(response)) {
      //     return response;
      //   } else if (response && Array.isArray(response.data)) {
      //     return response.data;
      //   } else if (response && response.rides && Array.isArray(response.rides)) {
      //     return response.rides;
      //   } else {
      //     console.warn("Unexpected response format:", response);
      //     // Return mock data as fallback for demo purposes
      //     return mockRides;
      //   }
      // },
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
  query: () => `/booking/my`,
  providesTags: ["Booking"],
}),


    fetchMyRides:builder.query({
      query:()=>'ride/my',
      method:'GET',
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
  useLazyFetchMyRidesQuery,
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
