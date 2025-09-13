// src/services/bookingApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/booking",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token; // adjust path to where your token is stored
      if (token) {
        headers.set("x-auth-token", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    approveBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/${bookingId}/approve`,
        method: "PUT",
        body: {}, // empty body, since backend only needs bookingId in URL
      }),
    }),
    rejectBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/${bookingId}/reject`,
        method: "PUT",
        body: {},
      }),
    }),
  }),
});

export const {
  useApproveBookingMutation,
  useRejectBookingMutation,
} = bookingApi;
