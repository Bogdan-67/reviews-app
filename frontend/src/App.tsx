import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './scss/app.scss';
import Header from './components/Header/Header';
import Login from './pages/Login';
import Registr from './pages/Registr';
import React, { useEffect, useState } from 'react';
import { RootState } from './redux/store';
import { SelectProfile, checkAuth } from './redux/slices/profileSlice';
import { useSelector } from 'react-redux';
import NotFound from './pages/NotFound/NotFound';

import { useAppDispatch, useAppSelector } from './hooks/redux';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';
import TableRequests from './pages/Requests/TableRequests';
import CreateRequest from './pages/Requests/CreateRequest';
import CreatePoll from './pages/Poll/CreatePoll';
import CompletePoll from './pages/Poll/CompletePoll';
import { message } from 'antd';
import { Status } from './models/Status.enum';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  const location = useLocation();
  const { error, status } = useAppSelector(SelectProfile);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  // if (status === Status.LOADING) return <>Loading...</>;

  return (
    <>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <RequireNotAuth redirectTo="/">
              <Login />
            </RequireNotAuth>
          }
        ></Route>
        <Route
          path="/registration"
          element={
            <RequireNotAuth redirectTo="/">
              <Registr />
            </RequireNotAuth>
          }
        ></Route>
        <Route
          path="/"
          element={
            <RequireAuth redirectTo="/login">
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route path="" element={<Profile />}></Route>
          <Route path="requests" element={<></>}>
            <Route path="" element={<TableRequests />}></Route>
            <Route path="create" element={<CreateRequest />}></Route>
          </Route>
          <Route path="poll" element={<></>}>
            <Route path="create" element={<CreatePoll />}></Route>
            <Route path="complete/:id" element={<CompletePoll />}></Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </>
  );
}

function RequireAuth({ children, redirectTo }) {
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  console.log('isAuth', isAuth);
  return isAuth ? children : <Navigate to={redirectTo} />;
}

function RequireNotAuth({ children, redirectTo }) {
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  console.log('isAuth', isAuth);
  return !isAuth ? children : <Navigate to={redirectTo} />;
}

function RequireEditor({ children, redirectTo }) {
  const role = localStorage.getItem('role');
  console.log('role', role);
  if (role !== 'EDITOR' && role !== 'ADMIN') alert('Нет прав доступа!');
  return role === 'EDITOR' || role === 'ADMIN' ? (
    children
  ) : (
    <Navigate to={redirectTo} />
  );
}

function RequireAdmin({ children, redirectTo }) {
  const role = localStorage.getItem('role');
  console.log('role', role);
  if (role !== 'ADMIN') alert('Нет прав доступа!');
  return role === 'ADMIN' ? children : <Navigate to={redirectTo} />;
}

export default App;
