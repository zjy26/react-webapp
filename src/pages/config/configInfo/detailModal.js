import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, InputNumber, Radio, Row, Col, message } from 'antd'
import { configEntity } from '../../../api'

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

const DetailModal = props => {
  const {visible, handleCancel, modalProperty, entity, setDirty} = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(()=>{
    if(visible === true) {
      if(modalProperty.childId) { //查看详情
        configEntity.configEntityCodeDetail(modalProperty.childId)
        .then(res=> {
          const status = res.disabled===false ? {disabled:"启用"} : {disabled:"停用"}
          if(modalProperty.type === "edit") {
            setInitValues(res)
            form.resetFields()
          } else {
            setInitValues({...res, ...status})
          }
          form.resetFields()
        })
        .catch(()=>{
          console.log("业务基础数据详情列表获取失败")
        })
      } else {
        configEntity.configEntityCodeNew()
        .then(res=>{
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
      switch (modalProperty.type) {
        case "add":
          configEntity.configEntityCodeAdd({...values, entity})
          .then((res)=>{
            if(res.fieldErrors) {
              message.error("代码或名称可能已存在，新建失败")
            } else{
              handleCancel()
              setDirty(dirty=>dirty+1)
            }
          })
          break;
        case "edit":
          configEntity.configEntityCodeUpdate(values.id, {...values, entity, _method:'PUT'})
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
      getContainer={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      width="600px"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout} form={form} initialValues={initValues}>
      {
        modalProperty.type === "check" ?
         <Row gutter={24}>
            <Col span={12} style={{display:'none'}}>
              <Form.Item label="ID">
                {initValues.id}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="名称">
                {initValues.name}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="代码">
                {initValues.code}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="描述">
                {initValues.descr}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级">
                {initValues.priority}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态">
                {initValues.disabled}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注">
                {initValues.comment}
              </Form.Item>
            </Col>
          </Row>
        :
        <>
          <Form.Item label="ID" name="id" style={{display:'none'}}>
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称'}]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item label="代码" name="code" rules={[{required: true, message: '请输入代码'}]}>
            <Input placeholder="请输入代码" />
          </Form.Item>
          <Form.Item label="描述" name="descr">
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item label="优先级" name="priority">
            <InputNumber placeholder="请输入优先级" style={{width:'100%'}} />
          </Form.Item>
          <Form.Item label="状态" name="disabled">
            <Radio.Group>
              <Radio value={false}>启用</Radio>
              <Radio value={true}>停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="comment">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </>
      }
      </Form>
    </Modal>
  )
}

export default React.memo(DetailModal)
