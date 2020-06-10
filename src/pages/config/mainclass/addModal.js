import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Button, Upload, Col, Row, message   } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { classManage, CLASS_FUNCTION } from '../../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const AddModal = props => {
  const [form] = Form.useForm()
  const [classData, setclassData] = useState([])

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields()
    .then(values => {
        classManage.addClass({descr:values.descr,org:props.org,fun:values.fun})
        .then(res => {
          if(res.actionErrors && res.actionErrors.length){
            message.error(res.actionErrors[0])
          }else{
            message.success('添加成功')
          }
          props.handleCancel()
          props.setDirty(dirty=>dirty+1)
        })
        .catch(error => {
        })
    })
    .catch(error => {
    });
  }
  useEffect(()=>{
    CLASS_FUNCTION()
    .then(res =>{
      setclassData(res.models)
    })
      form.resetFields();
  }, [props.visible,form])

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="添加分类"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="分类名称"
          name="descr"
          rules={[
            {
              required: true,
              message: '请输入分类描述'
            },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            }
          ]}
        >
          <Input placeholder="请输入描述" />
        </Form.Item>
        <Form.Item label="应用于" name="fun" rules={[{required: true, message: '请选择应用程序'}]}>
          <Select placeholder="请选择分类应用于">
            {
              classData.length>0 && classData.map(item => (
                <Select.Option key={item.code}>
                  {item.name}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="上传文件">
          <Row align="top">
            <Col span={9}>
              <Upload>
                <Button>
                  <UploadOutlined /> 上传文件
                </Button>
              </Upload>
            </Col>
            <Col style={{display:"flex",alignItems:"center"}}>
              <Button type="link" size={'small'}>下载模板</Button>
            </Col>
          </Row>

        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo((AddModal))
