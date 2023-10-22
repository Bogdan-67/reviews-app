import React, { useEffect } from 'react';
import {
  Badge,
  Dropdown,
  Flex,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import CreatePollModal from '../../components/Modals/CreatePollModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SelectRequests, fetchRequests } from '../../redux/slices/requstSlice';
import { IRequest } from '../../models/IRequest';
import SetRespondentsModal from '../../components/Modals/SetRespondentsModal';
import { SelectUser } from '../../redux/slices/profileSlice';
import { Link } from 'react-router-dom';

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

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

class ExpandedDataType {}

function DownOutlined() {
  return null;
}

const expandedRowRender = () => {
  const columns: TableColumnsType<ExpandedDataType> = [
    { title: 'ФИО сотрудника', dataIndex: 'fio', key: 'date' },
    { title: 'Дата обновления', dataIndex: 'upgrade', key: 'upgrade' },
    {
      title: 'Статус',
      key: 'status',
      render: () => <Badge status="success" text="Finished" />,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <Space size="middle">
          <Link to={`/profile`}>Профиль</Link>
          <Dropdown menu={{ items }}>
            <a>
              More <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const data = [];
  // const dispatch = useAppDispatch();

  // const request = useAppSelector(SelectRequests);

  return <Table columns={columns} dataSource={data} pagination={false} />;
};
const TableRequests = (props: Props) => {
  const dispatch = useAppDispatch();
  const requests = useAppSelector(SelectRequests);
  const profile = useAppSelector((state) => state.profile.user);
  const id_user = profile.id_user;
  useEffect(() => {
    console.log('requests', requests);
  }, [requests]);

  useEffect(() => {
    if (id_user) {
      dispatch(fetchRequests({ id_user }));
    }
  }, [id_user]);
  return (
    <>
      <Flex vertical align="center">
        <h1>Запросы на обратную связь</h1>
        <Table
          style={{ width: '100%' }}
          expandable={{ expandedRowRender }}
          columns={columns}
          dataSource={requests}
        />
      </Flex>
    </>
  );
};

export default TableRequests;
