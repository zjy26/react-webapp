import React, { useEffect, useState, useContext } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Modal, Input, Row, Col, Select, Radio, Upload, message, Button } from 'antd'
import { configLocation } from '../../../../../api/config/lineInfo'

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

const SiteModal = props => {
  const { modalProperty, visible, setDirty, handleCancel, MyContext, data } = props
  const { entity, lineCode, org } = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [prefix, setPrefix] = useState()

  useEffect(() => {
    if (visible) {
      modalProperty.type === "add" ?
        configLocation.configLocationNew({ level: 4, line: lineCode })
          .then((res) => {
            setPrefix(res.code)
            const { code, ...data } = res
            setInitValues({
              ...data,
              code: null,
              mapField: res.mapField ? res.mapField : undefined,
              siteFunction: res.siteFunction ? res.siteFunction : undefined,
              style: res.style ? res.style : undefined,
              locationType: res.locationType ? res.locationType : undefined,
            })
            form.resetFields()
          })
        :
        configLocation.configLocationDetail(modalProperty.siteId)
          .then(res => {
            if (res) {
              const siteFunctionValue = entity.siteFunctionOption.find(obj => obj.code === res.siteFunction)
              const styleValue = entity.styleOption.find(obj => obj.code === res.style)
              const locationTypeValue = entity.locationTypeOption.find(obj => obj.code === res.locationType)
              modalProperty.type === "check" ?
                setInitValues({
                  ...res,
                  isDutyPoint: res.isDutyPoint ? "是" : "否",
                  siteFunction: siteFunctionValue ? siteFunctionValue.name : null,
                  style: styleValue ? styleValue.name : null,
                  locationType: locationTypeValue ? locationTypeValue.name : null
                })
                :
                setInitValues({
                  ...res,
                  mapField: res.mapField ? res.mapField : undefined,
                  siteFunction: res.siteFunction ? res.siteFunction : undefined,
                  style: res.style ? res.style : undefined,
                  locationType: res.locationType ? res.locationType : undefined,
                })

              form.resetFields()
            }
          })
    }

  }, [entity.locationTypeOption, entity.siteFunctionOption, entity.styleOption, form, lineCode, modalProperty.siteId, modalProperty.type, visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        switch (modalProperty.type) {
          case "add":
            const { code, ...data } = values
            const params = {
              ...data,
              level: 4,
              org: org,
              code: `${prefix}${values.code}`
            }
            configLocation.configLocationAdd(params)
              .then((res) => {
                if (res.success) {
                  handleCancel()
                  setDirty((dirty) => dirty + 1)
                  message.success("新建成功")
                } else {
                  message.error(res.actionErrors[0])
                }
              })
            break;
          case "edit":
            configLocation.configLocationUpdate(modalProperty.siteId, { ...values, _method: 'PUT' })
              .then(() => {
                message.success("编辑成功")
                setDirty(dirty => dirty + 1)
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
      maskClosable={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      width="700px"
      onOk={handleSubmit}
      visible={visible}
      onCancel={handleCancel}
      footer={
        modalProperty.type === "check" ? null :
          [
            <Button key="cancel" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>确定</Button>
          ]
      }
    >
      <Form name="lineLocationForm" {...formItemLayout} form={form} initialValues={initValues}>
        {
          modalProperty.type === "check" ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="站点代码">
                  {initValues.code}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点名称">
                  {initValues.desc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="编码">
                  {initValues.mapField}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {initValues.telPhone}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="地址">
                  {initValues.address}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站类型">
                  {initValues.siteFunction}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="变电所类型">
                  {initValues.style}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站位置类型">
                  {initValues.locationType}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="建设期">
                  {initValues.buildPeriod}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="值守点">
                  {initValues.isDutyPoint}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HT图形">
                  <Upload
                    listType="picture-card"
                  >
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="平面图">
                  <Upload
                    listType="picture-card"
                  >
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            :
            <Row gutter={24}>
              <Col span={12}>
                {
                  modalProperty.type === "add" ?
                    <Form.Item
                      label="站点代码"
                      name="code"
                      rules={[
                        { whitespace: true, message: '内容不能为空' },
                        { required: true, message: '请输入站点代码' }
                      ]}
                    >
                      <Input addonBefore={prefix} maxLength={2} placeholder="请输入站点代码" />
                    </Form.Item>
                    :
                    <Form.Item label="站点代码" name="code">
                      <Input disabled />
                    </Form.Item>
                }
              </Col>
              <Col span={12}>
                <Form.Item
                  label="站点名称"
                  name="desc"
                  rules={[
                    { max: 20, message: '最大长度为20个字符' },
                    { whitespace: true, message: '内容不能为空' },
                    { required: true, message: '请输入站点名称' }
                  ]}
                >
                  <Input placeholder="请输入站点名称" maxLength={20} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="编码" name="mapField">
                  <Select
                    placeholder="请选择编码"
                    allowClear
                    showSearch
                  >
                    {
                      data.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.code}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="联系电话"
                  name="telPhone"
                  rules={[{
                    required: false,
                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号'
                  }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="地址" name="address">
                  <Input placeholder="请输入地址" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站类型" name="siteFunction">
                  <Select placeholder="请选择车站类型" allowClear>
                    {
                      entity.siteFunctionOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="变电所类型" name="style">
                  <Select placeholder="请选择变电所类型" allowClear>
                    {
                      entity.styleOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站位置类型" name="locationType">
                  <Select placeholder="请选择车站位置类型" allowClear>
                    {
                      entity.locationTypeOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="建设期" name="buildPeriod">
                  <Input placeholder="请输入建设期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="值守点" name="isDutyPoint">
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HT图形">
                  <Upload
                    listType="picture-card"
                  >
                    <PlusOutlined />
                  </Upload>
                  <div>不超过20M,格式为jpg，png</div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="平面图">
                  <Upload
                    listType="picture-card"
                  >
                    <PlusOutlined />
                  </Upload>
                  <div>不超过20M,格式为jpg，png</div>
                </Form.Item>
              </Col>
            </Row>
        }
      </Form>
    </Modal>
  )
}

export default React.memo(SiteModal)
