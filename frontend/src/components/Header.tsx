import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import { SelectUser, SelectUserRole, logoutAccount } from '../redux/slices/profileSlice';

const Header: FC = () => {
  const {firstname, lastname, middlename} = useAppSelector(SelectUser);
  const role = useAppSelector(SelectUserRole);

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
      <>
        <header>

        </header>
      </>
  );
}
export default Header;
