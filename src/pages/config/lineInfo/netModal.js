import React, { useEffect } from 'react'
import { Form, Modal, Input, Row, Col, Select, Radio } from 'antd'

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

const NetModal = props => {
  const [form] = Form.useForm()

  useEffect(()=>{
  }, [])

  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      width="700px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      {
        props.title === "查看详情" ?
        <Form {...formItemLayout} form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="区间名称" name="descr">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点1名称" name="site1">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点2名称" name="site2">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="行车路线" name="vehicleRoute">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="触网类型" name="catenaryType">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否长/大区间" name="isLarge">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有无区间所" name="hasIntervalPlace">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>:
        <Form {...formItemLayout} form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="区间名称" name="descr">
                <Input placeholder="请输入区间名称"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点1名称" name="site1">
                <Select placeholder="请选择站点1名称"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点2名称" name="site2">
                <Select placeholder="请选择站点2名称"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="行车路线" name="vehicleRoute">
                <Input placeholder="请输入行车路线"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="触网类型" name="catenaryType">
                <Select placeholder="请选择触网类型"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否长/大区间" name="isLarge">
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有无区间所" name="hasIntervalPlace">
                <Radio.Group>
                  <Radio value={true}>有</Radio>
                  <Radio value={false}>无</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
    </Modal>
  )
}

export default React.memo(NetModal)
