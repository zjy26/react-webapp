import React, { useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Form, Modal, Input, Row, Col, Select, Radio, Upload } from 'antd';

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

const SiteModal = props => {
  const [form] = Form.useForm()

  useEffect(()=>{

  }, [])

  return (
    <Modal
      title= {props.title}
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
            <Form.Item label="站点名称" name="desc">
                <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系电话" name="telPhone">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="地址" name="address">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="车站类型" name="siteFunction">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="变电所类型" name="style">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="车站位置类型" name="locationType">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="建设期" name="buildPeriod">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="值守点" name="isDutyPoint">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="HT图形">
              <Upload
                  listType="picture-card"
                >
                </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="平面图">
              <Upload
                listType="picture-card"
              >
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>:
      <Form {...formItemLayout} form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="站点名称" name="desc">
              <Input placeholder="请输入站点名称"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系电话" name="telPhone">
              <Input placeholder="请输入联系电话"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="地址" name="address">
              <Input placeholder="请输入地址"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="车站类型" name="siteFunction">
              <Select placeholder="请选择车站类型"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="变电所类型" name="style">
              <Select placeholder="请选择变电所类型"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="车站位置类型" name="locationType">
              <Select placeholder="请选择车站位置类型"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="建设期" name="buildPeriod">
              <Input placeholder="请输入建设期"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="值守点" name="isDutyPoint">
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="HT图形">
              <Upload
                listType="picture-card"
              >
                <PlusOutlined />
              </Upload>
              <div>不超过20M,格式为jpg，png</div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="平面图">
              <Upload
                listType="picture-card"
              >
                <PlusOutlined />
              </Upload>
              <div>不超过20M,格式为jpg，png</div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      }
    </Modal>
  );
}

export default React.memo(SiteModal)
