import React, { useState } from 'react';
import { Modal, Form, Button, Input, Select, Row, Col, Tabs, DatePicker, Table, Badge } from 'antd';
import AddObjModal from '../common/addObjModal';
import AddPatrolItemModal from '../common/addPatrolItemModal';

const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const columns = [
  { title: '房间位置', dataIndex: 'rommLocation', key: 'rommLocation' },
  { title: '设备名称', dataIndex: 'objName', key: 'objName' },
  { title: '抽屉', dataIndex: 'drawer', key: 'drawer' },
  { title: '杂散', dataIndex: 'stray', key: 'stray' },
  { title: '操作', key: 'operation', 
    render: () => <span>
      <Button type="link" size={'small'}>编辑</Button>&nbsp;&nbsp;
      <Button type="link" size={'small'}>删除</Button>
    </span>
  },
];

const data = [{
  key: 1,
  rommLocation: '35KV开关柜',
  objName: '2号变压器',
  drawer: '-',
  stray: '-'
}];

const AddModal = (props) => {
  const { getFieldDecorator } = props.form;
  const [visible, setVisible] = useState({
    showAddObj: false,
    showAddPatrolItem: false
  });
  const handleCancel = () => {
    setVisible({
      showAddObj: false,
      showAddPatrolItem: false
    });
  }
  const [activeKey, setActiveKey] = useState("1");  //设置显示tab

  const expandedRowRender = () => {
    const columns = [
      { title: '属性', dataIndex: 'attribute', key: 'attribute',
        render: (text) => (
          <span>
            <Badge status="success" />
            {text}
          </span>
        )
      },
      { title: '监测点类型', dataIndex: 'monitorType', key: 'monitorType' },
      { title: '报警上限', dataIndex: 'alarmTop', key: 'alarmTop' },
      { title: '报警下限', dataIndex: 'alarmLower', key: 'alarmLower' },
      { title: '正常值', dataIndex: 'normalVal', key: 'normalVal' },
      { title: '正常值描述', dataIndex: 'normalDescr', key: 'normalDescr' },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: () => <span><Button type="link" size={'small'}>编辑</Button>&nbsp;&nbsp;<Button type="link" size={'small'}>删除</Button></span>
      },
    ];

    //嵌套表格
    const data = [{
      key: 1,
      attribute: "开关",
      monitorType: "遥视模拟量",
      alarmTop: 111,
      alarmLower: 11,
      normalVal: 100,
      normalDescr: "描述描述……"
    }, {
      key: 2,
      attribute: "电源指示",
      monitorType: "遥视模拟量",
      alarmTop: 111,
      alarmLower: 11,
      normalVal: 100,
      normalDescr: "描述描述……"
    }, {
      key: 3,
      attribute: "开关",
      monitorType: "遥视模拟量",
      alarmTop: 121,
      alarmLower: 11,
      normalVal: 100,
      normalDescr: "描述描述……"
    }];

    return (
      <div>
        <Row type="flex" justify="end"><Button onClick={()=>{setVisible({...visible, showAddPatrolItem:true})}}>新增巡检项</Button></Row>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    )
  };

  return (
    <Modal
      footer={null}
      width={document.body.clientWidth-100}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <div>
        <Tabs tabPosition="left"  activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}}>
          <TabPane tab="基本信息" key="1">
            <Form {...formItemLayout} >
              <Row gutter={24}>
                <Col span={24}>
                  <label style={{fontSize:18, marginRight:20}}>基本信息</label>
                </Col>
                <Col span={12}>
                  <Form.Item label="巡检名称">
                    {getFieldDecorator("patrolName", {
                      rules: [{required: true}],
                    })(<Input placeholder="请输入巡检名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点">
                    {getFieldDecorator("site", {
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选择站点" >
                        <Option value="1">诸光路</Option>
                        <Option value="2">控制中心</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="负责人">
                    {getFieldDecorator("patrolPeople", {
                      rules: [{required: true}],
                    })(
                      <Input placeholder="请输入负责人姓名" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="巡检时间">
                    {getFieldDecorator('patrolTime', {
                      rules: [{required: true}],
                    })(
                      <DatePicker />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row type="flex" justify="end">
              <Col span={2}><Button onClick={props.handleCancel}>取消</Button></Col>
              <Col span={2}><Button type="danger" onClick={()=>{setActiveKey("2")}}>下一步</Button></Col>
            </Row>
          </TabPane>
          <TabPane tab="设备信息" key="2">
            <Form>
              <Col span={10}>
                <Form.Item>
                  {getFieldDecorator('objectName')(
                    <Input placeholder="请选择设备/属性名称" />,
                  )}
                </Form.Item>
              </Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">筛选</Button>
              </Form.Item>
            </Form>
            <Row>
              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>设备信息</label>
                <Button type="primary" ghost onClick={ ()=>{setVisible({...visible, showAddObj:true})} } >新增</Button>
                <Table
                  columns={columns}
                  expandedRowRender={expandedRowRender}
                  dataSource={data}
                  pagination={false}
                  defaultExpandAllRows = {true}
                />
              </Col>
            </Row>
            <Row type="flex" justify="end" style={{marginTop:30}}>
              <Col span={2}><Button onClick={props.handleCancel}>取消</Button></Col>
              <Col span={2}><Button type="danger">确定</Button></Col>
            </Row>
          </TabPane>
        </Tabs>
        <AddObjModal visible={visible.showAddObj} {...{handleCancel}}/>
        <AddPatrolItemModal visible={visible.showAddPatrolItem} {...{handleCancel}}/>
      </div>
    </Modal>
  )
}

export default Form.create()(AddModal);
