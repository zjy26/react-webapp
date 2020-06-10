import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, Select } from 'antd'
import { robotConfig } from '../../../api'

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

const ConfigModal = (props) => {
  const {locationTree, currentId, newData, title, visible, handleCancel, setDirty} = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [siteOption, setSiteOption] = useState([])

  useEffect(() => {
    //查看详情
    currentId ?
    robotConfig.robotConfigDetail(currentId)
    .then((res) =>{
      if(res){
        setInitValues({...res, siteLine:res.site?res.site.slice(0, 4):null})
        form.resetFields()
        locationTree.lineSite.forEach(item=>{
          if(item.value === res.site.slice(0, 4)) {
            setSiteOption(item.children)
          }
        })
      }
    }) :
    robotConfig.robotConfigNew()
    .then(res => {
      setInitValues({...res, siteLine:res.site?res.site.slice(0, 4):null})
      form.resetFields()
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newData, currentId])

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      const {siteLine, ...data} = values
      const params = {...data, _method: 'PUT'}
      if(values.id ) {//编辑
        form.isFieldsTouched() ?
        Modal.confirm({
          title: '确认提示',
          content: '是否确认修改？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=> {
            robotConfig.robotConfigEdit(values.id, params)
            .then(()=>{
              handleCancel()
              setDirty((dirty)=>dirty+1)
            })
          },
          onCancel() {
          },
        }): handleCancel()
      } else {//添加
        robotConfig.robotConfigAdd(params)
        .then((res)=>{
          handleCancel()
          setDirty((dirty)=>dirty+1)
        })
      }
    })
  }

  return (
    <Modal
      getContainer={false}
      title={title}
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="id" name="id" style={{display: 'none'}}>
          <Input />
        </Form.Item>
        <Form.Item label="线路" name="siteLine" rules={[{required: true, message: '请选择线路'}]}>
          <Select placeholder="请选择线路"
            onChange={
              (value) => {
                locationTree.lineSite && locationTree.lineSite.forEach(item=>{
                  if(item.value === value) {
                    setSiteOption(item.children)
                    form.setFieldsValue({site:null})
                  }
                })
              }
            }
          >
            {locationTree.line && locationTree.line.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="站点" name="site" rules={[{required: true, message: '请选择站点'}]}>
          <Select placeholder="请选择站点">
            {
              siteOption.length>0 && siteOption.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="服务器IP" name="ip">
          <Input placeholder="请输入服务器IP"/>
        </Form.Item>
        <Form.Item label="服务器端口" name="port">
          <Input placeholder="请输入服务器端口"/>
        </Form.Item>
        <Form.Item label="视频流推送" name="cameraStreamUrl">
          <Input placeholder="请输入视频流推送"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ConfigModal)
