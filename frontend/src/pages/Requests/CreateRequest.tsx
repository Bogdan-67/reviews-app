import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RequestSchema from '../../models/validation/RequestSchema';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectProfile } from '../../redux/slices/profileSlice';
import { Button, message, Select, SelectProps, Space } from 'antd';
import styles from '../../components/Forms/Registration/Registration.module.scss';
import { Status } from '../../models/Status.enum';
import { createRequest } from '../../redux/slices/requstSlice';

type Props = {};

export interface RequstProps {
  id_interns: number[];
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
  // Относится к select
  interface ItemProps {
    label: string;
    value: string;
  }

  const options: ItemProps[] = [];

  for (let i = 10; i < 36; i++) {
    const value = i.toString(36) + i;
    options.push({
      label: `${value}`,
      value,
    });
  }

  useEffect(() => {
    console.log(error);
    if (error) {
      message.error(error);
    }
  }, [error]);
  const author = useAppSelector((state) => state.profile.user.id_user);
  const submit: SubmitHandler<RequstProps> = async ({ id_interns }) => {
    setIsLoading(true);
    console.log(id_interns);
    const type_request = 1; //fixme Исправить на тот, который должен быть назначен (Стажеры или Сотрудники)
    dispatch(createRequest({ author, id_interns, type_request }));
  };
  const [value, setValue] = useState(['a10', 'c12', 'h17', 'j19', 'k20']);

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value,
    options,
    onChange: (newValue: string[]) => {
      setValue(newValue);
    },
    placeholder: 'Select Item...',
    maxTagCount: 'responsive',
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <div className={styles.inputs}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select {...selectProps} />
          <Select {...selectProps} disabled />
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
  );
};

export default CreateRequest;
