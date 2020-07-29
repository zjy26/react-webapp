import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, InputNumber, Select, message, Button } from 'antd'
import { configLocation } from '../../../../../api/config/lineInfo'

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

const AnchorModal = props => {
  const { modalProperty, visible, setDirty, handleCancel, MyContext, intervalOption } = props
  const { lineCode } = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      modalProperty.type === "add" ?
        configLocation.configAnchorNew()
          .then((res) => {
            setInitValues(res)
            form.resetFields()
          })
        :
        configLocation.configAnchorDetail(modalProperty.id)
          .then(res => {
            if (res) {
              const intervalArr = res.interval.split(",")
              const intArr = intervalArr.map(item => +item)
              const descrArr = intArr.map(item => {
                const data = intervalOption.find(obj => obj.id === item)
                return "".concat(data.descr)
              })

              modalProperty.type === "check" ?
                setInitValues({
                  ...res,
                  interval: intArr,
                  intervalDesc: descrArr.join("，")
                })
                :
                setInitValues({
                  ...res,
                  interval: intArr
                })

              form.resetFields()
            }
          })
    } else {
      setInitValues({
        interval: []
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const params = {
          ...values,
          interval: values.interval.toString()
        }

        setOkLoading(true)

        switch (modalProperty.type) {
          case "add":
            configLocation.configAnchorAdd({ ...params, line: lineCode })
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
            configLocation.configAnchorUpdate(modalProperty.id, { ...params, _method: 'PUT' })
              .then((res) => {
                if(res && res.success) {
                  message.success("编辑成功")
                  setDirty(dirty => dirty + 1)
                  handleCancel()
                } else {
                  message.error('编辑失败')
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
      footer={
        modalProperty.type === "check" ? null :
          [
            <Button key="cancel" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={okLoading} onClick={handleSubmit}>确定</Button>
          ]
      }
    >
      <Form name="lineAnchorForm" {...formItemLayout} form={form} initialValues={initValues}>
        {
          modalProperty.type === "check" ?
            <>
              <Form.Item label="编码">
                {initValues.scode}
              </Form.Item>
              <Form.Item label="序号">
                {initValues.sn}
              </Form.Item>
              <Form.Item label="锚段描述">
                {initValues.descr}
              </Form.Item>
              <Form.Item label="锚段号">
                {initValues.code}
              </Form.Item>
              <Form.Item label="锚段长度">
                {initValues.length}
              </Form.Item>
              <Form.Item label="关联区间">
                {initValues.intervalDesc}
              </Form.Item>
            </>
            :
            <>
              <Form.Item
                label="锚段描述"
                name="descr"
                rules={[
                  { whitespace: true, message: '内容不能为空' },
                  { required: true, message: '请输入锚段描述' },
                  { max: 20, message: '最大长度为20个字符' }
                ]}
              >
                <Input placeholder="请输入锚段描述" maxLength={20} />
              </Form.Item>
              <Form.Item
                label="锚段号"
                name="code"
                rules={[
                  { whitespace: true, message: '内容不能为空' },
                  { required: true, message: '请输入锚段号' }
                ]}
              >
                <Input placeholder="请输入锚段号" />
              </Form.Item>
              <Form.Item label="锚段长度" name="length" rules={[{ required: true, message: '请输入锚段长度' }]}>
                <InputNumber placeholder="请输入锚段长度" min={0} />
              </Form.Item>
              <Form.Item label="关联区间" name="interval" rules={[{ required: true, message: '请选择关联区间' }]}>
                <Select placeholder="请选择关联区间" mode="multiple">
                  {
                    intervalOption.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.descr}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </>
        }
      </Form>
    </Modal>
  )
}

export default React.memo(AnchorModal)
