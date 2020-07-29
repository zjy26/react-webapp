import React, { useEffect, useState, useContext } from 'react'
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

const CheckTestModal = props => {
  const { modalProperty, visible, handleCancel, setDirty, MyContext } = props
  const { templateCode, propertiesOption, uomsOption, actUomsOption, experimentStandardTypeOption, experimentStandardValueOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)
  const [standardVal, setStandardVal] = useState('D')
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      if (modalProperty.type === "edit") {
        configObjectTemplate.testTemplateDetail(modalProperty.id)
          .then(res => {
            //属性回显
            setPropertyData([...propertyData, {code: res.property, desc:res.descr}])
            setStandardVal(res.standardValueType)
            setInitValues({
              ...res,
              stdValue: res.stdValue ? res.stdValue : undefined,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined,
            })
            form.resetFields()
          })
      } else {
        configObjectTemplate.testTemplateNew()
          .then(res => {
            setStandardVal("D")
            setInitValues({
              ...res,
              standardValueType: "D",
              property: res.property ? res.property : undefined,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined,
            })
            form.resetFields()
          })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (modalProperty.type === "add") {
          configObjectTemplate.testTemplateAdd({ ...values, template: templateCode, _method: 'PUT' })
            .then((res) => {
              if(res && res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("新建失败")
                setOkLoading(false)
              }
            })
        } else {
          configObjectTemplate.testTemplateUpdate(modalProperty.id, { ...values, template: templateCode, _method: 'PUT' })
            .then((res) => {
              if(res && res.success) {
                message.success("编辑成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("编辑失败")
                setOkLoading(false)
              }
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
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="templateTestForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            {
              modalProperty.type === "add" ?
                <Form.Item label="属性名称" name="property" rules={[{ required: true, message: '请输入属性名称' }]}>
                  <Select
                    allowClear
                    showSearch
                    placeholder="请输入属性名称"
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (val, opt) => form.setFieldsValue({
                        descr: opt.name,
                        uom: opt.uom
                      })
                    }
                  >
                    {
                      propertyData.map(item => (
                        <Select.Option key={item.code} value={item.code} name={item.desc} uom={item.uom}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                :
                <Form.Item label="属性名称" name="property">
                  <Select disabled>
                    {
                      propertyData.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
            }
          </Col>
          <Col span={12} hidden>
            <Form.Item label="属性名称" name="descr">
              <Input placeholder="请输入属性名称" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="标准值类型"
              name="standardValueType"
              rules={[{ required: true, message: '请选择标准值类型' }]}
            >
            <Select
              placeholder="请选择标准值类型"
              onChange={
                val => {
                  setStandardVal(val)
                  form.setFieldsValue({
                    max: null,
                    min: null,
                    stdValue: undefined
                  })
                }
              }
            >
              {
                experimentStandardTypeOption.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
            </Form.Item>
          </Col>
          {
            standardVal === "D"
            ? <>
                <Col span={12}>
                  <Form.Item label="标准值上限" name="max">
                    <InputNumber placeholder="请输入标准值上限" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="标准值下限" name="min">
                    <InputNumber placeholder="请输入标准值下限" />
                  </Form.Item>
                </Col>
              </>
            : <Col span={12}>
                <Form.Item label="标准值" name="stdValue">
                  <Select placeholder="请选择标准值" allowClear>
                    {
                      experimentStandardValueOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
          }
          <Col span={12}>
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item label="时限" name="actTimeLimit">
              <InputNumber placeholder="请输入时限" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="时限单位" name="actUom">
              <Select placeholder="请选择时限单位" allowClear>
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

export default React.memo(CheckTestModal)
