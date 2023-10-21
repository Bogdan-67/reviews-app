import React, { useState } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import RegisterSchema from '../../../models/validation/RegisterSchema';
import styles from './RegistrForm.module.scss';
import MaskedInput from 'react-text-mask';
import { registrAccount } from '../../../redux/slices/profileSlice';
import { bindActionCreators } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ReCAPTCHA from 'react-google-recaptcha';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

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

const RegistrationForm = (props: Props) => {
  return <div>RegistrationForm</div>;
};

export default RegistrationForm;
