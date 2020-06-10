/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { robotObject, people } from '../../../api'
import moment from "moment"

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
  const [form] = Form.useForm()
  const [peoples,setPeoples] = useState(null)

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      robotObject.changeState({
        ...values,
        _method:'PUT',
        id: props.selectedCodes.toString(),
        startDate: moment(values.startDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(values.endDate).format('YYYY-MM-DD HH:mm:ss')
      })
      .then((res)=>{
        if(res.success){
          message.success("状态已变更")
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
          form.resetFields()
        }else{
          message.success("状态变更失败")
          props.handleCancel()
        }
      })
      .catch(() => {
        console.log("状态变更失败")
      })

    })
  }

  //获取列表数据
useEffect(() => {
  if(props.visible === true) {
    form.resetFields()
  }
  people()
  .then(res => {
    if(res && res.models)
    {
      setPeoples(res.models)

    }

})
},[props.visible])

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="变更状态"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onOk={handleSubmit}
      onCancel={props.handleCancel}
      setDirty={props.setDirty}
      robotObjectStatus={props.robotObjectStatus}
    >
      <Form {...formItemLayout} form={form} name="changeStateFrom">
        <Form.Item label="变更状态" name="robotStatus" rules={[{required: true, message: '请选择变更状态'}]}>
          <Select placeholder="请选择变更状态" onChange={(value)=>{setStatus(value)}}>
            {props.robotObjectStatus && props.robotObjectStatus.map(item => (
              <Select.Option key={item.code} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div>{(() => {
          switch (status) {
            case "02":
              return <div>
                <Form.Item label="计划名称" name="desc" rules={[{required: true, message: '请填写计划名称'}]}>
                  <Input placeholder="请填写计划名称"/>
                </Form.Item>
                <Form.Item label="负责人" name="people" rules={[{required: true, message: '请选择负责人'}]}>
                  <Select placeholder="请选择负责人">
                  { peoples.length>0 && peoples.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  }
                  </Select>
                </Form.Item>
              </div>
            case "04":
              return <div>
                <Form.Item label="开始时间" name="startDate" rules={[{required: true, message: '请选择开始时间'}]}>
                  <DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />
                </Form.Item>
                <Form.Item label="负责人" name="principal">
                  <Input placeholder="请填写负责人"/>
                </Form.Item>
                <Form.Item label="完成时间" name="endDate" rules={[{required: true, message: '请选择完成时间'}]}>
                  <DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />
                </Form.Item>
                <Form.Item label="停用时长" name="outageTime">
                  <Input placeholder="请填写停用时长"/>
                </Form.Item>
                <Form.Item label="处理人员" name="executor">
                  <Input placeholder="请填写处理人员"/>
                </Form.Item>
                <Form.Item label="维护记录" name="maintenance">
                  <Input.TextArea placeholder="请填写维护记录"/>
                </Form.Item>
                <Form.Item label="处理方案" name="dispose">
                  <Input.TextArea placeholder="请填写处理方案"/>
                </Form.Item>
            </div>
            case "06":
              return <Form.Item label="停用时间" name="endDate" rules={[{required: true, message: '请选择停用时间'}]}>
                <DatePicker showTime placeholder="请选择停用时间" style={{width: "315px"}} />
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

export default React.memo((ChangeStatusModal))
