import React, { useState, useEffect } from 'react'
import { Modal,Form, Input, Select } from 'antd'
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
  const { getFieldDecorator, resetFields } = props.form
  const [obj, setObj] = useState({})

  useEffect(() => {
    //查看详情
    if(props.visible===true && props.currentId !== 0) {
      robotConfig.robotConfigDetail(props.currentId)
      .then((res) =>{
        if(res){
          setObj({...res, siteLine: res.site.slice(0, 4)})
        }
      })
    } else {
      setObj({})
      resetFields()
    }
  }, [props.visible, props.currentId]);

  const handleSubmit = e => {
    e.preventDefault()
    const {
      form: { validateFields, isFieldsTouched },
    } = props;

    validateFields((errors, values) => {
      if(errors) {
        return
      }
      let {siteLine, ...data} = values
      let params = {...data}
      if(values.id) {//编辑
        if(isFieldsTouched() === true) {  //判断是否有修改
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
          });
        } else {
          props.handleCancel()
          resetFields()
        }
      } else {//添加
        robotConfig.robotConfigAdd(params)
        .then((res)=>{
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
        });
      }

    });
  }

  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      currentId={props.currentId}
      locationTree={props.locationTree}
    >
      <Form {...formItemLayout}>
        <Form.Item label="id" style={{display: 'none'}}>
          {getFieldDecorator('id', {
            initialValue: obj.id,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="线路">
          {getFieldDecorator('siteLine', {
            initialValue: obj.siteLine,
            rules: [{required: true}],
          })(
          <Select placeholder="请选择线路">
            {props.locationTree.line && props.locationTree.line.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="站点">
          {getFieldDecorator('site', {
            initialValue: obj.site,
            rules: [{required: true}],
          })(
          <Select placeholder="请选择站点">
            {props.locationTree.site && props.locationTree.site.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="服务器IP">
          {getFieldDecorator('ip', {
            initialValue: obj.ip,
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器IP"/>)}
        </Form.Item>
        <Form.Item label="服务器端口">
          {getFieldDecorator('port', {
            initialValue: obj.port,
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器端口"/>)}
        </Form.Item>
        <Form.Item label="视频流推送">
          {getFieldDecorator('cameraStreamUrl', {
            initialValue: obj.cameraStreamUrl,
            rules: [{required: true}],
          })(<Input placeholder="请输入视频流推送"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(ConfigModal);
