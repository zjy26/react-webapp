import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Input, Checkbox, message, InputNumber } from 'antd'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
}

const Modal3 = props => {
  const { modalProperty, visible, handleCancel, renderChildData, MyContext } = props
  const { templateCode } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        configObjectTemplate.propEntityTemplateDetail(modalProperty.id)
          .then(res => {
            setInitValues({ ...res, isDefault: res.isDefault === true ? ["isDefault"] : [] })
            form.resetFields()
          })
      } else {
        configObjectTemplate.propEntityTemplateNew()
          .then(res => {
            setInitValues({ ...res, isDefault: res.isDefault === true ? ["isDefault"] : [] })
            form.resetFields()
          })
      }
    }
  }, [form, modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (modalProperty.type === "add") {
          configObjectTemplate.propEntityTemplateAdd(
            {
              ...values,
              source: modalProperty.activeKey,
              property: modalProperty.property,
              template: templateCode,
              isDefault: values.isDefault.length > 0 ? true : false,
              _method: 'PUT'
            }
          )
            .then((res) => {
              if (res && res.success) {
                message.success("新建成功")
                handleCancel()
                renderChildData(true, modalProperty.property)
              } else {
                message.success("新建失败")
              }
            })
        } else {
          configObjectTemplate.propEntityTemplateUpdate(modalProperty.id,
            {
              ...values,
              source: modalProperty.activeKey,
              property: modalProperty.property,
              template: templateCode,
              isDefault: values.isDefault.length > 0 ? true : false,
              _method: 'PUT'
            }
          )
            .then((res) => {
              if (res && res.success) {
                message.success("编辑成功")
                handleCancel()
                renderChildData(true, modalProperty.property)
              } else {
                message.success("编辑失败")
              }
            })
        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form name="templateMonitorForm3" form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="值" name="value" rules={[{ required: true, message: '请输入值' }]}>
          <InputNumber placeholder="请输入值" precision={0} />
        </Form.Item>
        <Form.Item
          label="描述"
          name="name"
          rules={[
            { whitespace: true, message: '内容不能为空' },
            { required: true, message: '请输入描述' }
          ]}
        >
          <Input placeholder="请输入描述" />
        </Form.Item>
        <Form.Item label="预设值" name="isDefault">
          <Checkbox.Group>
            <Checkbox value="isDefault" />
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(Modal3)

