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
  const { getFieldDecorator } = props.form;
  const [obj, setObj] = useState({});

  useEffect(() => {
    if(props.visible===true && props.currentId !== 0) {
      Axios.get('/api/patrolConfigList/'+props.currentId)
      .then((res) =>{
        if(res.status === 200){
          setObj(res.data);
        }
      })
    } else {
      setObj({});
    }
  }, [props.visible, props.currentId]);

  const handleSubmit = e => {
    e.preventDefault();
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
      location = {props.location}
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
          {
            props.location.line && props.location.line.map( item =>
              <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
            )
          }
          </Select>)}
        </Form.Item>
        <Form.Item label="站点">
          {getFieldDecorator('site', {
            initialValue: obj.site,
            rules: [{required: true}],
          })(
          <Select placeholder="请选择站点">
            {
              props.location.site && props.location.site.map( item =>
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              )
            }
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
