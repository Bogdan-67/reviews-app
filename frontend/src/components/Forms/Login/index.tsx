import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import RegisterSchema from '../../../models/validation/RegisterSchema';
import styles from './Login.module.scss';
import {
  SelectProfile,
  loginAccount,
  registrAccount,
} from '../../../redux/slices/profileSlice';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Status } from '../../../models/Status.enum';
import LoginSchema from '../../../models/validation/LoginSchema';

type LoginProps = {
  login: string;
  password: string;
};

const LoginForm = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<Partial<LoginProps>>({
    resolver: yupResolver(LoginSchema),
  });
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector(SelectProfile);

  useEffect(() => {
    console.log(error);
    if (error) {
      message.error(error);
    }
  }, [error]);

  const submit: SubmitHandler<LoginProps> = async (data) => {
    console.log(data);

    dispatch(loginAccount(data));
  };

  return (
    <div className={styles.auto}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit(submit)}>
          <h1>Авторизация</h1>
          <div className={styles.inputs}>
            <h3>Email</h3>
            <Controller
              name='login'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <Input
                    placeholder='Логин'
                    status={errors.login ? 'error' : ''}
                    {...field}
                  />
                  {errors.login && <div>{errors.login.message}</div>}
                </>
              )}
            />
            <h3>Пароль</h3>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <Input.Password
                    placeholder='Пароль'
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                    status={errors.password ? 'error' : ''}
                    {...field}
                  />
                  {errors.password && <div>{errors.password.message}</div>}
                </>
              )}
            />
          </div>
          <p className={styles.auth__text_2}>
            Нет аккаунта?&nbsp;
            <Link to='/registration' className={styles.auth__2_button}>
              Зарегистрироваться
            </Link>
          </p>
          <div className={styles.button}>
            <Button
              className={styles.buttonCol}
              loading={status === Status.LOADING}
              type='primary'
              htmlType='submit'
            >
              Войти
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
