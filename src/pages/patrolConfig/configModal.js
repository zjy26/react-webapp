import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, Select } from 'antd';
import { robotConfig } from '../../api'

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

const ConfigModal = props => {
  const {currentId, handleCancel, setDirty, title, visible, locationTree } = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    //查看详情
    if(currentId) {
      robotConfig.robotConfigDetail(currentId)
      .then((res) =>{
        if(res){
          setInitValues({...res, siteLine: res.site.slice(0, 4)})
          form.resetFields()
        }
      })
    } else {
      form.resetFields()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, visible])

  const handleSubmit = () => {
    form.validateFields()
    .then(values => {
      let {siteLine, ...data} = values
      let params = {...data}
      if(values.id) {//编辑
        Modal.confirm({
          title: '确认提示',
          content: '是否确认修改？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=> {
            robotConfig.robotConfigEdit(values.id, params)
            .then((res)=>{
              handleCancel()
              setDirty((dirty)=>dirty+1)
            })
          },
          onCancel() {
          },
        })
      } else {//添加
        robotConfig.robotConfigAdd(params)
        .then(()=>{
          handleCancel()
          setDirty((dirty)=>dirty+1)
        });
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
        <Form.Item
          label="id" 
          name="id"
          style={{display: 'none'}}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="线路"
          name="siteLine"
          rules= {[{required: true}]}
        >
          <Select placeholder="请选择线路">
            {locationTree.line && locationTree.line.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="站点"
          name="site"
          rules= {[{required: true}]}
        >
          <Select placeholder="请选择站点">
            {locationTree.site && locationTree.site.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="服务器IP"
          name="ip"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入服务器IP"/>
        </Form.Item>
        <Form.Item
          label="服务器端口"
          name="port"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入服务器端口"/>
        </Form.Item>
        <Form.Item
          label="视频流推送"
          name="cameraStreamUrl"
          rules= {[{required: true}]}
        >
          <Input placeholder="请输入视频流推送"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ConfigModal)
