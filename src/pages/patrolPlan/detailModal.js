import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Modal,
  Button,
  Input,
  Select,
  Row,
  Col,
  Tabs,
  DatePicker,
  InputNumber,
  Table,
  Badge,
} from 'antd';
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

const weekOption = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

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

const DetailModal = (props, ref) => {
  const [edit, setEdit] = useState({
    basicEdit: false,
    cycleEdit: false
  });
  const { getFieldDecorator, resetFields } = props.form;
  const [selectedItems, setItems] = useState([]);
  const [visible, setVisible] = useState({
    showAddObj: false,
    showAddPatrolItem: false
  });
  const [activeKey, setActiveKey] = useState("1");  //设置显示tab
  const [obj, setObj] = useState({});
  const modalRef = useRef();
  const handleCancel = () => {
    setVisible({
      showAddObj: false,
      showAddPatrolItem: false
    });
  }
  const filteredOptions = weekOption.filter(o => !selectedItems.includes(o));
  const selectChange = selectedItems => {
    setItems( selectedItems )
  };

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

  useImperativeHandle(ref, () => {
    //暴露给父组件的方法
    return {
      check() {
        resetFields();
        setObj(props.itemValues);
      },

      resetForm() {
        setObj({});
        resetFields();
      }
    }
  });

  return (
    <Modal
      footer={null}
      width={document.body.clientWidth-100}
      visible={props.visible}
      onCancel={props.handleCancel}
      itemValues = {props.itemValues}
      modalStatus= {props.modalStatus}
      ref = { modalRef }
    >
      <div>
        <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}}>
          <TabPane tab="基本信息" key="1">
            <Form {...formItemLayout} >
              <Row gutter={24}>
                <Col span={24}>
                  <label style={{fontSize:18, marginRight:20}}>基本信息</label>
                  {
                    props.modalStatus === "check" ?
                    edit.basicEdit === false ?
                    <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:true}) }}>编辑</Button> :
                    <span>
                      <Button type="primary" ghost>保存</Button>
                      <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:false}) }}>取消</Button>
                    </span>:
                    null
                  }
                </Col>
                <Col span={12}>
                  <Form.Item label="计划名称">
                    {getFieldDecorator("patrolName", {
                      initialValue: obj.patrolName,
                      rules: [{required: true,}],
                    })(<Input placeholder="请输入计划名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="线路">
                    {getFieldDecorator("line", {
                      initialValue: obj.line,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选择线路" >
                        <Option value="1117">17号线</Option>
                        <Option value="1111">11号线</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点">
                    {getFieldDecorator("site", {
                      initialValue: obj.site,
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
                      initialValue: obj.patrolPeople,
                      rules: [{required: true}],
                    })(
                      <Input placeholder="请输入负责人姓名" />
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <label style={{fontSize:18, marginRight:20}}>计划周期</label>
                  {
                    props.modalStatus === "check" ?
                    edit.cycleEdit === false ?
                    <Button type="primary" ghost onClick={()=>{ setEdit({...edit, cycleEdit:true}) }}>编辑</Button> :
                    <span>
                      <Button type="primary" ghost>保存</Button>
                      <Button type="primary" ghost onClick={()=>{ setEdit({...edit, cycleEdit:false}) }}>取消</Button>
                    </span>:
                    null
                  }
                </Col>
                <Col span={12}>
                  <Form.Item label="周期">
                    {getFieldDecorator('cycle', {
                      initialValue: obj.cycle,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选选周期">
                        <Option value="1">手动</Option>
                        <Option value="2">星期</Option>
                        <Option value="3">日</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="开始时间">
                    {getFieldDecorator('startTime', {
                      initialValue: obj.startTime,
                      rules: [{required: true}]
                    })(
                      <DatePicker showTime placeholder="请选择开始时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="开始时间">
                    {getFieldDecorator('endTime', {
                      initialValue: obj.endTime,
                      rules: [{required: true}]
                    })(
                      <DatePicker showTime placeholder="请选择结束时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="启动时间">
                    {getFieldDecorator('startTime', {
                      initialValue: obj.startTime,
                      rules: [{required: true}]
                    })(
                      <span>
                        <InputNumber min={1} max={24} style={{ width: '25%' }}/>时
                        <InputNumber min={0} max={59} style={{ width: '25%' }}/>分
                        <InputNumber min={0} max={59} style={{ width: '25%' }}/>秒
                      </span>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="星期">
                    {getFieldDecorator('week', {
                      initialValue: obj.week,
                      rules: [{required: true}],
                    })(
                      <span>
                        <Select
                          mode="multiple"
                          placeholder="请选择星期"
                          value={selectedItems}
                          onChange={selectChange}
                          style={{ width: '70%' }}
                        >
                          {filteredOptions.map(item => (
                            <Select.Option key={item} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                        <Button shape="circle" icon={<PlusOutlined />}/>
                        <Button shape="circle" icon={<MinusOutlined />} />
                      </span>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="巡检时间">
                    {getFieldDecorator('time', {
                      initialValue: obj.time,
                      rules: [{required: true}],
                    })(
                      <span>
                        <InputNumber min={1} max={24} style={{ width: '25%' }}/>时
                        <InputNumber min={0} max={59} style={{ width: '25%' }}/>分
                        <Button shape="circle" icon={<PlusOutlined />} />
                        <Button shape="circle" icon={<MinusOutlined />} />
                      </span>
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
                  {getFieldDecorator('objectName', {
                    initialValue: obj.objectName,
                  })(
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
  );
}

export default Form.create()(forwardRef(DetailModal));