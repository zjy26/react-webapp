import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Tabs, Card, Button, DatePicker, Table } from 'antd';
import ObjDetailModal from './objDetailModal';
import PatrolDetailModal from './patrolDetailModal';

const objColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: '设备名称',
    dataIndex: 'objName',
    key: 'objName'
  },
  {
    title: '历史故障次数',
    dataIndex: 'historyFaultNum',
    key: 'historyFaultNum'
  },
  {
    title: '解决故障次数',
    dataIndex: 'solveFaultNum',
    key: 'solveFaultNum'
  },
  {
    title: '故障处理率',
    dataIndex: 'faultHandlingRate',
    key: 'faultHandlingRate'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'runningMileage',
    key: 'runningMileage'
  },
  {
    title: '上次维护时间',
    dataIndex: 'lastMaintenanceTime',
    key: 'lastMaintenanceTime'
  }
]

const brandColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: '品牌名称',
    dataIndex: 'brandName',
    key: 'brandName'
  },
  {
    title: '历史故障次数',
    dataIndex: 'historyFaultNum',
    key: 'historyFaultNum'
  },
  {
    title: '解决故障次数',
    dataIndex: 'solveFaultNum',
    key: 'solveFaultNum'
  },
  {
    title: '未解决故障个数',
    dataIndex: 'unresolvedFaultNum',
    key: 'unresolvedFaultNum'
  },
  {
    title: '故障率',
    dataIndex: 'faultRate',
    key: 'faultRate'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'runningMileage',
    key: 'runningMileage'
  }
]


const { TabPane } = Tabs;
const DataStatistics = props => {
  const { getFieldDecorator } = props.form;
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState({
    data: [],
    objData: [],
    brandData: []
  });
  const [visible, setVisible] = useState({  //弹窗
    showObj: false,
    showPatrol: false
  });

  const columns = [
    {
      title: '线路',
      dataIndex: 'line',
      key: 'line'
    },
    {
      title: '站点',
      dataIndex: 'site',
      key: 'site'
    },
    {
      title: '设备数量',
      dataIndex: 'objNum',
      key: 'objNum'
    },
    {
      title: '故障数量',
      dataIndex: 'faultNum',
      key: 'faultNum'
    },
    {
      title: '停用数量',
      dataIndex: 'stopNum',
      key: 'stopNum'
    },
    {
      title: '故障率',
      dataIndex: 'faultRate',
      key: 'faultRate'
    },
    {
      title: '停用时长',
      dataIndex: 'stopLength',
      key: 'stopLength'
    },
    {
      title: '运行里程',
      dataIndex: 'runningMileage',
      key: 'runningMileage'
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      key: 'brandName'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: () => {
        return (
          <a onClick={ ()=>{setVisible({...visible, showObj:true})} }>查看详情</a>
        )
      }
    }
  ];

  const patrolColumns = [
    {
      title: '线路',
      dataIndex: 'line',
      key: 'line'
    },
    {
      title: '站点',
      dataIndex: 'site',
      key: 'site'
    },
    {
      title: '待巡检次数',
      dataIndex: 'objNum',
      key: 'objNum'
    },
    {
      title: '巡检次数',
      dataIndex: 'faultNum',
      key: 'faultNum'
    },
    {
      title: '异常巡检次数',
      dataIndex: 'stopNum',
      key: 'stopNum'
    },
    {
      title: '未检出次数',
      dataIndex: 'faultRate',
      key: 'faultRate'
    },
    {
      title: '正常巡检次数',
      dataIndex: 'stopLength',
      key: 'stopLength'
    },
    {
      title: '完成率',
      dataIndex: 'runningMileage',
      key: 'runningMileage'
    },
    {
      title: '未检出率',
      dataIndex: 'brandName',
      key: 'brandName'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: () => {
        return (
          <a onClick={ ()=>{setVisible({...visible, showPatrol:true})} }>查看详情</a>
        )
      }
    }
  ]
  
  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showObj: false,
      showPatrol: false
    });
  }
  //获取列表数据
  useEffect(() => {
    Axios.get('/api/objStatisticsTable').then(res =>{
      if(res.status === 200){
        setTable({
          data: res.data.data,
          objData: res.data.objData,
          brandData: res.data.brandData
        });
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  return (
    <div>
      <Form layout="inline" style={{margin: 30}}>
        <Form.Item>
          {getFieldDecorator('date', {
            rules: [],
          })(
            <DatePicker placeholder="请选择日期" />
          )}
        </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">筛选</Button>
      </Form.Item>
        
      </Form>
      <Tabs  type="card">
        <TabPane tab="设备统计" key="1">
          <Table columns={columns} dataSource={table.data} defaultExpandedRowKeys={[1]} />
          <Row>
            <Col span={12}>
              <Table columns={objColumns} dataSource={table.objData} size="small" />
            </Col>
            <Col span={12}>
              <Table columns={brandColumns} dataSource={table.brandData} size="small" />
            </Col>
          </Row>
          <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Row gutter={16}>
              <Col span={4}>
                <Card title="正在运行" bordered={false}>
                  11
                </Card>
              </Col>
              <Col span={4}>
                <Card title="待维护运行" bordered={false}>
                  12
                </Card>
              </Col>
              <Col span={4}>
                <Card title="故障运行" bordered={false}>
                  1
                </Card>
              </Col>
              <Col span={4}>
                <Card title="停机维护" bordered={false}>
                  2
                </Card>
              </Col>
              <Col span={4}>
                <Card title="停机修复" bordered={false}>
                  2
                </Card>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="巡检统计" key="2">
          <div>
            <Row gutter={16} style={{ background: '#ECECEC', padding: '30px' }}>
              <Col span={3}>
                <Card title="待巡检次数" bordered={false}>
                  11
                </Card>
              </Col>
              <Col span={3}>
                <Card title="巡检次数" bordered={false}>
                  12
                </Card>
              </Col>
              <Col span={3}>
                <Card title="异常巡检次数" bordered={false}>
                  1
                </Card>
              </Col>
              <Col span={3}>
                <Card title="未检出次数" bordered={false}>
                  2
                </Card>
              </Col>
              <Col span={3}>
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
            <Table columns={patrolColumns} dataSource={table.data} defaultExpandedRowKeys={[1]} />
          </div>
        </TabPane>
      </Tabs>

      <ObjDetailModal visible={visible.showObj} {...{handleCancel}}/>
      <PatrolDetailModal visible={visible.showPatrol} {...{handleCancel}}/>

    </div>
  )
}

export default Form.create()(DataStatistics);