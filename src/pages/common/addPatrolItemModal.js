import React from 'react';
import { Modal, Form, Select, Button, Input } from 'antd';

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
const {Option} = Select;

const AddPatrolItemModal = props => {
  const { getFieldDecorator } = props.form;

  return (
    <Modal
      title="添加设备"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label="属性">
          {getFieldDecorator("attribute", {
            rules: [{required: true}],
          })(
            <span>
              <Select placeholder="请选择物理位置编码" style={{ width: '70%' }}>
                <Option value="1">开关</Option>
                <Option value="2">电源指示</Option>
              </Select>
              <Button shape="circle" icon="plus"/>
              <Button shape="circle" icon="minus" />
            </span>
          )}
        </Form.Item>

        <Form.Item label="警报上限">
          {getFieldDecorator('alarmTop')(
            <Input placeholder="请输入正常值警报上限" />
          )}
        </Form.Item>
        <Form.Item label="警报下限">
          {getFieldDecorator('alarmLower')(
            <Input placeholder="请输入警报下限" />
          )}
        </Form.Item>
        <Form.Item label="正常值">
          {getFieldDecorator('normalVal')(
            <Input placeholder="请输入正常值" />
          )}
        </Form.Item>
        <Form.Item label="正常值描述">
          {getFieldDecorator('normalDescr')(
            <Input.TextArea placeholder="请输入正常值描述" />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(AddPatrolItemModal);