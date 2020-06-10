import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, Select, message } from 'antd'
import { testTemplate } from '../../../../../api/experimental/testTemplate'
import { connect } from 'react-redux'
import { getProperty } from '../../store/index'

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

//试验属性弹窗
const PropertyModal = (props) => {
  const { visible, handleCancel, modalProperty, renderChildData, getPropertyDispatch, property } = props

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    getPropertyDispatch()
  }, [getPropertyDispatch])

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        testTemplate.experimentTemplateDataDetail(modalProperty.id)
          .then(res => {
            setInitValues({
              ...res,
              property: res.property.id
            })
            form.resetFields()
          })
      } else {
        testTemplate.experimentTemplateDataNew()
          .then(res => {
            setInitValues({
              ...res,
              property: res.property ? res.property : undefined
            })
            form.resetFields()
          })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (modalProperty.type === "add") {
          const params = {
            ...values,
            experimentTemplateItem: modalProperty.id,
            _method: 'PUT'
          }
          testTemplate.experimentTemplateDataAdd(params)
            .then((res) => {
              if (res.success) {
                message.success("新建成功")
                renderChildData(true, modalProperty.id)
                handleCancel()
              }
            })
        } else {
          testTemplate.experimentTemplateDataUpdate(modalProperty.id, { ...values, _method: 'PUT' })
            .then((res) => {
              if (res.success) {
                message.success("编辑成功")
                renderChildData(true, modalProperty.item)
                handleCancel()
              }
            })
        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={modalProperty.name}
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form name="testPropertyForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item
          label="试验属性"
          name="property"
          rules={[
            { required: true, message: "请选择试验属性" }
          ]}>
          <Select placeholder="请选择试验属性">
            {
              property.toJS().map(item => (
                <Select.Option key={item.id} value={item.id}>{item.desc}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="计量单位"
          name="uom"
          rules={[{ max: 5, message: '最大长度为5个字符' }]}
        >
          <Input placeholder="请输入计量单位" maxLength={5} />
        </Form.Item>
        <Form.Item
          label="标准值"
          name="standardValue"
          rules={[{ max: 5, message: '最大长度为5个字符' }]}
        >
          <Input placeholder="请输入标准值" maxLength={5} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  property: state.getIn(['testTemplate', 'property']),   //试验属性
})

const mapDispatchOBJ = {
  getPropertyDispatch: getProperty,
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(PropertyModal))


//试验名称弹窗
export const NameModal = (props) => {
  const { visible, handleCancel, modalProperty, setDirty, id } = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        testTemplate.experimentTemplateItemDetail(modalProperty.id)
          .then(res => {
            setInitValues(res)
            form.resetFields()
          })
      } else {
        testTemplate.experimentTemplateItemNew()
          .then(res => {
            setInitValues(res)
            form.resetFields()
          })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (modalProperty.type === "add") {
          testTemplate.experimentTemplateItemAdd({
            name: values.name,
            experimentTemplate: id
          })
            .then(res => {
              if (res && res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              }
            })
        } else {
          //试验属性名称修改
          testTemplate.experimentTemplateItemUpdate(modalProperty.id, { ...values, _method: 'PUT' })
            .then(res => {
              if (res && res.success) {
                message.success("编辑成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              }
            })
        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={modalProperty.name}
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form form={form} name="testNameForm" initialValues={initValues}>
        <Form.Item
          label="试验名称"
          name="name"
          rules={[
            { required: true, message: "请输入试验名称" },
            { max: 5, message: '最大长度为5个字符' }
          ]}
        >
          <Input placeholder="请输入试验名称" maxLength={5} />
        </Form.Item>
      </Form>

    </Modal>
  )
}
