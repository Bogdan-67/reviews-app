import React from 'react';
import { logoutAccount } from '../redux/slices/profileSlice';
import {useAppDispatch} from "../hooks/redux";
export const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className='main'>
      <h1 className='main__title'> Тут будет таблица с данными, которой пока что у нас нет!</h1>
      <button onClick={() => dispatch(logoutAccount())}>Выйти</button>
    </div>
  );
};
export default Home;
