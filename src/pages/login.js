import React, { useState, useEffect, useRef } from 'react'
import { Form, Input, Button, message, Col, Row } from 'antd'
import { login } from '../api/index'
import style from './Login.module.scss'
import GVerify from './gVerify'

const Login = props => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const verifyCode = useRef(null)

  useEffect(() => {
    verifyCode.current = new GVerify('v_container') //创建验证码
    login().then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false)
      }
    }).catch(() =>{
        setLoading(true)
    })

    return () => {
      verifyCode.current = null
    };
  }, [])

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      //TODO 使用axios发送POST请求

      // 检测用户名是否存在
      const result = data.find(item => item.username === values.username)

      //TODO 权限校验 模拟接口返回用户权限标识
      switch (values.username) {
        case 'admin':
          values.auth = "admin"
          break
        default:
          values.auth = "guest"
      }

      localStorage.setItem('user', JSON.stringify(result))
      localStorage.setItem('token', 'token')
      message.success("登录成功")
      props.history.push("/home")
    })
    .catch(()=>{
      return
    })
  }

  return (
    <div className={style.login}>
      <div className={style.loginPanel}>
        <h2>登录</h2>
        <Form form={form} onFinish={handleSubmit} className={style.loginForm}>
          <label>账号</label>
          <Form.Item name="username" rules={[{ required: true, whitespace: true, message: '请输入账号' }]}>
            <Input placeholder="admin" />
          </Form.Item>
          <label>密码</label>
          <Form.Item name="password" rules={[{ required: true, whitespace: true, message: '请输入密码' }]}>
            <Input type="password" placeholder="1" />
          </Form.Item>
          <Col span={24}>
            <label>验证码</label>
          </Col>
          <Form.Item 
            name="captcha"
            rules={[
              { required: true, whitespace: true, message: '请输入验证码' },
              {
                validator: async(rule, value) => {
                  if (value.length >= 4 && !verifyCode.current.validate(value)) {
                    throw new Error('验证码错误')
                  }
                }
              }
            ]}>
              <Row gutter={8} style={{ marginBottom:2 }}>
                <Col span={16}>
                  <Input placeholder='请输入验证码'/>
                </Col>
                <Col span={8}>
                  <div id='v_container' />
                </Col>
              </Row>
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

export default React.memo(Login)