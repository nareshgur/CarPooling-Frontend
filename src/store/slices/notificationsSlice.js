// src/slices/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const exists = state.list.find(n => n._id === action.payload._id);
      if (!exists) {
        state.list.unshift(action.payload); // newest first
      }
    },
    markAsRead: (state, action) => {
      const notification = state.list.find(n => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.list.forEach(n => {
        n.isRead = true;
      });
    },
    deleteNotification: (state, action) => {
      state.list = state.list.filter(n => n._id !== action.payload);
    },
    setNotifications: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
