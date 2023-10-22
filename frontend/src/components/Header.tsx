import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { SelectUser, logoutAccount } from '../redux/slices/profileSlice';

const Header: FC = () => {
  const { firstname, lastname, middlename } = useAppSelector(SelectUser);

  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <header></header>
    </>
  );
};
export default Header;
