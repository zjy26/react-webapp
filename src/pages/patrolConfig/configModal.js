import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, Select } from 'antd';
import { robotConfig } from '../../api'

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

const ConfigModal = (props) => {
  const [form] = Form.useForm()

  useEffect(() => {
    //查看详情
    if(props.currentId !== 0) {
      robotConfig.robotConfigDetail(props.currentId)
      .then((res) =>{
        if(res){
          form.setFieldsValue({...res, siteLine: res.site.slice(0, 4)})
        }
      })
    } else {
      form.resetFields()
    }
  }, [props.visible, props.currentId])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      let {siteLine, ...data} = values
      let params = {...data}
      if(values.id) {//编辑
        Modal.confirm({
          title: '确认提示',
          content: '是否确认修改？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=> {
            robotConfig.robotConfigEdit(values.id, params)
            .then((res)=>{
              props.handleCancel()
              props.setDirty((dirty)=>dirty+1)
            })
          },
          onCancel() {
          },
        })
      } else {//添加
        robotConfig.robotConfigAdd(params)
        .then((res)=>{
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
        });
      }
    } catch (errorInfo) {
      return;
    }
  }

  return (
    <Modal
      getContainer={false}
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      currentId={props.currentId}
      locationTree={props.locationTree}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          label="id" 
          name="id"
          style={{display: 'none'}}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="线路"
          name="siteLine"
          rules= {[{required: true}]}
        >
          <Select placeholder="请选择线路">
            {props.locationTree.line && props.locationTree.line.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="站点"
          name="site"
          rules= {[{required: true}]}
        >
          <Select placeholder="请选择站点">
            {props.locationTree.site && props.locationTree.site.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="服务器IP"
          name="ip"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入服务器IP"/>
        </Form.Item>
        <Form.Item
          label="服务器端口"
          name="port"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入服务器端口"/>
        </Form.Item>
        <Form.Item
          label="视频流推送"
          name="cameraStreamUrl"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入视频流推送"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ConfigModal)
