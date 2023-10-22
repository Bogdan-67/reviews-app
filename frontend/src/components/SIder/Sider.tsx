import { FC, useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  SelectProfile,
  SelectUser,
  logoutAccount,
} from '../../redux/slices/profileSlice';
import styles from './Sider.module.scss';
import { Button, Flex } from 'antd';
import { Status } from '../../models/Status.enum';
import { FiLogOut } from 'react-icons/fi';
import Profile from '../../pages/Profile';

const Sider: FC = () => {
  const { firstname, lastname, middlename } = useAppSelector(SelectUser);
  const { status } = useAppSelector(SelectProfile);

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const activeLinkStyle = {
    fontWeight: 'bold',
  };

  return (
    <>
      <Flex vertical className={styles.sider}>
        <Link
          to="/"
          style={window.location.pathname === '/' ? activeLinkStyle : {}}
        >
          Профиль
        </Link>
        <Link
          to="/request"
          style={window.location.pathname === '/request' ? activeLinkStyle : {}}
        >
          Запросы
        </Link>
        <Link
          to="/staff"
          style={window.location.pathname === '/staff' ? activeLinkStyle : {}}
        >
          Сотрудники
        </Link>
        <Link
          to="/poll"
          style={window.location.pathname === '/poll' ? activeLinkStyle : {}}
        >
          Опросы
        </Link>
      </Flex>
    </>
  );
};

export default Sider;
