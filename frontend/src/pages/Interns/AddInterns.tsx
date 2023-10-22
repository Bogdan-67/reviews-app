import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUsers } from '../../redux/slices/userSlice';
import { IUser, Role } from '../../models/IUser';
import { Button, Modal, Select, Space, Table, Tag } from 'antd';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios/index';
import UserService from '../../services/UserService';
import $api from '../../http';
const { Column, ColumnGroup } = Table;

const AddInterns = () => {
  const [selectUser, setSelectUser] = useState(); //curator
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addCurator = async (curator_id, intern_id) => {
    try {
      console.log('requests: ', curator_id, ' ', intern_id);
      const response = await $api.post('/relations-add', {
        curator_id,
        intern_id,
      });
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      alert(error.response?.data?.message);
      return error.response?.data?.message;
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleAddResponddent = (user: IUser) => {
    console.log(user);

    setSelectedUser(user); //intern
    showModal(); // Откройте модальное окно
  };

  const handleOk = () => {
    //todo добавить функцию добавления куратора стажеру (массив из стажеров для куратора)
    addCurator(selectUser, selectedUser.id_user);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = useState(null); //intern

  const infoUsers = useAppSelector((state) => state.usersReducer.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  console.log(infoUsers);
  const handleChange = (value: any) => {
    console.log(`selected ${value}`);
    setSelectUser(value);
  };
  console.log(infoUsers);
  console.log(
    'users',
    infoUsers.filter((user) => user.roles.find((role) => role.role_id === 2))
  );
  return (
    <>
      <Table
        pagination={false}
        dataSource={infoUsers.filter(
          (user) => !!user.roles.find((role) => role.role_id === 2)
        )}
      >
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
        {/* <Column */}
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
        {/*/> */}
        <Column
          title="Действия"
          key="action"
          render={(user: IUser) => (
            <Space size="middle">
              <Button type="primary" onClick={() => handleAddResponddent(user)}>
                Назначить куратора
              </Button>
              <Button>Сменить роль</Button>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Добавление куратора стажеру"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        key="user"
      >
        {selectedUser && (
          <div>
            <h4>
              {selectedUser.lastname +
                ' ' +
                selectedUser.firstname +
                ' ' +
                (selectedUser.middlename ? selectedUser.middlename : '')}
            </h4>
            <label>Выберите куратора:</label>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                style={{ width: 300 }}
                onChange={handleChange}
                options={infoUsers.map((user) => ({
                  //fixme исправить выбор кураторов (сделать по роли и невозможность назначить случайно самого себя)
                  value: user.id_user,
                  label: `${user.lastname} ${user.firstname} ${
                    user.middlename ? user.middlename : ''
                  }`,
                }))}
              />
            </Space>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddInterns;
