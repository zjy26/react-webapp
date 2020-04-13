import React, { useState, useEffect, useRef } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, message, Col, Row } from 'antd';
import Axios from 'axios';
import style from './Login.module.scss';
import GVerify from './gVerify';

const Login = props => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { getFieldDecorator } = props.form;
  const verifyCode = useRef(null);

  useEffect(() => {
    verifyCode.current = new GVerify('v_container'); //创建验证码
    Axios.get('/api/login').then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false)
      }
    }).catch((err) =>{
        setLoading(true)
    });

    return () => {
      verifyCode.current = null;
    };
  }, []);
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {

        //TODO 使用axios发送POST请求

        // 检测用户名是否存在
        const result = data.find(item => item.username === values.username)
        if (!result) {
          props.form.setFields({
            username: {
              value: values.username,
              errors: [new Error('用户名不存在')]
            }
          })
          return
        } else {
          //检测密码是否错误
          if (result.password !== values.password) {
            props.form.setFields({
              password: {
                value: values.password,
                errors: [new Error('密码错误')]
              }
            })
            return
          } else {
            if(values.captcha.length <4) {
              props.form.setFields({
                captcha: {
                  value: values.captcha,
                  errors: [new Error('验证码错误')]
                }
              })
              return
            }
          }
        }

        //TODO 权限校验 模拟接口返回用户权限标识
        switch (values.username) {
          case 'admin':
            values.auth = "admin"
            break
          default:
            values.auth = "guest"
        }

        localStorage.setItem('user', JSON.stringify(result));
        localStorage.setItem('token', 'token');
        message.success("登录成功");
        props.history.push("/home");
      } else {
        return
      }
    });
  }

  return (
    <div className={style.login}>
      <div className={style.loginPanel}>
        <h2>登录</h2>
        <Form onSubmit={handleSubmit} className={style.loginForm}>
          <label>账号</label>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, whitespace: true, message: '请输入账号' }],
            })(
              <Input placeholder="admin" />,
            )}
          </Form.Item>
          <label>密码</label>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, whitespace: true, message: '请输入密码' }],
            })(
              <Input type="password" placeholder="1" />,
            )}
          </Form.Item>
          <Col span={24}>
            <label>验证码</label>
          </Col>
          <Form.Item>
            {getFieldDecorator('captcha', {
              rules: [
                { required: true, whitespace: true, message: '请输入验证码' },
                {
                  validator: (rule, value, callback) => {
                    if (value.length >= 4 && !verifyCode.current.validate(value)) {
                      callback('验证码错误')
                    }
                    callback()
                  }
                }
              ],
            })(
              <Row gutter={8} style={{ marginBottom:2 }}>
                <Col span={16}>
                  <Input placeholder='请输入验证码'/>
                </Col>
                <Col span={8}>
                  <div id='v_container' />
                </Col>
              </Row>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Form.create()(Login);