import React, {useEffect} from 'react'
import { Form, Modal, Input, Row, Col, Select } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const newFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const AnchorModal = props => {
  const [form] = Form.useForm()

  useEffect(()=>{
  }, [])

  return (
    <Modal
      title={props.title}
      width={props.title==="查看详情"?"700px":"520px"}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      {
        props.title === "查看详情" ?
        <Form {...formItemLayout} form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="序号" name="sn">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="锚段描述" name="descr">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="锚段号" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="锚段长度" name="length">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关联区间" name="interval">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>:
        <Form {...newFormItemLayout} form={form}>
          <Form.Item label="锚段描述" name="descr">
            <Input placeholder="请输入锚段描述"/>
          </Form.Item>
          <Form.Item label="锚段号" name="code" rules={[{required: true, message: '请输入锚段号'}]}>
            <Input placeholder="请输入锚段号"/>
          </Form.Item>
          <Form.Item label="锚段长度(米)" name="length">
            <Input placeholder="请输入锚段长度(米)"/>
          </Form.Item>
        </Form>
      }
    </Modal>
  )
}
export default React.memo(AnchorModal)

export const AssociatedPlace = props => {
  return (
    <Modal
      title="关联区间"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="请选择关联区间"
      >
      </Select>
    </Modal>
  )
}
