import React from 'react';
import { Modal,Form, Input, Select } from 'antd';

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

const ConfigModal = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();

  };
  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Form.Item label="线路">
          {getFieldDecorator('line', {
            rules: [{required: true}],
          })(<Select placeholder="请选择线路"/>)}
        </Form.Item>
        <Form.Item label="站点">
          {getFieldDecorator('site', {
            rules: [{required: true}],
          })(<Select placeholder="请选择站点"/>)}
        </Form.Item>
        <Form.Item label="服务器IP">
          {getFieldDecorator('serverIp', {
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器IP"/>)}
        </Form.Item>
        <Form.Item label="服务器端口">
          {getFieldDecorator('serverPort', {
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器端口"/>)}
        </Form.Item>
        <Form.Item label="视频流推送">
          {getFieldDecorator('videoUrl', {
            rules: [{required: true}],
          })(<Input placeholder="请输入视频流推送"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(ConfigModal);