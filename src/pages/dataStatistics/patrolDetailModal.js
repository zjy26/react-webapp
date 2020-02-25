import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Modal, Tabs, Table, Row, Col, Card, Button } from 'antd';

const columns = [
  {
    title: '房间',
    dataIndex: 'room',
    key: 'room'
  },
  {
    title: '巡检设备',
    dataIndex: 'patrolObject',
    key: 'patrolObject'
  },
  {
    title: '巡检项',
    dataIndex: 'patrolItem',
    key: 'patrolItem'
  },
  {
    title: '巡检标准',
    dataIndex: 'patrolStandard',
    key: 'patrolStandard'
  },
  {
    title: '巡检值',
    dataIndex: 'patrolValue',
    key: 'patrolValue'
  },
  {
    title: 'CIOS对应值',
    dataIndex: 'cios',
    key: 'cios'
  },
  {
    title: '判定结果',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '数据采集时间',
    dataIndex: 'collectionTime',
    key: 'collectionTime'
  },
  {
    title: '问题描述',
    dataIndex: 'problemDescr',
    key: 'problemDescr'
  },
  {
    title: '问题原因',
    dataIndex: 'problemReason',
    key: 'problemReason'
  },
  {
    title: '解决措施',
    dataIndex: 'solution',
    key: 'solution'
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    render: (text, record)=>{
      return (
        <Button type="link" size={'small'} onClick={()=>{check(record)}}>查看巡检单</Button>
      )
    }
  }
]
const check = (record)=> {
  console.log(record)
}

const { TabPane } = Tabs;
const PatrolDetailModal = props => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    unnormalData: [],
    normalData: [],
    notCheckData: []
  })

   //获取列表数据
   useEffect(() => {
    Axios.get('/api/patrolStatisticsDetail').then(res =>{
      if(res.status === 200){
        setData({
          unnormalData: res.data.unnormalData,
          normalData: res.data.normalData,
          notCheckData: res.data.notCheckData
        });
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  return (
    <Modal
      title="查看详情"
      okText="确认"
      cancelText="取消"
      width="900px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <div>
        <Row gutter={16} style={{ background: '#ECECEC', padding: '30px' }}>
          <Col span={4}>
            <Card title="待巡检次数" bordered={false}>
              11
            </Card>
          </Col>
          <Col span={3}>
            <Card title="巡检次数" bordered={false}>
              12
            </Card>
          </Col>
          <Col span={4}>
            <Card title="异常巡检次数" bordered={false}>
              1
            </Card>
          </Col>
          <Col span={3}>
            <Card title="未检出次数" bordered={false}>
              2
            </Card>
          </Col>
          <Col span={4}>
            <Card title="正常巡检次数" bordered={false}>
              2
            </Card>
          </Col>
          <Col span={3}>
            <Card title="完成率" bordered={false}>
              2
            </Card>
          </Col>
          <Col span={3}>
            <Card title="未检出率" bordered={false}>
              2
            </Card>
          </Col>
        </Row>
      </div>
      <Tabs type="card">
        <TabPane tab="异常数据" key="1">
          <Table columns={columns} dataSource={data.unnormalData} size="small" />
        </TabPane>
        <TabPane tab="正常数据" key="2">
          <Table columns={columns} dataSource={data.normalData} size="small" />
        </TabPane>
        <TabPane tab="未检出数据" key="3">
          <Table columns={columns} dataSource={data.notCheckData} size="small" />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default PatrolDetailModal;