// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { combineReducers } from 'redux';
// import authReducer from './authSlice';
// import uiReducer from './uiSlice';
// import { api } from './api';
// import { authApi } from './authApi';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'], // Only persist auth state
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   ui: uiReducer,
//   [api.reducerPath]: api.reducer,
//   [authApi.reducerPath]: authApi.reducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }).concat(api.middleware, authApi.middleware),
// });

// export const persistor = persistStore(store);