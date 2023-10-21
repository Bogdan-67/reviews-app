import { configureStore } from '@reduxjs/toolkit';
import profile from './slices/profileSlice';
import usersReducer from './slices/userSlice';
import requestReducer from './slices/requstSlice';

export const store = configureStore({
  reducer: {
    profile,
    usersReducer,
    requestReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
