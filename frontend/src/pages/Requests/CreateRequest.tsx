import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RequestSchema from '../../models/validation/RequestSchema';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectProfile } from '../../redux/slices/profileSlice';
import { Button, message, Select, SelectProps, Space } from 'antd';
import { createRequest } from '../../redux/slices/requstSlice';
import styles from './requests.module.scss';
import { Status } from '../../models/Status.enum';
import { fetchUsers } from '../../redux/slices/userSlice';
import RequestService from '../../services/RequestService';
import { RequestType } from '../../types/RequestTypes';

export interface RequstProps {
  value: number[];
}

const CreateRequest = () => {
  const getRequestTypes = async () => {
    try {
      // Вызываем ваш метод fetchRequestTypes() для получения данных
      const response = await RequestService.fetchRequestTypes();

      // Возвращаем только нужные поля (id_type_request и name) из данных
      return response.data;
    } catch (error) {
      // Обрабатываем ошибку, если запрос не удался
      console.error('Ошибка при получении типов: ', error);
      throw error;
    }
  };

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
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState<ItemProps[]>();
  const [select, setSelect] = useState(null);
  const infoUsers = useAppSelector((state) => state.usersReducer.users);

  // Относится к select
  interface ItemProps {
    label: string;
    value: number;
  }

  useEffect(() => {
    const users = infoUsers.map((user) => ({
      fio: `${user.lastname} ${user.firstname} ${
        user.middlename ? user.middlename : ''
      } `,
      ...user,
    }));
    const options: ItemProps[] = users.map((user) => ({
      label: user.fio,
      value: user.id_user,
    }));
    setOptions(options);
  }, [infoUsers]);

  useEffect(() => {
    console.log(error);
    if (error) {
      message.error(error);
    }
  }, [error]);
  const author = useAppSelector((state) => state.profile.user.id_user);
  const submit: SubmitHandler<RequstProps> = async () => {
    setIsLoading(true);
    console.log('value ', value);
    const type_request = selectType;
    dispatch(createRequest({ author, id_interns: value, type_request }));
  };
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
  const [requestTypesStatus, setRequestTypesStatus] = useState(null);
  const [selectType, setSelectType] = useState();

  const fetchRequestTypes = async () => {
    try {
      setRequestTypesStatus(Status.LOADING);
      const response = await RequestService.fetchRequestTypes();
      setRequestTypes(response.data);
      setRequestTypesStatus(Status.SUCCESS);
      console.log(response.data);
    } catch (e) {
      setRequestTypesStatus(Status.ERROR);
    }
  };
  const checkType = () => {};

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: number[]) => {
      console.log('newValue', newValue);
      setValue(newValue);
    },
    placeholder: 'Выбирите элемент...',
    maxTagCount: 'responsive',
  };
  useEffect(() => {
    console.log('Страница создания запроса');
    dispatch(fetchUsers());
    fetchRequestTypes();
  }, []);
  console.log('requestTypes', requestTypes);
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
    setSelectType(value);
  };
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(submit)}>
        <div className={styles.inputs}>
          <Select
            style={{ width: 300 }}
            onChange={handleChange}
            options={requestTypes.map((type) => ({
              value: type.id_type_request,
              label: type.name,
            }))}
          />
          <label>
            Выбирите стажеров, о которых хотите собрать обратную связь
          </label>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Select {...selectProps} disabled={false} />
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
