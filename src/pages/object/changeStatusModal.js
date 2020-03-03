import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const { Option } = Select;

const ChangeStatusModal = props => {
  const [status, setStatus] = useState(null);
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      title="文件导入"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label="变更状态">
          {getFieldDecorator('changeStatus', {
            rules: [{required: true}],
          })(
            <Select placeholder="请选择变更状态" onChange={(value)=>{setStatus(value)}}>
              <Option value="1">空闲中</Option>
              <Option value="2">巡检中</Option>
              <Option value="3">维护中</Option>
              <Option value="4">已停用</Option>
            </Select>
          )}
        </Form.Item>
        <div>{(() => {
          switch (status) {
            case "2":
              return <div>
                <Form.Item label="计划名称">
                  {getFieldDecorator('planName', {rules: [{required: true}]})(<Input placeholder="请填写计划名称"/>)}
                </Form.Item>
                <Form.Item label="站点">
                  {getFieldDecorator('site', {rules: [{required: true}]})(<Input placeholder="请填写线路站点"/>)}
                </Form.Item>
                <Form.Item label="负责人">
                  {getFieldDecorator('leader', {rules: [{required: true}]})(<Input placeholder="请填写负责人"/>)}
                </Form.Item>
              </div>
            case "3":
              return <div>
                <Form.Item label="开始时间">
                  {getFieldDecorator('startTime', {
                    rules: [{required: true}],
                  })(<DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />)}
                </Form.Item>
                <Form.Item label="负责人">
                  {getFieldDecorator('leader')(<Input placeholder="请填写负责人"/>)}
                </Form.Item>
                <Form.Item label="完成时间">
                  {getFieldDecorator('endTime', {
                    rules: [{required: true}],
                  })(<DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />)}
                </Form.Item>
                <Form.Item label="停用时长">
                  {getFieldDecorator('outageTime')(<Input placeholder="请填写停用时长"/>)}
                </Form.Item>
                <Form.Item label="处理人员">
                  {getFieldDecorator('DealPeople')(<Input placeholder="请填写处理人员"/>)}
                </Form.Item>
                <Form.Item label="维护记录">
                  {getFieldDecorator('maintenanceRecord')(<Input.TextArea placeholder="请填写维护记录"/>)}
                </Form.Item>
                <Form.Item label="处理方案">
                  {getFieldDecorator('dealPlan')(<Input.TextArea placeholder="请填写处理方案"/>)}
                </Form.Item>
            </div>
            case "4":
              return <Form.Item label="停用时间">
                {getFieldDecorator('stopTime', {
                  rules: [{required: true}],
                })(<DatePicker showTime placeholder="请选择停用时间" style={{width: "315px"}} />)}
              </Form.Item>
            default:
              return null
          }
        }
        )()}</div>
      </Form>
    </Modal>
  )
}

export default Form.create()(ChangeStatusModal);