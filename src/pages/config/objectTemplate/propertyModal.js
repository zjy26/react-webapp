import React from 'react'
import { Modal, Form, Input, Row, Col, Select } from 'antd'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  }
}

//属性新增编辑弹窗
const CheckPropertyModal = props => {
  const [form] = Form.useForm()

  const handleOk = () => {

  }

  return (
    <Modal
      getContainer={false}
      title={props.title}
      okText="确认"
      cancelText="取消"
      width={800}
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleOk}
    >
      <Form form={form} {...formItemLayout}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="属性代码" name="code" rules={[{required: true, message: '请输入属性代码'}]}>
              <Input placeholder="请输入属性代码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性名称" name="descr">
              <Input placeholder="请输入属性名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性类型" name="source">
              <Select mode="multiple" placeholder="请选择属性类型" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性值" name="value">
              <Input placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="计量单位" name="uom">
              <Select placeholder="请选择计量单位" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="来源类型" name="sourceType">
              <Select placeholder="请选择来源类型" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性值" name="value">
              <Input placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性标准值" name="stdValue">
              <Input placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="故障原因" name="reason">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="处理方法" name="action">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remarks">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(CheckPropertyModal)

export const AssociatedPartsModal = props => {
  const [form] = Form.useForm()
  return (
    <Modal
      title="关联部件"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item label="部件名称" name="unitTemplate">
          <Select
            mode="multiple"
            placeholder="请选择部件名称"
          >
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
