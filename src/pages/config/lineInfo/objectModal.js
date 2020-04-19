import React, {useEffect} from 'react'
import { Form, Modal, Input, Select } from 'antd'

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

const ObjectModal = props => {
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
        <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请输入设备分类'}]}>
          <Input placeholder="请输入设备分类"/>
        </Form.Item>
        <Form.Item label="品牌" name="brand">
          <Select placeholder="请选择品排"/>
        </Form.Item>
        <Form.Item label="型号" name="modelNumber">
          <Input placeholder="请输入型号"/>
        </Form.Item>
        <Form.Item label="规格" name="spec">
          <Input placeholder="请输入规格"/>
        </Form.Item>
      </Form>

    </Modal>
  )
}

export default React.memo(ObjectModal)
