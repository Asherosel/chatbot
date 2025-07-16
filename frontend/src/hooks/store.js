import { configureStore } from '@reduxjs/toolkit';
import { localApi } from '../api/api';

export const store = configureStore({
  reducer: {
    [localApi.reducerPath]: localApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localApi.middleware),
});
