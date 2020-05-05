import React, { useState, useEffect } from 'react'
import { setting } from '../../api/index'
import { UserOutlined } from '@ant-design/icons'
import {
  Form,
  Layout,
  Input,
  Button,
  Row,
  Col,
  Divider,
  Upload,
  Avatar,
  Typography,
  message,
} from 'antd'
const { Text, Title  } = Typography
const { TextArea } = Input
const { Content } = Layout

const Setting = () => {
  const [form] = Form.useForm()
  const [ initValues, setInitValues ] = useState({})
  const [ avatar, setAvatar ] = useState(null)

  useEffect(() => {
    setting.settingShow().then(res =>{
      if(res && res[0]) {
        setInitValues(res[0])
        form.resetFields()
      }
   })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      const fieldsValues = {...values};
      console.log(values)

      setting.settingEdit(fieldsValues.id, fieldsValues)
      .then(()=>{
        message.success("保存成功")
      })
    })
  }

  const uploadProps = {
    name: "avatar",
    action: "https://ant.design/upload.do",
    showUploadList: false,
    accept: "image/*",
    onChange: ({ file }) => {
      setAvatar("/images/Setting.png")  //设置默认图片
      console.log(file)
    }
  }

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Layout>
      <Content style={{ background: '#fff', padding: 34, margin: 0 }}>
        <Form
          form={form} 
          initialValues={initValues}
        >
          <Row>
            <Col span={7}>
              <Title level={4}>公开头像</Title>
              <Text>您可以在此处更改头像</Text>
            </Col>
            <Col span={1}></Col>
            <Col span={16}>

              <Row>
                <Col md={10} lg={8} xl={6}>
                  <Avatar size={160} icon={<UserOutlined />} src={avatar}/>
                </Col>
                <Col md={14} lg={16} xl={8}>
                  <Form.Item label="上传新头像"
                    name="avatar" 
                    colon={false} 
                    extra="允许的最大文件大小为200KB。"
                    valuePropName= 'file'
                    getValueFromEvent= {normFile}
                  >
                    <Upload {...uploadProps}>
                      <Button>选择文件...</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col span={7}>
              <Title level={4}>系统设置</Title>
              <Text>此信息将显示在您的个人资料中，以便想认识您的人更全面的了解您。</Text>
            </Col>
            <Col span={1}></Col>
            <Col span={16}>
              <Form.Item label="ID" name="id" rules={[{ required: true, message: '请输入ID'}]}>
                <Input disabled/>
              </Form.Item>
              <Form.Item label="默认站点" name="line" extra="输入您所处的站点" colon={false} rules={[{ required: true, message: ' '}]}>
                <Input
                  placeholder="17号线" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="语言" name="language" extra="请选择您最擅长的语言，以便更好的阅读" colon={false}>
                <Input
                  placeholder="简体中文" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="账号" name="username" extra="账号名注册后将不允许修改" colon={false}>
                <Input
                  placeholder="Wl97893012" style={{ width:'450px'}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col span={7}>
              <Title level={4}>联系方式</Title>
              <Text>此信息将显示在您的个人资料中，以便想认识您的人更快的联系到您。</Text>
            </Col>
            <Col span={1}></Col>
            <Col span={16}>
              <Form.Item label="通讯地址" name="location" colon={false}>
                <Input
                  placeholder="浙江省杭州市西湖区塘苗路18号" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="手机" name="mobile" colon={false}>
                <Input
                  placeholder="15888888888" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="邮箱" name="email" colon={false}>
                <Input
                  placeholder="xxxx@jiudaotech.com" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="QQ" name="QQ" colon={false}>
                <Input
                  placeholder="12345678" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="微信" name="Wechat" colon={false}>
                <Input
                  placeholder="xxx" style={{ width:'450px'}}
                />
              </Form.Item>
              <Form.Item label="自我描述" name="introduction" colon={false} extra="用不到250个字符告诉我们有关您自己的信息">
                <TextArea rows={4} placeholder="输入你的描述内容..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleSubmit}>更新配置内容</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </Layout>
  )
}

export default React.memo(Setting)
