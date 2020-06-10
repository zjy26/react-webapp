import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Select, message } from 'antd'
import { properties } from '../../../../../api'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import debounce from 'lodash/debounce'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  }
}

//属性新增编辑弹窗
const CheckSettingModal = props => {
  const { modalProperty, visible, handleCancel, setDirty, MyContext } = props
  const { templateCode, propertiesOption, uomsOption, actUomsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        configObjectTemplate.settingValDetail(modalProperty.id)
          .then(res => {
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined
            })
            form.resetFields()
          })
      } else {
        configObjectTemplate.settingValNew()
          .then(res => {
            setInitValues({
              ...res,
              property: res.property ? res.property : undefined,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined
            })
            form.resetFields()
          })
      }
    }
  }, [form, modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (modalProperty.type === "add") {
          configObjectTemplate.settingValAdd({ ...values, template: templateCode, _method: 'PUT' })
            .then(() => {
              message.success("新建成功")
              handleCancel()
              setDirty(dirty => dirty + 1)
            })
        } else {
          configObjectTemplate.settingValUpdate(modalProperty.id, { ...values, template: templateCode, _method: 'PUT' })
            .then(() => {
              message.success("编辑成功")
              handleCancel()
              setDirty(dirty => dirty + 1)
            })
        }
      })
  }

  //属性搜索时请求
  const propertySearch = (key) => {
    properties({
      limit: 30,
      filter: JSON.stringify([{ property: 'desc', value: key }])
    })
      .then(res => {
        setPropertyData(res.models)
      })
  }
  const handleSearch = debounce(propertySearch, 500)

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      width={800}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form name="templateSettingForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="组别" name="group">
              <Input placeholder="请输入组别" />
            </Form.Item>
          </Col>
          <Col span={12}>
            {
              modalProperty.type === "add" ?
                <Form.Item label="属性代码" name="property" rules={[{ required: true, message: '请输入属性代码' }]}>
                  <Select
                    allowClear
                    showSearch
                    placeholder="请输入属性代码"
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (val, opt) => form.setFieldsValue({
                        descr: opt.name
                      })
                    }
                  >
                    {
                      propertyData.map(item => (
                        <Select.Option key={item.code} value={item.code} name={item.desc}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                :
                <Form.Item label="属性代码" name="property">
                  <Input disabled />
                </Form.Item>
            }
          </Col>
          <Col span={12}>
            <Form.Item label="属性名称" name="descr">
              <Input placeholder="请输入属性名称" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="默认值" name="defaultValue">
              <InputNumber placeholder="请输入默认值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="计量单位" name="uom">
              <Select placeholder="请选择计量单位" allowClear>
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
          </Col>
          <Col span={12}>
            <Form.Item label="动作时限" name="actTimeLimit">
              <InputNumber placeholder="请输入动作时限" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="动作计量单位" name="actUom">
              <Select placeholder="请选择动作计量单位" allowClear>
                {
                  actUomsOption.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remarks">
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(CheckSettingModal)
