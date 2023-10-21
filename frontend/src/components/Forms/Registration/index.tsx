import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterSchema from '../../../models/validation/RegisterSchema';
import styles from './Registration.module.scss';
import MaskedInput from 'react-text-mask';
import { SelectProfile, registrAccount } from '../../../redux/slices/profileSlice';
import ReCAPTCHA from 'react-google-recaptcha';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, message } from 'antd';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { Status } from '../../../models/Status.enum';

export const phoneNumberMask = [
  '+',
  '7',
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

type Props = {};

type RegisterProps = {
  firstname: string;
  lastname: string;
  middlename: string; // отчество
  email: string;
  phone: string;
  password: string;
  passwordCheck: string;
  recaptcha: string;
};

const RegistrationForm = (props: Props) => {
  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    formState: { errors },
  } = useForm<Partial<RegisterProps>>({
    defaultValues: {},
    resolver: yupResolver(RegisterSchema),
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

  const submit: SubmitHandler<RegisterProps> = async (data) => {
    console.log(data);
    dispatch(registrAccount(data));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <h1>Регистрация</h1>
      <div className={styles.inputs}>
        <Controller
          name='firstname'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <>
              <Input placeholder='Имя' status={errors.firstname ? 'error' : ''} {...field} />
              {errors.firstname && <div>{errors.firstname.message}</div>}
            </>
          )}
        />
        <Controller
          name='lastname'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <>
              <Input placeholder='Фамилия' status={errors.lastname ? 'error' : ''} {...field} />
              {errors.lastname && <div>{errors.lastname.message}</div>}
            </>
          )}
        />
        <Controller
          name='middlename'
          control={control}
          render={({ field }) => (
            <>
              <Input placeholder='Отчество' status={errors.middlename ? 'error' : ''} {...field} />
              {errors.middlename && <div>{errors.middlename.message}</div>}
            </>
          )}
        />
        <Controller
          name='email'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <>
              <Input placeholder='Email' status={errors.email ? 'error' : ''} {...field} />
              {errors.email && <div>{errors.email.message}</div>}
            </>
          )}
        />
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <>
              <Input
                placeholder='Телефон'
                type='tel'
                status={errors.phone ? 'error' : ''}
                {...field}
              />
              {errors.phone && <div>{errors.phone.message}</div>}
            </>
          )}
        />
        <Controller
          name='password'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <>
              <Input.Password
                placeholder='Пароль'
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                status={errors.password ? 'error' : ''}
                {...field}
              />
              {errors.password && <div>{errors.password.message}</div>}
            </>
          )}
        />
        <Controller
          name='passwordCheck'
          control={control}
          render={({ field }) => (
            <>
              <Input.Password
                placeholder='Повторите пароль'
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                status={errors.passwordCheck ? 'error' : ''}
                {...field}
              />
              {errors.passwordCheck && <div>{errors.passwordCheck.message}</div>}
            </>
          )}
        />
        <Controller
          name='recaptcha'
          control={control}
          render={({ field }) => (
            <>
              <ReCAPTCHA
                sitekey='6LdgYm4mAAAAACTOp4w9EpdEFelIVMomXK4EA5L_'
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
              {errors.recaptcha && <div>{errors.recaptcha.message}</div>}
            </>
          )}
        />
      </div>
      <p className={styles.auth__text}>
        Уже есть аккаунт?&nbsp;
        <Link to='/login' className={styles.auth__link}>
          Войти
        </Link>
      </p>
      <Button loading={status === Status.LOADING} type='primary' htmlType='submit'>
        Зарегистрироваться
      </Button>
    </form>
  );
};

export default RegistrationForm;
