import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './scss/app.scss';
import Login from './pages/Login';
import Registr from './pages/Registr';
import React, { useEffect } from 'react';
import { RootState } from './redux/store';
import {
  SelectProfile,
  SelectUser,
  checkAuth,
} from './redux/slices/profileSlice';
import { useSelector } from 'react-redux';
import NotFound from './pages/NotFound/NotFound';

import { useAppDispatch, useAppSelector } from './hooks/redux';
import Profile from './pages/Profile';
import MainLayout from './layouts/MainLayout';
import TableRequests from './pages/Requests/TableRequests';
import CreateRequest from './pages/Requests/CreateRequest';
import CreatePoll from './pages/Poll/CreatePoll';
import CompletePoll from './pages/Poll/CompletePoll';
import UsersInfo from './pages/Users/Users';
import GiveRole from './pages/Roles/GiveRole';
import AddInterns from './pages/Interns/AddInterns';
import FeedbackService from './services/FeedbackService';
import { Button, notification } from 'antd';
import UserPolls from './pages/Poll/UserPolls';

function App() {
  const dispatch = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.profile.isAuth);
  const location = useLocation();
  const { error, status } = useAppSelector(SelectProfile);
  const { id_user } = useAppSelector(SelectUser);
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 3,
    },
  });

  const openNotification = (poll_id: number) => {
    api.open({
      message: 'Вам доступен новый опрос',
      key: 'polls',
      description: ``,
      btn: (
        <Button
          type="primary"
          onClick={() => navigate('/poll/complete/' + poll_id)}
        >
          Перейти к опросу
        </Button>
      ),
      onClick: () => {
        navigate('/poll/complete/' + poll_id);
        notification.destroy('polls');
      },
      duration: 5,
    });
  };

  const checkPolls = async () => {
    await FeedbackService.enabledFeedbacks(id_user).then((response) => {
      if (response.data && response.data.length > 0) {
        response.data.map((feedback) => openNotification(feedback.poll_id));
      }
    });
  };

  useEffect(() => {
    if (id_user) {
      checkPolls();
    }
  }, [id_user]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  // if (status === Status.LOADING) return <>Loading...</>;

  return (
    <>
      {contextHolder}
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
          <Route path="requests">
            <Route path="" element={<TableRequests />}></Route>
            <Route path="create" element={<CreateRequest />}></Route>
          </Route>
          <Route path="poll">
            <Route path="" element={<UserPolls />}></Route>
            <Route path="create" element={<CreatePoll />}></Route>
            <Route path="complete/:id" element={<CompletePoll />}></Route>
          </Route>
          <Route path="users">
            <Route path="" element={<UsersInfo />}></Route>
            <Route path="user/:id" element={<CompletePoll />}></Route>
          </Route>
          <Route path="staff" element={<UsersInfo />}></Route>
          <Route path="interns">
            <Route path="" element={<AddInterns />}></Route>
            <Route path="add" element={<AddInterns />}></Route>
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
