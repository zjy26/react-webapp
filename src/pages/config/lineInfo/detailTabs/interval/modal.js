import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, Row, Col, Select, Radio, message } from 'antd'
import { configLocation } from '../../../../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
}

const IntervalModal = props => {
  const {modalProperty, visible, setDirty, handleCancel, MyContext} = props
  const {entity, lineCode, siteList} = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(()=>{
    if(visible) {
      modalProperty.type==="add" ?
      configLocation.configIntervalNew()
      .then((res)=>{
        setInitValues(res)
        form.resetFields()
      })
      :
      configLocation.configIntervalDetail(modalProperty.id)
      .then(res=> {
        if(res) {
          const catenaryTypeValue = entity.catenaryTypeOption.find(obj=> obj.code === res.catenaryType)
          modalProperty.type === "check" ?
          setInitValues({
            ...res,
            isLarge: res.isLarge ? "是" : "否",
            hasIntervalPlace: res.hasIntervalPlace ? "有" : "无",
            catenaryType: catenaryTypeValue ? catenaryTypeValue.name : null
          })
          :
          setInitValues(res)

          form.resetFields()
        }
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
    .then(values => {
      switch (modalProperty.type) {
        case "add":
          configLocation.configIntervalAdd({...values, line:lineCode})
          .then(()=>{
            handleCancel()
            setDirty((dirty)=>dirty+1)
          })
          break;
        case "edit":
          configLocation.configIntervalUpdate(modalProperty.id, {...values, _method:'PUT'})
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
      width="700px"
      onOk= {handleSubmit}
      visible={visible}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout} form={form} initialValues={initValues}>
      {
        modalProperty.type === "check" ?
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="区间名称">
              {initValues.descr}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点1名称">
              {initValues.site1}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点2名称">
              {initValues.site2}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="行车路线">
              {initValues.vehicleRoute}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型">
              {initValues.catenaryType}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="是否长/大区间">
              {initValues.isLarge}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="有无区间所">
              {initValues.hasIntervalPlace}
            </Form.Item>
          </Col>
        </Row>
       :
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="区间名称" name="descr" rules={[{required: true, message: '请输入区间名称'}]}>
              <Input placeholder="请输入区间名称"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点1名称" name="site1" rules={[{required: true, message: '请选择站点1名称'}]}>
              <Select placeholder="请选择站点1名称">
                {
                  siteList.map(item=>(
                    <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点2名称" name="site2" rules={[{required: true, message: '请选择站点2名称'}]}>
              <Select placeholder="请选择站点2名称">
                {
                  siteList.map(item=>(
                    <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="行车路线" name="vehicleRoute">
              <Select placeholder="请选择行车路线" allowClear>
                {
                  entity.vehicleRouteOption.map(item=>(
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型" name="catenaryType">
              <Select placeholder="请选择触网类型" allowClear>
                {
                  entity.catenaryTypeOption.map(item=>(
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="大长区间" name="isLarge" rules={[{required: true, message: '请选择大长区间'}]}>
              <Radio.Group>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="区间所" name="hasIntervalPlace" rules={[{required: true, message: '请选择有无区间所	'}]}>
              <Radio.Group>
                <Radio value={true}>有</Radio>
                <Radio value={false}>无</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      }
      </Form>
    </Modal>
  )
}

export default React.memo(IntervalModal)
