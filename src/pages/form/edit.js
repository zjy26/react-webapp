import React from 'react'
import { Form, Input, Button, Checkbox } from 'antd'

const Edit = (props) => {
  const [form] = Form.useForm()
  const onFinish = () => {
    form.validateFields()
    .then(values => {

      console.log(values.codes)
     // props.history.push({ pathname: `/form`, query:{codes: values.codes, components: values.components} })
    })
  }

  const options = [
    { label: 'Button', value: 'Button' },
    { label: 'Radio', value: 'Radio' },
    { label: 'Checkbox', value: 'Checkbox' },
    { label: 'Input', value: 'Input' },
    { label: 'InputNumber', value: 'InputNumber' },
    { label: 'DatePicker', value: 'DatePicker' },
    { label: 'Select', value: 'Select' },
    { label: 'Cascader', value: 'Cascader' },
    { label: 'Upload', value: 'Upload' },
    { label: 'Tree', value: 'Tree' },
    { label: 'Table', value: 'Table' },
    { label: 'Modal', value: 'Modal' },
  ]

  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        label="源代码"
        name="codes"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="组件" name="components">
        <Checkbox.Group options={options} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default React.memo(Edit)
