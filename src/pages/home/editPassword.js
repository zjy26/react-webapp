import React, { useRef, useImperativeHandle, forwardRef }from 'react';
import { Modal, Form, Icon, Input, Button, Checkbox } from 'antd';

const EditPassword = (props, ref) => {
  const modalRef = useRef();
  console.log("*******", modalRef)
   
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        props.handleOk(values)
      }
    });
  };


  useImperativeHandle(ref, () => ({
    focus: () => {
      modalRef.current.focus();
    }
  }));

  return (
    <div>
      <Modal
        title="修改密码"
        visible={props.visible}
        onOk={handleSubmit}
        onCancel={props.handleCancel}
        ref = { modalRef }
      >
        <Form className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  ); 
}
export default forwardRef(EditPassword);
