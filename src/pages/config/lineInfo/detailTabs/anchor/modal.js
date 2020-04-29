import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, Select, message } from 'antd'
import { configLocation } from '../../../../../api'

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
  const {modalProperty, visible, setDirty, handleCancel, MyContext} = props
  const {lineCode, intervalList} = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(()=>{
    if(visible) {
      modalProperty.type==="add" ?
      configLocation.configAnchorNew()
      .then((res)=>{
        setInitValues(res)
        form.resetFields()
      })
      :
      configLocation.configAnchorDetail(modalProperty.id)
      .then(res=> {
        if(res) {
          const intervalArr = res.interval.split(",")
          const intArr = intervalArr.map(item=> +item)
          const descrArr = intArr.map(item => {
            const data = intervalList.find(obj => obj.id === item)
            return "".concat(data.descr)
          })

          modalProperty.type === "check" ?
          setInitValues({
            ...res,
            interval: descrArr.join("，")
          })
          :
          setInitValues({
            ...res,
            interval: intArr
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
      const params = {
        ...values,
        interval: values.interval.toString()
      }

      switch (modalProperty.type) {
        case "add":
          configLocation.configAnchorAdd({...params, line:lineCode})
          .then(()=>{
            handleCancel()
            setDirty((dirty)=>dirty+1)
          })
          break;
        case "edit":
          configLocation.configAnchorUpdate(modalProperty.id, {...params, _method:'PUT'})
          .then(()=>{
            message.success("编辑成功")
            setDirty(dirty=>dirty+1)
            handleCancel()
          })
          break;
        default:
          handleCancel()
      }
    })
  }

  return (
    <Modal
      title= {modalProperty.title}
      okText="确认"
      cancelText="取消"
      onOk= {handleSubmit}
      visible={visible}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout} form={form} initialValues={initValues}>
      {
        modalProperty.type === "check" ?
        <>
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
            {initValues.interval}
          </Form.Item>
        </>
       :
        <>
          <Form.Item label="锚段描述" name="descr" rules={[{required: true, message: '请输入区间名称'}]}>
            <Input placeholder="请输入锚段描述"/>
          </Form.Item>
          <Form.Item label="锚段号" name="code" rules={[{required: true, message: '请输入锚段号'}]}>
            <Input placeholder="请输入锚段号"/>
          </Form.Item>
          <Form.Item label="锚段长度" name="length" rules={[{required: true, message: '请输入锚段长度'}]}>
            <Input placeholder="请输入锚段长度"/>
          </Form.Item>
          <Form.Item label="关联区间" name="interval" rules={[{required: true, message: '请选择关联区间'}]}>
            <Select placeholder="请选择关联区间" mode="multiple">
              {
                intervalList.map(item=>(
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
