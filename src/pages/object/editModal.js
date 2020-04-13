import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, message } from 'antd';
import { robotObject } from '../../api'
import store from '../../store'

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

const EditModal = props => {
  const { getFieldDecorator, validateFields, resetFields } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let params = {
          ...values,
          objectIds: props.objectIds.toString()
        }
        robotObject.robotObjectRevise(params)
        .then((res)=>{
          message.success("保存成功")
          props.setDirty((dirty)=>dirty+1)
          props.handleCancel()
          resetFields()
        }).catch((err) =>{
          message.error("保存失败")
        })
      }
    })
  }

  return (
    <Modal
      title="批量修改"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      objectIds={props.objectIds}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      setDirty={props.setDirty}
    >
      <Form {...formItemLayout}>
        <Form.Item label="品牌">
          {getFieldDecorator("brand", {
            rules: [{required: true}],
          })(
            <Select placeholder="请选择品牌">
              {store.getState().brands && store.getState().brands.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="型号">
          {getFieldDecorator('type', {
            rules: [{required: true}]
          })(<Input placeholder="请输入型号"/>)}
        </Form.Item>
        <Form.Item label="总运行时长">
          {getFieldDecorator("runningTime", {
            rules: [{required: true}]
          })(
            <Input placeholder="请输入总运行时长" />
          )}
        </Form.Item>

        <Form.Item label="总运行里程">
          {getFieldDecorator("runningMileage", {
            rules: [{required: true}]
          })(
            <Input placeholder="请输入总运行里程" />
          )}
        </Form.Item>
        <Form.Item label="属性描述">
          {getFieldDecorator('propertyName')(<Input.TextArea placeholder="请输入属性描述"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(EditModal)
