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
      <Button
        loading={status === Status.LOADING}
        danger
        onClick={() => dispatch(logoutAccount())}
      >
        Выйти
      </Button>
    </div>
  );
};

export default Profile;
