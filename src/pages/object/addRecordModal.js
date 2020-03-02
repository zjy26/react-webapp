import React from 'react';
import { Modal,Form, Input, DatePicker } from 'antd';

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

const { confirm } = Modal;

function showConfirm() {
  confirm({
    title: '是否确认完成维护，确认后设备维护信息不能修改',
    onOk() {

    },
    onCancel() {},
  });
}

const AddRecordModal = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        showConfirm();
      }
    });
  };
  return (
    <Modal
      title="添加维护记录"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Form.Item label="开始时间">
          {getFieldDecorator('startTime', {
            rules: [{required: true}],
          })(<DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('leader')(<Input placeholder="请填写负责人"/>)}
        </Form.Item>
        <Form.Item label="完成时间">
          {getFieldDecorator('endTime', {
            rules: [{required: true}],
          })(<DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />)}
        </Form.Item>
        <Form.Item label="停用时长">
          {getFieldDecorator('outageTime')(<Input placeholder="请填写停用时长"/>)}
        </Form.Item>
        <Form.Item label="处理人员">
          {getFieldDecorator('DealPeople')(<Input placeholder="请填写处理人员"/>)}
        </Form.Item>
        <Form.Item label="维护记录">
          {getFieldDecorator('maintenanceRecord')(<Input.TextArea placeholder="请填写维护记录"/>)}
        </Form.Item>
        <Form.Item label="处理方案">
          {getFieldDecorator('dealPlan')(<Input.TextArea placeholder="请填写处理方案"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(AddRecordModal);