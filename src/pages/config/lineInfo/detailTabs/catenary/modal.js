import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, Select, message } from 'antd'
import { configLocation } from '../../../../../api/config/lineInfo'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  }
}

const CatenaryModal = props => {
  const { modalProperty, visible, setDirty, handleCancel, MyContext } = props
  const { entity, lineCode } = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      modalProperty.type === "add" ?
        configLocation.configCatenaryNew()
          .then((res) => {
            setInitValues({
              ...res,
              cls: res.cls ? res.cls : undefined,
              brand: res.brand ? res.brand : undefined,
            })
            form.resetFields()
          })
        :
        configLocation.configCatenaryDetail(modalProperty.id)
          .then(res => {
            if (res) {
              setInitValues({
                ...res,
                brand: res.brand.id
              })
              form.resetFields()
            }
          })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        switch (modalProperty.type) {
          case "add":
            configLocation.configCatenaryAdd({ ...values, line: lineCode })
              .then((res) => {
                if (res && res.success) {
                  handleCancel()
                  setDirty((dirty) => dirty + 1)
                  message.success("新建成功")
                } else {
                  message.error(res.actionErrors[0])
                  setOkLoading(false)
                }
              })
            break;
          case "edit":
            configLocation.configCatenaryUpdate(modalProperty.id, { ...values, _method: 'PUT' })
              .then((res) => {
                if(res && res.success) {
                  message.success("编辑成功")
                  setDirty(dirty => dirty + 1)
                  handleCancel()
                } else {
                  message.error("编辑失败")
                  setOkLoading(false)
                }
              })
            break;
          default:
            handleCancel()
        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      onOk={handleSubmit}
      visible={visible}
      onCancel={handleCancel}
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="lineCatenaryForm" {...formItemLayout} form={form} initialValues={initValues}>
        <Form.Item label="设备分类" name="cls" rules={[{ required: true, message: '请输入设备分类' }]}>
          <Select placeholder="请输入设备分类">
            {
              entity.classOption.map(item => (
                <Select.OptGroup key={item.id} label={item.text}>
                  {
                    item.children.map(child => (
                      <Select.Option
                        key={child.model.code}
                        value={child.model.code}
                      >
                        {child.model.desc}
                      </Select.Option>
                    ))
                  }
                </Select.OptGroup>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌' }]}>
          <Select placeholder="请选择品牌">
            {
              entity.brandOption.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="型号"
          name="modelNumber"
          rules={[
            { whitespace: true, message: '内容不能为空' },
            { required: true, message: '请输入型号' }
          ]}
        >
          <Input placeholder="请输入型号" />
        </Form.Item>
        <Form.Item label="规格" name="spec">
          <Input placeholder="请输入规格" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CatenaryModal)
