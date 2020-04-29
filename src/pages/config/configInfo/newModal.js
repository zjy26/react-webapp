import React, { useEffect } from 'react'
import { Form, Modal, Input, Radio, Select } from 'antd'
import { configEntity } from '../../../api'

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
  const [form] = Form.useForm()

  useEffect(()=>{
    if(props.visible === true) {
      form.resetFields()
    }
  }, [form, props.visible])

  const handleSubmit = () => {
    form.validateFields()

    //TODO 目前接口参数缺少 应用类型（applyType） 字段
    .then(values => {
      const {applyType, ...data} = values
      const params = {...data}
      configEntity.configEntityAdd(params)
      .then(()=>{
        props.handleCancel()
        props.setDirty((dirty)=>dirty+1)
      })
    })
  }

  return (
    <Modal
      getContainer={false}
      title="新建业务数据"
      okText="确认"
      cancelText="取消"
      onOk={handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} form={form} initialValues={{type:2, codeType:3, applyType:2}}>
        <Form.Item label="业务数据名称" name="name" rules={[{required: true, message: '请输入业务数据名称'}]}>
          <Input placeholder="请输入业务数据名称" />
        </Form.Item>
        <Form.Item label="业务数据代码" name="code" rules={[{required: true, message: '请输入业务数据代码'}]}>
          <Input placeholder="请输入业务数据代码" />
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{required: true, message: '请选择类型'}]} style={{display:'none'}}>
          <Radio.Group>
            <Radio value={2}>代码</Radio>
            <Radio value={1}>分类</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="代码类型" name="codeType" style={{display:'none'}}>
          <Select placeholder="请选择代码类型">
            <Select.Option value={3}>3</Select.Option>
            <Select.Option value={2}>数字及文本</Select.Option>
            <Select.Option value={1}>数字</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="应用类型" name="applyType">
          <Radio.Group>
            <Radio value={2}>业务</Radio>
            <Radio value={1}>系统</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="描述" name="descr">
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        <Form.Item label="备注" name="comment">
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(NewModal)
