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

  render() { 
    return (
      <Layout className='login'>
        <div className="model">
          <div className='login-form'>
            <h3>登录</h3>
            <Form>
              <Form.Item>
                账号<Input placeholder="A 请输入账号"/>
              </Form.Item>
              <Form.Item>
                密码<Input placeholder="P 请输入密码"/>
              </Form.Item>
              <Form.Item>
                验证码<Input placeholder="V 请输入验证码"/>
              </Form.Item>
              <Form.Item>
                <Link to="/home/index/"><Button type="primary" className='login-form-button'>登录</Button></Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
      
    );
  }
}

export default Login;