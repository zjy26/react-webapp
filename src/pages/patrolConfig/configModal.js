import React, {useRef, useImperativeHandle,forwardRef} from 'react';
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

const ConfigModal = (props, ref) => {
  const { getFieldDecorator } = props.form;
  const modalRef = useRef();

  useImperativeHandle(ref, () => {
    //暴露给父组件的方法
    return {
      editModal() {
        props.form.setFieldsValue(props.itemValues)
      }
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log(props.itemValues)
  };
  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      itemValues={props.itemValues}
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      ref = { modalRef }
    >
      <Form {...formItemLayout}>
        <Form.Item label="线路">
          {getFieldDecorator('line', {
            rules: [{required: true}],
          })(
          <Select placeholder="请选择线路">
            <Select.Option value="1117">17号线</Select.Option>
            <Select.Option value="1111">11号线</Select.Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="站点">
          {getFieldDecorator('site', {
            rules: [{required: true}],
          })(
          <Select placeholder="请选择站点">
            <Select.Option value="虹桥火车站">虹桥火车站</Select.Option>
            <Select.Option value="诸光路">诸光路</Select.Option>
          </Select>)}
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

export default Form.create()(forwardRef(ConfigModal));
