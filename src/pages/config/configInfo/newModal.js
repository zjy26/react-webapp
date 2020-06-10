import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, Radio, Select, message } from 'antd'
import { configEntity } from '../../../api/config/configInfo'

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
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (props.visible === true) {
      configEntity.configEntityNew()
        .then(res => {
          setInitValues({ ...res, type: 2, codeType: 3, category: 1 })
          form.resetFields()
        })
    }
  }, [form, props.visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        configEntity.configEntityAdd(values)
          .then(res => {
            if (res.success) {
              message.success("新建成功")
              props.handleCancel()
              props.setDirty((dirty) => dirty + 1)
            } else {
              message.error(res.fieldErrors.name)
            }
          })
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="新建业务数据"
      okText="确认"
      cancelText="取消"
      onOk={handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form
        name="configNewForm"
        {...formItemLayout}
        form={form}
        initialValues={initValues}
      >
        <Form.Item
          label="业务数据名称"
          name="name"
          rules={[
            { whitespace: true, message: '内容不能为空' },
            { required: true, message: '请输入业务数据名称' },
            { max: 20, message: '最大长度为20个字符' }
          ]}
        >
          <Input placeholder="请输入业务数据名称" maxLength={20} />
        </Form.Item>
        <Form.Item label="类型" name="type" style={{ display: "none" }}>
          <Radio.Group>
            <Radio value={2}>代码</Radio>
            <Radio value={1}>分类</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="代码类型" name="codeType" style={{ display: "none" }}>
          <Select placeholder="请选择代码类型">
            <Select.Option value={3}>3</Select.Option>
            <Select.Option value={2}>数字及文本</Select.Option>
            <Select.Option value={1}>数字</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="应用类型" name="category" style={{ display: "none" }}>
          <Radio.Group>
            <Radio value={1}>业务</Radio>
            <Radio value={0}>系统</Radio>
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
