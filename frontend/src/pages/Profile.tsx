import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  SelectProfile,
  SelectUser,
  logoutAccount,
} from '../redux/slices/profileSlice';
import { Status } from '../models/Status.enum';
import CreatePollForm from '../components/Forms/CreatePoll';
import { fetchUsers } from '../redux/slices/userSlice';
import styles from './Profile.module.scss';

type Props = {};

const Profile = (props: Props) => {
  const { firstname, lastname, middlename, email, phone } =
    useAppSelector(SelectUser);
  return (
    <div className={styles.Profile}>
      <h1>Профиль</h1>
      <div className={styles.infoProfile}>
        <p>Фамилия: {lastname}</p>
        <p>Имя: {firstname}</p>
        <p> Отчество: {middlename ? middlename : ''}</p>
        <p> Email: {email}</p>
        <p> Телефон: {phone}</p>
      </div>
    </div>
  );
};

export default Profile;
