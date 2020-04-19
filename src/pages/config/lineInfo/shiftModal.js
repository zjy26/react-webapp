import React, {useEffect} from 'react'
import { Form, Modal, Input, DatePicker } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const ShiftModal = props => {
  const [form] = Form.useForm()

  useEffect(()=>{

  }, [])

  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="名称" name="descr" rules={[{required: true, message: '请输入名称'}]}>
          <Input placeholder="请输入名称"/>
        </Form.Item>
        <Form.Item label="开始时间" name="startTime" rules={[{required: true, message: '请选择开始时间'}]}>
          <DatePicker placeholder="请选择开始时间"/>
        </Form.Item>
        <Form.Item label="结束时间" name="entTime" rules={[{required: true, message: '请选择结束时间'}]}>
          <DatePicker placeholder="请选择结束时间"/>
        </Form.Item>
      </Form>

    </Modal>
  )
}

export default React.memo(ShiftModal)
