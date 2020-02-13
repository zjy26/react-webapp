import React from 'react';
import { Modal, Form, Input } from 'antd';

const AddModal = (props) => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <div>
      <Modal
        title="新建"
        okText="确认"
        cancelText="取消"
        visible={props.visible}
        onOk={handleSubmit}
        onCancel={props.handleCancel}
      >
        <Form>


        </Form>
      </Modal>
    </div>
  ); 
}
export default Form.create()(AddModal);
