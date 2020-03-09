import React, { useState, useEffect} from 'react';
import { Modal,Form, Input, Select } from 'antd';
import Axios from 'axios';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const ConfigModal = (props) => {
  const { getFieldDecorator, resetFields } = props.form;
  const [obj, setObj] = useState({});
console.log(obj)
  if(props.visible===true) {
    resetFields();
    Axios.get('/api/patrolConfigList/'+props.currentId)
    .then((res) =>{
      if(res.status === 200){
        setObj(res.data);
      }
    })
  }


  const handleSubmit = e => {
    //e.preventDefault();
    const {
      form: { validateFields, isFieldsTouched},
    } = props;

    validateFields((errors, values) => {
      if(errors) {
        return;
      }
      if(values.id) {//编辑
        if(isFieldsTouched() === true) {  //判断是否有修改
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: ()=> {
              Axios.put('/api/patrolConfigList/'+values.id, {...values}
              ).then((res)=>{
                props.handleCancel()
                props.setDirty(dirty=>dirty+1)
              })
            },
            onCancel() {
            },
          });
        } else {
          props.handleCancel()
        }
      } else {//添加
        Axios.post('/api/patrolConfigList',{...values, key:values.id}
        ).then((res)=>{
          props.handleCancel()
          props.setDirty(dirty=>dirty+1)
        });
      }

    });
  };
  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      currentId = {props.currentId}
      setDirty = { props.setDirty }
    >
      <Form {...formItemLayout}>
        <Form.Item label="id" style={{display: 'none'}}>
          {getFieldDecorator('id', {
            initialValue: obj.id,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="线路">
          {getFieldDecorator('line', {
            initialValue: obj.line,
            rules: [{required: true}],
          })(
          <Select placeholder="请选择线路">
            <Select.Option value="1117">17号线</Select.Option>
            <Select.Option value="1111">11号线</Select.Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="站点">
          {getFieldDecorator('site', {
            initialValue: obj.site,
            rules: [{required: true}],
          })(
          <Select placeholder="请选择站点">
            <Select.Option value="虹桥火车站">虹桥火车站</Select.Option>
            <Select.Option value="诸光路">诸光路</Select.Option>
          </Select>)}
        </Form.Item>
        <Form.Item label="服务器IP">
          {getFieldDecorator('serverIP', {
            initialValue: obj.serverIP,
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器IP"/>)}
        </Form.Item>
        <Form.Item label="服务器端口">
          {getFieldDecorator('serverPort', {
            initialValue: obj.serverPort,
            rules: [{required: true}],
          })(<Input placeholder="请输入服务器端口"/>)}
        </Form.Item>
        <Form.Item label="视频流推送">
          {getFieldDecorator('videoUrl', {
            initialValue: obj.videoUrl,
            rules: [{required: true}],
          })(<Input placeholder="请输入视频流推送"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(ConfigModal);
