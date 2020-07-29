import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, InputNumber, Select, message } from 'antd'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

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

const CheckModal = props => {
  const { modalProperty, visible, handleCancel, setDirty, MyContext } = props
  const { templateCode, dataTypeOption, paramsNameOption, uomsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [dataType, setDataType] = useState()
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      if (modalProperty.type === "edit") {
        configObjectTemplate.dynamicBaseDetail(modalProperty.id)
          .then(res => {
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
            })
            setDataType(res.style)
            form.resetFields()
          })
      } else {
        configObjectTemplate.dynamicBaseNew()
          .then(res => {
            setInitValues({
              ...res,
              name: res.name ? res.name : undefined,
              style: res.style ? res.style : undefined,
              uom: res.uom ? res.uom : undefined,
            })
            form.resetFields()
          })
      }
    }
  }, [form, modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (modalProperty.type === "add") {
          configObjectTemplate.dynamicBaseAdd({ ...values, template: templateCode, _method: 'PUT' })
            .then((res) => {
              if (res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("新建失败，不可重复添加动态基础信息")
                setOkLoading(false)
              }
            })
        } else {
          configObjectTemplate.dynamicBaseUpdate(modalProperty.id, { ...values, template: templateCode, _method: 'PUT' })
            .then((res) => {
              if (res.success) {
                message.success("编辑成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("编辑失败，不可重复添加动态基础信息")
                setOkLoading(false)
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
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="templateTestForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="参数名称" name="name" rules={[{ required: true, message: '请选择参数名称' }]}>
          <Select placeholder="请选择参数名称">
            {
              paramsNameOption.map(item => (
                <Select.Option key={item.code}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="数据样式" name="style" rules={[{ required: true, message: '请选择数据样式' }]}>
          <Select
            placeholder="请选择数据样式"
            onChange={
              val => setDataType(val)
            }
          >
            {
              dataTypeOption.map(item => (
                <Select.Option key={item.value}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        {
          dataType === "01" ?
            <>
              <Form.Item label="数值" name="value" rules={[{ required: true, message: '请输入数值' }]}>
                <InputNumber placeholder="请输入数值" />
              </Form.Item>
              <Form.Item label="计量单位" name="uom">
                <Select
                  placeholder="请选择计量单位"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    option.children&&option.children[0].indexOf(input) >= 0
                  }
                >
                  {
                    uomsOption.map(item => (
                      <Select.OptGroup key={item.id} label={item.text}>
                        {
                          item.children.map(child => (
                            <Select.Option key={child.model.code} value={child.model.code}>{child.model.name} ({child.model.symbol})</Select.Option>
                          ))
                        }
                      </Select.OptGroup>
                    ))
                  }
                </Select>
              </Form.Item>
            </>
            :
            <>
              <Form.Item label="参数一" name="param1" rules={[{ required: true, message: '请输入参数一' }]}>
                <InputNumber placeholder="请输入参数一" />
              </Form.Item>
              <Form.Item label="参数二" name="param2" rules={[{ required: true, message: '请输入参数二' }]}>
                <InputNumber placeholder="请输入参数二" />
              </Form.Item>
            </>
        }
      </Form>
    </Modal>
  )
}

export default React.memo(CheckModal)
