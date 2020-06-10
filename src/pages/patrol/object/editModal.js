import React from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Form, message, InputNumber } from 'antd';
import { robotObject } from '../../../api'

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

const EditModal = props => {
  const [form] = Form.useForm()

  //基本信息编辑保存
  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      if(props.objectIds) {//编辑
        Modal.confirm({
          title: '确认提示',
          content: '是否确认修改？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=> {
            let params = {
              ...values,
              _method:'PUT',
              objectIds: props.objectIds.toString()
            }
            robotObject.robotObjectRevise(params)
            .then((res)=>{
              message.success("保存成功")
              props.setDirty((dirty)=>dirty+1)
              props.handleCancel()
              form.resetFields()
            }).catch((err) =>{
              message.error("保存失败")
            })

          },
          onCancel() {
          },
        })
      }
    })
    .catch (errorInfo=>{
      return
    })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="批量修改"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      objectIds={props.objectIds}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      setDirty={props.setDirty}
      brands={props.brands}
      suppliers={props.suppliers}
    >
      <Form {...formItemLayout} form={form} name="editFrom">
        <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
            <Select placeholder="请选择品牌">
              {props.brands && props.brands.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
        </Form.Item>
        <Form.Item label="型号" rules={[{required: true, message: '请输入型号'}]}>
          <Input placeholder="请输入型号"/>
        </Form.Item>
        <Form.Item label="总运行时长" required>
          <Form.Item name="runningTime" rules={[{required: true, message: '请输入总运行时长'}]} noStyle>
            <InputNumber placeholder="请输入总运行时长"/>
          </Form.Item>
        <span className="ant-form-text"> 小时</span>
        </Form.Item>
        <Form.Item label="总运行里程" required>
          <Form.Item name="runningMileage" rules={[{required: true, message: '请输入总运行时长'}]} noStyle>
            <InputNumber />
          </Form.Item>
        <span className="ant-form-text"> 千米</span>
        </Form.Item>
        <Form.Item label="属性描述" name="propertyName" rules={[{required: true, message: '请输入属性描述'}]}>
          <Input.TextArea placeholder="请输入属性描述"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}


export default React.memo((EditModal))
