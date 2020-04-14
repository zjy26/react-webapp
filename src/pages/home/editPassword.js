import React, {useEffect} from 'react'
import { Form, Modal, Input } from 'antd'

const EditPassword = (props) => {
  const [form] = Form.useForm()

  const submit = () => {
    form.validateFields()
    .then(values=>{
      console.log(values)
    })
    .catch()
  }

  useEffect(()=>{
    if(props.visible === false) {
      form.resetFields()
    }
  })

  return (
    <div>
      <Modal
        getContainer={false}
        title="修改密码"
        visible={props.visible}
        onOk={submit}
        onCancel={props.handleCancel}
      >
        <Form
          form={form}
          name="editPsd"
        >
          <Form.Item
            name="oldPsd"
            label="原密码"
            rules={[
              {
                required: true,
                message: '请输入原密码',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="新密码"
            rules={[
              {
                required: true,
                message: '请输入新密码',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="重复新密码"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请再次输入新密码',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次密码输入不一致');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  ); 
}
export default React.memo(EditPassword);
