import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { UserOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
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
} from 'antd';
const { Text, Title  } = Typography;
const { TextArea } = Input;
const { Content } = Layout;

const Setting = (props) => {
  const [ avatar, setAvatar ] = useState(null);
  const { getFieldDecorator } = props.form;

  useEffect(() => {
    Axios.get('/api/setting').then(res =>{
      if(res.status === 200){
        props.form.setFieldsValue( res.data[0] );
      }
   }).catch((err) =>{

   })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const fieldsValues = {...values};
        console.log(fieldsValues)
        Axios.put('/api/setting/'+fieldsValues.id, fieldsValues
        ).then((res)=>{

        })
        message.success("保存成功");
      }
    });
  };

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
    <div>
      <Layout>
        <Content style={{ background: '#fff', padding: 34, margin: 0 }}>
          <Row>
            <Col span={7}>
              <Title level={4}>公开头像</Title>
              <Text >您可以在此处更改头像</Text >
            </Col>
            <Col span={1}></Col>
            <Col span={16}>

              <Row>
                <Col md={10} lg={8} xl={6}>
                  <Avatar size={160} icon={<UserOutlined />} src={avatar}/>
                </Col>
                <Col md={14} lg={16} xl={8}>
                  <Form.Item label="上传新头像" colon={false} extra="允许的最大文件大小为200KB。">
                    {getFieldDecorator('avatar', {
                      initialValue: '',
                      valuePropName: 'file',
                      getValueFromEvent: normFile
                    })(
                      <Upload {...uploadProps}>
                         <Button>选择文件...</Button>
                      </Upload>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col span={7}>
              <Title level={4}>系统设置</Title>
              <Text >此信息将显示在您的个人资料中，以便想认识您的人更全面的了解您。</Text >
            </Col>
            <Col span={1}></Col>
            <Col span={16}>
              <Form>
                <Form.Item label="id" style={{display: 'none'}}>
                  {getFieldDecorator('id')(
                    <Input  disabled/>,
                  )}
                </Form.Item>
                <Form.Item label="默认站点" extra="输入您所处的站点" required colon={false}>
                  {getFieldDecorator('line', {
                    rules: [{ required: true, message: ' '}],
                  })(
                    <Input
                      placeholder="17号线" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="语言" extra="请选择您最擅长的语言，以便更好的阅读" required colon={false}>
                  {getFieldDecorator('language', {
                    rules: [{ required: true,  message: ' ' }],
                  })(
                    <Input
                      placeholder="简体中文" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="账号" extra="账号名注册后将不允许修改" colon={false}>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: ' ' }],
                  })(
                    <Input
                      placeholder="Wl97893012" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="主题" required colon={false}>
                  {getFieldDecorator('theme', {
                    rules: [{ required: true,  message: ' ' }],
                  })(
                    <Input
                      placeholder="小清新" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="证件号码" required colon={false}>
                  {getFieldDecorator('IDNumber', {
                    rules: [{ required: true,  message: ' ' }],
                  })(
                    <Input
                      placeholder="846562810" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col span={7}>
              <Title level={4}>联系方式</Title>
              <Text >此信息将显示在您的个人资料中，以便想认识您的人更快的联系到您。</Text >
            </Col>
            <Col span={1}></Col>
            <Col span={16}>
              <Form>
                <Form.Item label="通讯地址" required colon={false}>
                  {getFieldDecorator('location', {
                    rules: [{ required: true,  message: ' '}],
                  })(
                    <Input
                      placeholder="浙江省杭州市西湖区塘苗路18号" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="手机"  required colon={false}>
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true,  message: ' ' }],
                  })(
                    <Input
                      placeholder="15888888888" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="电话" colon={false}>
                  {getFieldDecorator('phone', {
                    rules: [],
                  })(
                    <Input
                      placeholder="15888888888" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="邮箱" colon={false}>
                  {getFieldDecorator('email', {
                    rules: [],
                  })(
                    <Input
                      placeholder="xxxx@jiudaotech.com" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="QQ" colon={false}>
                  {getFieldDecorator('QQ', {
                    rules: [],
                  })(
                    <Input
                      placeholder="12345678" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="微信" colon={false}>
                  {getFieldDecorator('Wechat', {
                    rules: [],
                  })(
                    <Input
                      placeholder="xxx" style={{ width:'450px'}}
                    />,
                  )}
                </Form.Item>
                <Form.Item label="自我描述" colon={false} extra="用不到250个字符告诉我们有关您自己的信息">
                  {getFieldDecorator('introduction', {
                    rules: [],
                  })(
                    <TextArea rows={4} placeholder="输入你的描述内容..." />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={handleSubmit}>更新配置内容</Button>
                </Form.Item>

              </Form>
            </Col>
          </Row>

        </Content>
      </Layout>
    </div>
  );
}

export default Form.create()(Setting);
