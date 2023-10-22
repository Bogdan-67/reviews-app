import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectUsers, fetchUsers } from '../../redux/slices/userSlice';
import { Button, Flex, Select, SelectProps, Space, message } from 'antd';
import styles from './GiveRole.module.scss';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import GiveRoleSchema from '../../models/validation/GiveRolesSchema';
import { IRole } from '../../models/IRole';
import RoleService from '../../services/RoleService';

type Props = {};

// Относится к select
interface ItemProps {
  label: string;
  value: number;
}

const GiveRole = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Partial<{ id_role: number; users: number[] }>>({
    defaultValues: {},
    resolver: yupResolver(GiveRoleSchema),
  });
  const dispatch = useAppDispatch();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [value, setValue] = useState([]);
  const [options, setOptions] = useState<ItemProps[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const users = useAppSelector(SelectUsers);

  const selectProps: SelectProps = {
    mode: 'multiple',
    style: { width: '100%' },
    options: users.map((user) => ({
      value: user.id_user,
      label: `${user.lastname} ${user.firstname} ${user.middlename}`,
    })),
    placeholder: 'Выберите пользователей...',
    maxTagCount: 'responsive',
  };

  const fetchRoles = async () => {
    await RoleService.fetchRoles()
      .then((response) => {
        setRoles(response.data);
      })
      .catch((e) =>
        message.error(
          e.response?.data?.message ? e.response.data.message : e.message
        )
      );
  };

  useEffect(() => {
    console.log('Страница создания запроса');
    dispatch(fetchUsers());
    fetchRoles();
  }, []);

  const submit: SubmitHandler<{ id_role: number; users: number[] }> = async (
    data
  ) => {
    setIsLoading(true);
    console.log(data);
    await RoleService.giveRoles(data.id_role, data.users)
      .then((response) => {
        message.success('Роли успешно назначены');
      })
      .catch((e) =>
        message.error(
          e.response?.data?.message ? e.response.data.message : e.message
        )
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)}>
      <h2>Назначение ролей</h2>
      <div className={styles.inputs}>
        <label>Выберите роль</label>
        <Controller
          name={`id_role`}
          control={control}
          render={({ field }) => (
            <>
              <Flex vertical>
                <Select
                  defaultActiveFirstOption={false}
                  style={{ width: 120 }}
                  onSelect={(value) => {
                    field.onChange(value);
                  }}
                  options={roles.map((role: IRole) => ({
                    value: role.id_role,
                    label: role.role_name,
                  }))}
                  status={errors.id_role ? 'error' : ''}
                  {...field}
                />
                {errors.id_role && <div>{errors.id_role.message}</div>}
              </Flex>
            </>
          )}
        />
        <Controller
          name={`users`}
          control={control}
          render={({ field }) => (
            <>
              <Flex vertical>
                <label>Выберите пользователей, которым выдать роль</label>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Select
                    {...selectProps}
                    onChange={(newValue: number[]) => {
                      field.onChange(newValue);
                    }}
                    disabled={false}
                    status={errors.users ? 'error' : ''}
                    {...field}
                  />
                </Space>
                {errors.users && <div>{errors.users.message}</div>}
              </Flex>
            </>
          )}
        />
      </div>
      <Button loading={isLoading} type="primary" htmlType="submit">
        Назначить роли
      </Button>
    </form>
  );
};

export default GiveRole;
