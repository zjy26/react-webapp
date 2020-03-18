import React, { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { robotObject } from '../../api'
import moment from "moment"
import store from '../../store';

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


const ChangeStatusModal = props => {
  const [status, setStatus] = useState(null)
  const { getFieldDecorator } = props.form

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        robotObject.changeState({
          ...values,
          id:props.currentId,
          startDate: moment(new Date(values.startDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
          endDate: moment(new Date(values.endDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
        })
        .then((res)=>{
          message.success("状态已变更")
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
        })
        .catch(() => {
          console.log("状态变更失败")
        })
      }
    })
  }

  return (
    <Modal
      title="变更状态"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onOk={handleSubmit}
      onCancel={props.handleCancel}
      currentId={props.currentId}
      setDirty={props.setDirty}
    >
      <Form {...formItemLayout}>
        <Form.Item label="变更状态">
          {getFieldDecorator('robotStatus', {
            rules: [{required: true}],
          })(
            <Select placeholder="请选择变更状态" onChange={(value)=>{setStatus(value)}}>
              {store.getState().robotObjectStatus && store.getState().robotObjectStatus.map(item => (
                <Select.Option key={item.code} value={item.code}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <div>{(() => {
          switch (status) {
            case "02":
              return <div>
                <Form.Item label="计划名称">
                  {getFieldDecorator('planName', {rules: [{required: true}]})(<Input placeholder="请填写计划名称"/>)}
                </Form.Item>
                <Form.Item label="站点">
                  {getFieldDecorator('site', {rules: [{required: true}]})(<Input placeholder="请填写线路站点"/>)}
                </Form.Item>
                <Form.Item label="负责人">
                  {getFieldDecorator('principal', {rules: [{required: true}]})(<Input placeholder="请填写负责人"/>)}
                </Form.Item>
              </div>
            case "04":
              return <div>
                <Form.Item label="开始时间">
                  {getFieldDecorator('startDate', {
                    rules: [{required: true}],
                  })(<DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />)}
                </Form.Item>
                <Form.Item label="负责人">
                  {getFieldDecorator('principal')(<Input placeholder="请填写负责人"/>)}
                </Form.Item>
                <Form.Item label="完成时间">
                  {getFieldDecorator('endDate', {
                    rules: [{required: true}],
                  })(<DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />)}
                </Form.Item>
                <Form.Item label="停用时长">
                  {getFieldDecorator('outageTime')(<Input placeholder="请填写停用时长"/>)}
                </Form.Item>
                <Form.Item label="处理人员">
                  {getFieldDecorator('executor')(<Input placeholder="请填写处理人员"/>)}
                </Form.Item>
                <Form.Item label="维护记录">
                  {getFieldDecorator('maintenance')(<Input.TextArea placeholder="请填写维护记录"/>)}
                </Form.Item>
                <Form.Item label="处理方案">
                  {getFieldDecorator('dispose')(<Input.TextArea placeholder="请填写处理方案"/>)}
                </Form.Item>
            </div>
            case "06":
              return <Form.Item label="停用时间">
                {getFieldDecorator('endDate', {
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
