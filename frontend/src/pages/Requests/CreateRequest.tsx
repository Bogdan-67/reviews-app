import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RequestSchema from '../../models/validation/RequestSchema';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectProfile } from '../../redux/slices/profileSlice';
import { Button, message, Select, SelectProps, Space } from 'antd';
import { createRequest } from '../../redux/slices/requstSlice';
import styles from './requests.module.scss';
import { Status } from '../../models/Status.enum';
type Props = {};

export interface RequstProps {
  value: number[];
}

const CreateRequest = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Partial<RequstProps>>({
    defaultValues: {},
    resolver: yupResolver(RequestSchema),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>(null);
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector(SelectProfile);
  const [value, setValues] = useState([7]);
  // Относится к select
  interface ItemProps {
    label: string;
    value: number;
  }
  const label = 'name1';
  const infoUsers = [1, 2];
  const options: ItemProps[] = [{ label, value: infoUsers[1] }];
  console.log('value', value);
  useEffect(() => {
    console.log(error);
    if (error) {
      message.error(error);
    }
  }, [error]);
  const author = useAppSelector((state) => state.profile.user.id_user);
  console.log('Автор:', author);
  const submit: SubmitHandler<RequstProps> = async () => {
    setIsLoading(true);
    console.log('value ', value);
    const type_request = 1; //fixme Исправить на тот, который должен быть назначен (Стажеры или Сотрудники)
    dispatch(createRequest({ author, id_interns: value, type_request }));
  };

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: number[]) => {
      console.log('newValue', newValue);
      setValues(newValue);
    },
    placeholder: 'Выбирите элемент...',
    maxTagCount: 'responsive',
  };
  useEffect(() => {
    console.log('Страница создания запроса');
    // users = useAppSelector(state => state.usersReducer.)
  }, []);
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(submit)}>
        <div className={styles.inputs}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select {...selectProps} />
            {/*<Select {...selectProps} disabled />*/}
          </Space>
        </div>
        <Button
          loading={status === Status.LOADING}
          type="primary"
          htmlType="submit"
        >
          Создать запрос
        </Button>
      </form>
    </>
  );
};

export default CreateRequest;
