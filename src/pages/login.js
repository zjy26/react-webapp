import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Layout, Form, Input, Button } from 'antd';
import '../styles/login.css'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  login = () => {
    const { validateFields } = this.props.form
    validateFields((errors, values) => {
      console.log(errors, values)
    });
  }

  render() { 
    console.log(this.props)
    const {getFieldDecorator } = this.props.form
    return (
      <Layout className='login'>
        <div className="model">
          <div className='login-form'>
            <h3>登录</h3>
            <Form>
              <Form.Item label="账号">
              {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              type="password"
              placeholder="Password"
            />,
          )}
              </Form.Item>
              <Form.Item>
                密码<Input placeholder="P 请输入密码"/>
              </Form.Item>
              <Form.Item>
                验证码<Input placeholder="V 请输入验证码"/>
              </Form.Item>
              <Form.Item>
                <Link to="/home/index/"><Button type="primary" className='login-form-button' onClick={this.login}>登录</Button></Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
      
    );
  }
}

export default Form.create()(Login);