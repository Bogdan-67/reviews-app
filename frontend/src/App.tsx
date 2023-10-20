import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './scss/app.scss';
import Header from './components/Header';
import Login from './pages/Login';
import Registr from './pages/Registr';
import React, { useState } from 'react';
import { RootState, useAppDispatch } from './redux/store';
import { SelectUserRole, checkAuth } from './redux/slices/profileSlice';
import { useSelector } from 'react-redux';
import { Status } from './redux/slices/profileSlice';
import NotFound from './pages/NotFound/NotFound';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Footer from './components/Footer';

function App() {
  const dispatch = useAppDispatch();
  const status = useSelector((state: RootState) => state.profile.status);
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(0);

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  if (status === Status.LOADING) return <LoadingSpinner />;

  return (
    <>
      {isAuth && <Header />}
      <div className='container'>
        <div className='content'>
          <Routes location={location} key={location.pathname}>
            <Route
              path='/login'
              element={
                <RequireNotAuth redirectTo='/'>
                  <Login />
                </RequireNotAuth>
              }></Route>
            <Route
              path='/registration'
              element={
                <RequireNotAuth redirectTo='/'>
                  <Registr />
                </RequireNotAuth>
              }></Route>
            <Route
              path='/'
              element={
                <RequireAuth redirectTo='/login'>
                  <Profile />
                </RequireAuth>
              }></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Routes>
        </div>
      </div>
      {isAuth && <Footer setBlockHeight={setBlockHeight} />}
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
  return role === 'EDITOR' || role === 'ADMIN' ? children : <Navigate to={redirectTo} />;
}

function RequireAdmin({ children, redirectTo }) {
  const role = localStorage.getItem('role');
  console.log('role', role);
  if (role !== 'ADMIN') alert('Нет прав доступа!');
  return role === 'ADMIN' ? children : <Navigate to={redirectTo} />;
}

export default App;
