import React from 'react';
import { Flex, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import CreatePollModal from '../../components/Modals/CreatePollModal';

interface DataType {
  key: string;
  name: string;
  age: string;
  author: string;
  tag: string;
  id_request: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Стажер',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Дата',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Автор',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Статус',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tag }) => {
      let color = tag.length < 8 ? 'yellow' : 'green';
      if (tag === 'Отменена') {
        color = 'volcano';
      }
      return (
        <Tag color={color} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Действие',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {record.tag === 'Ожидает' && (
          <CreatePollModal id_request={record.id_request} />
        )}
        {record.tag === 'Ожидает' && <a>Назначить респондентов</a>}
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    id_request: 1,
    name: 'Иван Малявкин',
    age: '21.10.2023',
    author: 'Иван Петров',
    tag: 'Ожидает',
  },
  {
    key: '2',
    id_request: 2,
    name: 'Кирилл Кухта',
    age: '16.10.2023',
    author: 'Максим Иванов',
    tag: 'Отменена',
  },
  {
    key: '3',
    id_request: 3,
    name: 'Данила Орлов',
    age: '01.10.2023',
    author: 'Иван Петров',
    tag: 'Выполнена',
  },
];

type Props = {};

const TableRequests = (props: Props) => {
  return (
    <>
      <Flex vertical align="center">
        <h1>Запросы на обратную связь</h1>
        <Table style={{ width: '100%' }} columns={columns} dataSource={data} />
      </Flex>
    </>
  );
};

export default TableRequests;
