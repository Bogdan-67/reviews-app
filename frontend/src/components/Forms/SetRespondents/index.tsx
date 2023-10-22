import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { SelectUsers, fetchUsers } from '../../../redux/slices/userSlice';
import { Button, Flex, Select, SelectProps, Space, message } from 'antd';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './SetRespondents.module.scss';
import SetRespondentsSchema from '../../../models/validation/SetRespondentsSchema';

type Props = {
  title?: boolean;
  showOkBtn?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  id_request?: number;
  author_id: number;
  poll_id: number;
};

// Относится к select
interface ItemProps {
  label: string;
  value: number;
}

const SetRespondentsForm = forwardRef(
  (
    {
      title = true,
      showOkBtn = true,
      onSuccess,
      onError,
      id_request,
      author_id,
      poll_id,
    }: Props,
    ref
  ) => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<Partial<{ id_role: number; users: number[] }>>({
      defaultValues: {},
      resolver: yupResolver(SetRespondentsSchema),
    });
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const users = useAppSelector(SelectUsers);

    const selectProps: SelectProps = {
      mode: 'multiple',
      style: { width: '100%' },
      options: users.map((user) => ({
        value: user.id_user,
        label: `${user.lastname} ${user.firstname} ${user.middlename}`,
      })),
      placeholder: 'Выберите респондентов',
      maxTagCount: 'responsive',
    };

    useEffect(() => {
      dispatch(fetchUsers());
    }, []);

    const submitForm = () => {
      // Код для отправки формы
      handleSubmit(submit)();
    };

    useImperativeHandle(ref, () => ({
      submitForm,
    }));

    const submit: SubmitHandler<{
      id_request: number;
      users: number[];
    }> = async (data) => {
      setIsLoading(true);
      console.log(data);
      // await RoleService.setRespondents(data.id_role, data.users)
      //   .then((response) => {
      //     message.success('Роли успешно назначены');
      //   })
      //   .catch((e) =>
      //     message.error(
      //       e.response?.data?.message ? e.response.data.message : e.message
      //     )
      //   )
      //   .finally(() => setIsLoading(false));
    };

    return (
      <form className={styles.form} onSubmit={handleSubmit(submit)}>
        <h2>Назначение ролей</h2>
        <Controller
          name={`users`}
          control={control}
          render={({ field }) => (
            <>
              <Flex vertical>
                <label>
                  Выберите пользователей, которым отправить опрос для
                  прохождения
                </label>
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
        {showOkBtn && (
          <Button loading={isLoading} type="primary" htmlType="submit">
            Назначить
          </Button>
        )}
      </form>
    );
  }
);

export default SetRespondentsForm;
