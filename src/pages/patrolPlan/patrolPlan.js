import React, { useState } from 'react';
import Axios from 'axios';
import { Form, Button, Input, Select, Row, Col, Tabs, DatePicker, InputNumber } from 'antd';
import AddObjModal from './addObjModal';

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

const PatrolPlan = props => {
  const [edit, setEdit] = useState({
    basicEdit: false,
    cycleEdit: false
  });
  const { getFieldDecorator } = props.form;
  const [selectedItems, setItems] = useState([]);
  const [visible, setVisible] = useState({
    showAddObj: false
  });
  const handleCancel = () => {
    setVisible({
      showAddObj: false
    });
  }
  const filteredOptions = weekOption.filter(o => !selectedItems.includes(o));
  const selectChange = selectedItems => {
    setItems( selectedItems )
  };

  return (
    <div>
      <Tabs tabPosition="left" defaultActiveKey="1">
        <TabPane tab="Tab1" key="1">
          <Form {...formItemLayout} >
            <Row gutter={24}>
              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>基本信息</label>
                {
                  edit.basicEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost>保存</Button>
                    <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:false}) }}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="计划名称">
                  {getFieldDecorator("patrolName", {
                    rules: [{required: true}],
                  })(<Input placeholder="请输入计划名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="线路">
                  {getFieldDecorator("line", {
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

              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>计划周期</label>
                {
                  edit.cycleEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, cycleEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost>保存</Button>
                    <Button type="primary" ghost onClick={()=>{ setEdit({...edit, cycleEdit:false}) }}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="周期">
                  {getFieldDecorator('cycle', {
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
                  {getFieldDecorator('startTime', {rules: [{required: true}]} )(
                    <DatePicker showTime placeholder="请选择开始时间" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="开始时间">
                  {getFieldDecorator('endTime', {rules: [{required: true}]} )(
                    <DatePicker showTime placeholder="请选择结束时间" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="启动时间">
                  {getFieldDecorator('startTime', {rules: [{required: true}]} )(
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
                      <Button shape="circle" icon="plus"/>
                      <Button shape="circle" icon="minus" />
                    </span>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="巡检时间">
                  {getFieldDecorator('time', {
                    rules: [{required: true}],
                  })(
                    <span>
                      <InputNumber min={1} max={24} style={{ width: '25%' }}/>时
                      <InputNumber min={0} max={59} style={{ width: '25%' }}/>分
                      <Button shape="circle" icon="plus" />
                      <Button shape="circle" icon="minus" />
                    </span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="Tab2" key="2">
          <Form>
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator('objectName', {
                  rules: [],
                })(
                  <Input placeholder="请选择设备/属性名称" />,
                )}
              </Form.Item>
            </Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">筛选</Button>
            </Form.Item>
          </Form>
          <Col span={24}>
            <label style={{fontSize:18, marginRight:20}}>设备信息</label>
            <Button type="primary" ghost onClick={ ()=>{setVisible({...visible, showAddObj:true})} } >新增</Button>
          </Col>

        </TabPane>
      </Tabs>
      <AddObjModal visible={visible.showAddObj} {...{handleCancel}}/>
    </div>
  )
}

export default Form.create()(PatrolPlan);