import { Table, Tag } from 'antd';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUsers } from '../../redux/slices/userSlice';
import { Role } from '../../models/IUser';

const { Column, ColumnGroup } = Table;

const UsersInfo: FC = () => {
  const dispatch = useAppDispatch();
  const infoUsers = useAppSelector((state) => state.usersReducer.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  console.log(infoUsers);
  return (
    <>
      <Table pagination={false} dataSource={infoUsers}>
        <ColumnGroup title="ФИО">
          <Column
            sorter={true}
            width={'10%'}
            title="Фамилиия"
            dataIndex="lastname"
            key="lastname"
          />
          <Column
            width={'10%'}
            title="Имя"
            dataIndex="firstname"
            key="firstname"
          />
          <Column
            width={'10%'}
            title="Отчество"
            dataIndex="middlename"
            key="middlename"
          />
        </ColumnGroup>
        <Column width={'15%'} title="Почта" dataIndex="email" key="email" />
        <Column title="Телефон" dataIndex="phone" key="phone" />

        <Column
          title="Роли"
          dataIndex="roles"
          key="roles"
          render={(roles: Role[]) => (
            <>
              {roles?.map((role) => (
                <Tag color="blue" key={role.role_id}>
                  {role.role_name}
                </Tag>
              ))}
            </>
          )}
        />
        {/*<Column*/}
        {/*  title="Команды"*/}
        {/*  dataIndex="tags"*/}
        {/*  key="tags"*/}
        {/*  render={(tags: string[]) => (*/}
        {/*    <>*/}
        {/*      {infoUsers.map((user) => (*/}
        {/*        <Tag color="blue" key={user.email}>*/}
        {/*          {user.email}*/}
        {/*        </Tag>*/}
        {/*      ))}*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<Column*/}
        {/*  title="Action"*/}
        {/*  key="action"*/}
        {/*  render={(_: any, record: DataType) => (*/}
        {/*    <Space size="middle">*/}
        {/*      <a>Invite {record.lastName}</a>*/}
        {/*      <a>Delete</a>*/}
        {/*    </Space>*/}
        {/*  )}*/}
        {/*/>*/}
      </Table>
    </>
  );
};
export default UsersInfo;
