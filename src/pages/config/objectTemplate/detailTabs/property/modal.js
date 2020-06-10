import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, Checkbox, message } from 'antd'
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
const CheckPropertyModal = props => {
  const { modalProperty, visible, handleCancel, setDirty, MyContext } = props
  const { templateCode, propertiesOption, uomsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)

  useEffect(() => {
    if (visible) {
      if (modalProperty.type === "edit") {
        configObjectTemplate.proValueDetail(modalProperty.id)
          .then(res => {
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
              test: res.test ? ["test"] : []
            })
            form.resetFields()
          })
      } else {
        configObjectTemplate.proValueNew()
          .then(res => {
            setInitValues({
              ...res,
              code: res.code ? res.code : undefined,
              uom: res.uom ? res.uom : undefined,
              test: res.test ? ["test"] : []
            })
            form.resetFields()
          })
      }
    }
  }, [visible, form, modalProperty.id, modalProperty.type])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log(values)
        var params = {
          ...values,
          test: values.test.length > 0 ? true : false,
          template: templateCode,
          _method: 'PUT'
        }

        if (modalProperty.type === "add") {
          configObjectTemplate.proValueAdd(params)
            .then(res => {
              if (res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("新建失败")
              }
            })
        } else {
          configObjectTemplate.proValueUpdate(modalProperty.id, params)
            .then(res => {
              if (res.success) {
                message.success("编辑成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error("编辑失败")
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
    >
      <Form name="templatePropertyForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            {
              modalProperty.type === "add" ?
                <Form.Item label="属性代码" name="code" rules={[{ required: true, message: '请输入属性代码' }]}>
                  <Select
                    showSearch
                    placeholder="请输入属性代码"
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (val, opt) => form.setFieldsValue({
                        "test": opt.test === "true" ? ["test"] : [],
                        descr: opt.name
                      })
                    }
                  >
                    {
                      propertyData.map(item => (
                        <Select.Option key={item.code} value={item.code} test={item.test.toString()} name={item.desc}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                :
                <Form.Item label="属性代码" name="code">
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
            <Form.Item label="试验属性" name="test">
              <Checkbox.Group>
                <Checkbox value="test" />
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性值" name="value">
              <Input placeholder="请输入属性值" />
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
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性标准值1" name="stdValue1">
              <Input placeholder="请输入属性值1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性标准值2" name="stdValue2">
              <Input placeholder="请输入属性值2" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="故障原因" name="reason">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="处理方法" name="action">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remarks">
              <Input.TextArea placeholder="请输入属性值" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(CheckPropertyModal)
