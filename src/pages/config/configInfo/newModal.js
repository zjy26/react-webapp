import React, {useState, useEffect} from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Radio, Select } from 'antd';

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

const NewModal = props => {
  const {getFieldDecorator} = props.form
  const [obj, setObj] = useState({})

  useEffect(()=>{
    setObj({})
  }, [])

  return (
    <Modal
      title="新建业务数据"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} >
        <Form.Item label="实体名称">
          {getFieldDecorator("name", {
            initialValue: obj.name,
            rules: [{required: true}],
          })(<Input placeholder="请输入实体名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator("descr", {
            initialValue: obj.descr,
            rules: [{required: true}],
          })(<Input placeholder="请输入描述" />)}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator("type", {
            initialValue: obj.type,
            rules: [{required: true}],
          })(
          <Radio.Group>
            <Radio value={1}>代码</Radio>
            <Radio value={2}>分类</Radio>
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="代码类型">
          {getFieldDecorator("codeType", {
            initialValue: obj.codeType,
          })(<Select placeholder="请选择代码类型" />)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator("comment", {
            initialValue: obj.comment,
          })(<Input.TextArea placeholder="请输入备注" />)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(Form.create()(NewModal))
