import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  SelectProfile,
  SelectUser,
  logoutAccount,
} from '../../redux/slices/profileSlice';
import styles from './Header.module.scss';
import { Button } from 'antd';
import { Status } from '../../models/Status.enum';
import { FiLogOut } from 'react-icons/fi';

const Header: FC = () => {
  const { firstname, lastname, middlename } = useAppSelector(SelectUser);
  const { status } = useAppSelector(SelectProfile);

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  //const firstInitial = firstname.charAt(0);
  //const middleInitial = middlename ? middlename.charAt(0) : '';
  const fullName = `${lastname} ${firstname.charAt(0)}. ${
    middlename ? middlename.charAt(0) + '.' : ''
  }`;

  return (
    <>
      <header className={styles.out}>
        <Link to="/">
          <div className={styles.name}>{fullName}</div>
        </Link>
        <button
          className={styles.buttonOut}
          onClick={() => dispatch(logoutAccount())}
        >
          <FiLogOut />
        </button>
      </header>
    </>
  );
};

export default Header;
