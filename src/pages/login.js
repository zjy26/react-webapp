import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return (
      <div>
        <Form className="loginForm">
          <Form.Item>
            <Input placeholder="账号"/>
          </Form.Item>
          <Form.Item>
            <Input placeholder="密码"/>
          </Form.Item>
          <Form.Item>
            <Input placeholder="验证码"/>
          </Form.Item>
          <Form.Item>
            <Link to="/home/index/"><Button type="primary">登录</Button></Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Login;