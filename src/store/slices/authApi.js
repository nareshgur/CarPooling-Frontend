// authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateUser } from "./authSlice"; // <-- if you want to sync local state after update

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("x-auth-token", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/user/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    getProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["Auth"],
    }),

    updateUserProfile: builder.mutation({
      query: (updates) => ({
        url: `/user/update`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Auth"], // 🔄 keep consistent with tagTypes
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // ✅ update local Redux state if needed
          dispatch(updateUser(data));
        } catch (err) {
          console.error("Update profile failed:", err);
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateUserProfileMutation,
} = authApi;
