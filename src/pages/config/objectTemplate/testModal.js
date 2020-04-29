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
const CheckTestModal = props => {
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
            <Form.Item label="属性代码" name="property">
              <Input placeholder="请输入属性代码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性名称" name="descr">
              <Input placeholder="请输入属性名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="标准值" name="stdValue">
              <Input placeholder="请输入标准值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="计量单位" name="uom">
              <Select placeholder="请选择计量单位" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="动作时限" name="actTimeLimit">
              <Input placeholder="请输入动作时限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="动作计量单位" name="actUom">
              <Select placeholder="请选择动作计量单位" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(CheckTestModal)
