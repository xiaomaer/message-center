import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import 'antd/dist/reset.css';
import ConfirmLayer from './ConfirmLayer';
import CreateModal from './CreateModal'
import './App.scss';

const host = 'https://api.notify.function.work'

function App() {
  const [token, setToken] = useState('')
  const [visible, setVisible] = useState(false)
  const [dataSource, setDatasource] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = useCallback(async () => {
    setLoading(true)
    fetch(`${host}/v0/notifies`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      credentials: 'omit', // include, *same-origin, omit
      headers: {
        token,
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setDatasource(data.data)
      }).catch(e => {
        message.error('获取列表失败，请重试')
      }).finally(() => {
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (token) {
      getList();
    }
  }, [token, getList])

  const handleConfirm = (value: string) => {
    setToken(value)
  }

  const toggleCreateModal = () => {
    setVisible(!visible)
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
      getList();
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
      getList();
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }

  const columns = [
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
      title: '通知总次数',
      dataIndex: 'maxNotifyCount',
      key: 'maxNotifyCount',
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
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      render: (text: boolean) => {
        return text === true ? '完成' : '未完成'
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: object) => (
        <Space size="middle">
          <a onClick={() => { handleDelete(record) }}>Delete</a>
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
      <div className='operation'>
        <Button type="primary" onClick={toggleCreateModal}>创建</Button>
      </div>
      <div className='list'>
        <Table dataSource={dataSource} columns={columns} loading={loading} />
      </div>
      <CreateModal visible={visible} onConfirm={handleCreate} onCancel={toggleCreateModal} />
    </div>
  );
}

export default App;
