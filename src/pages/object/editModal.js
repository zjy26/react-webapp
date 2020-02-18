import React from 'react';
import { Modal,Form, Input, Select, Row, Col } from 'antd';

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
const { Option } = Select;

const EditModal = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };
  return (
    <Modal
      title="批量修改"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Form.Item label="品牌名称">
          {getFieldDecorator('brandName', {
            rules: [{required: true}],
          })(
            <Select placeholder="请选选择品牌名称">
              <Option value="1">航天电源</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="型号">
          {getFieldDecorator('model', {rules: [{required: true}]} )(<Input placeholder="请输入型号"/>)}
        </Form.Item>
        <Form.Item label="总运行时长">
          {getFieldDecorator("runningTime", {rules: [{required: true}]})(
            <Row>
              <Col span={21}><Input placeholder="请输入总运行时长" /></Col>
              <Col span={3} style={{textAlign: "center"}}>小时</Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item label="总运行里程">
          {getFieldDecorator("runningMiles", {rules: [{required: true}]})(
            <Row>
              <Col span={21}><Input placeholder="请输入总运行里程" /></Col>
              <Col span={3} style={{textAlign: "center"}}>米</Col>
            </Row>
          )}
        </Form.Item>
        <Form.Item label="属性代码">
          {getFieldDecorator('attributeCode')(<Input placeholder="请输入属性代码"/>)}
        </Form.Item>
        <Form.Item label="属性描述">
          {getFieldDecorator('attributeDescr')(<Input.TextArea placeholder="请输入属性描述"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(EditModal);