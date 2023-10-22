import React, { useEffect } from 'react';
import { Flex, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import CreatePollModal from '../../components/Modals/CreatePollModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectRequests, fetchRequests } from '../../redux/slices/requstSlice';
import useSelection from 'antd/es/table/hooks/useSelection';
import { IRequest } from '../../models/IRequest';
import SetRespondentsModal from '../../components/Modals/SetRespondentsModal';
import { SelectUser } from '../../redux/slices/profileSlice';

interface DataType {
  key: string;
  name: string;
  age: string;
  author: string;
  tag: string;
  id_request: number;
}

const columns: ColumnsType<Partial<IRequest>> = [
  {
    title: 'Стажер',
    dataIndex: 'intern',
    key: 'intern',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Дата создания',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (date) => <div>{new Date(date).toLocaleDateString('ru-RU')}</div>,
  },
  {
    title: 'Дата обновления',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (date) => <div>{new Date(date).toLocaleDateString('ru-RU')}</div>,
  },
  {
    title: 'Автор',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Статус',
    key: 'status',
    dataIndex: 'status',
    render: (status, record) => {
      let color = record.status_id === 4 ? 'green' : 'yellow';
      if (record.status_id === 3) {
        color = 'volcano';
      }
      return (
        <Tag color={color} key={status}>
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Действие',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.status_id === 5 && (
          <CreatePollModal id_request={record.id_request} />
        )}
        {record.status_id === 2 && (
          <SetRespondentsModal
            id_request={record.id_request}
            author_id={record.author_id}
            poll_id={record.poll_id ? record.poll_id : null}
          />
        )}
      </Space>
    ),
  },
];

type Props = {};

const TableRequests = (props: Props) => {
  const dispatch = useAppDispatch();
  const requests = useAppSelector(SelectRequests);
  const { id_user } = useAppSelector(SelectUser);

  useEffect(() => {
    console.log(requests);
  }, [requests]);

  useEffect(() => {
    console.log('id_user', id_user);
    if (id_user) {
      dispatch(fetchRequests({ author: id_user }));
    }
  }, [id_user]);
  return (
    <>
      <Flex vertical align="center">
        <h1>Запросы на обратную связь</h1>
        <Table
          style={{ width: '100%' }}
          columns={columns}
          dataSource={requests}
        />
      </Flex>
    </>
  );
};

export default TableRequests;
