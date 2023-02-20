import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import 'antd/dist/reset.css';
import ConfirmLayer from './ConfirmLayer';
import CreateModal from './CreateModal'
import './App.scss';

const host = 'https://api.notify.function.work'
const pageSize = 20;
const options = [
  { label: '全部', value: '' },
  { label: '完成', value: true },
  { label: '未完成', value: false },
]

interface DataType {
  title: string;
  dataIndex: number;
  key: number;
  completed: boolean;
}


function App() {
  const [token, setToken] = useState('')
  const [visible, setVisible] = useState(false)
  const [dataSource, setDatasource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const getList = useCallback(async (offset: number, completed = '') => {
    setLoading(true)
    fetch(`${host}/v0/notifies?limit=${pageSize}&offset=${offset}&completed=${completed}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        token,
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setDatasource(data.data);
        setTotal(data.total);
      }).catch(e => {
        message.error('获取列表失败，请重试')
      }).finally(() => {
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (token) {
      getList(0);
    }
  }, [token, getList])

  const handleConfirm = (value: string) => {
    setToken(value)
  }

  const toggleCreateModal = () => {
    setVisible(!visible)
  }

  const handlePagerOnChange = (page: number, pageSize: number) => {
    getList((page - 1) * pageSize);
  }

  const handleCreate = async (values: object) => {
    console.log(values, '====')
    try {
      const { channelName, startAt, endAt, ...rest } = values as any
      const data = {
        ...rest,
        channelName: channelName === '2' ? '定时通知' : '',
        startAt: startAt ? startAt.unix() : 0,
        endAt: endAt ? endAt.unix() : 0
      }
      await fetch(`${host}/v0/notifies`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'omit',
        headers: {
          token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      message.success('创建成功，将为你跳转到列表页面')
      setVisible(false);
      getList(0);
    } catch (error) {
      message.error('创建失败，请重试')
    }
  }

  const handleDelete = async (values: any) => {
    console.log('delete', values)
    try {
      await fetch(`${host}/v0/notifies/${values.id}`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        credentials: 'omit',
        headers: {
          token,
        },
      });
      message.success('删除成功')
      getList(0);
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }

  const handlFilter = useCallback((value: string) => {
    getList(0, value)
  }, [getList])

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },

    {
      title: '通知规则',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '生效时间',
      dataIndex: 'startAt',
      key: 'startAt',
    },
    {
      title: '失效时间',
      dataIndex: 'endAt',
      key: 'endAt',
    },
    {
      title: '总通知次数',
      dataIndex: 'maxNotifyCount',
      key: 'maxNotifyCount',
    },
    {
      title: '已通知次数',
      dataIndex: 'notifyCount',
      key: 'notifyCount',
    },
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      render: (text: boolean) => {
        return text === true ? '完成' : '未完成'
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: object) => (
        <Space size="middle">
          <a onClick={() => { handleDelete(record) }}>删除</a>
        </Space>
      ),
    },
  ];


  if (!token) {
    return (
      <ConfirmLayer onConfirm={handleConfirm} />
    )
  }
  return (
    <div className="container">
      <div className='header'>
        <Select options={options} onChange={handlFilter} placeholder="请选择状态" defaultValue={''}></Select>
        <Button type="primary" onClick={toggleCreateModal}>创建</Button>
      </div>
      <div className='list'>
        <Table
          rowKey='id'
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={{
            total,
            showTotal: (total) => `共 ${total} 条`,
            pageSize,
            showSizeChanger: false,
            onChange: handlePagerOnChange,
          }}
        />
      </div>
      <CreateModal visible={visible} onConfirm={handleCreate} onCancel={toggleCreateModal} />
    </div>
  );
}

export default App;
