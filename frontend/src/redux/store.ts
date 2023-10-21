import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import profile from './slices/profileSlice';
import usersReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    profile,
    usersReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
