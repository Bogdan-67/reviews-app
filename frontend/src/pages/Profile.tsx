import { Button } from 'antd';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { SelectProfile, logoutAccount } from '../redux/slices/profileSlice';
import { Status } from '../models/Status.enum';
import CreatePollForm from '../components/Forms/CreatePoll';

type Props = {};

const Profile = (props: Props) => {
  const { status } = useAppSelector(SelectProfile);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Профиль</h1>
    </div>
  );
};

export default Profile;
