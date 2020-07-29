import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, message, Radio, InputNumber } from 'antd'
import { properties, echoProperty } from '../../../../../api'
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
  const { modalProperty, visible, handleCancel, setDirty, MyContext, unitOption } = props
  const { templateCode, uomsOption, actUomsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [property, setProperty] = useState({
    data1: [],
    data2: []
  })
  const [calculate, setCalculate]= useState(false)
  const [okLoading, setOkLoading] = useState(false)

  //属性
  const propertyRequest = (sysFilterSql, filter, option) => {
    properties({
      limit: 30,
      sysFilterSql: sysFilterSql,
      filter: filter
    })
      .then(res => {
        const obj = {}
        obj[option] = res.models
        setProperty(property => {
          return { ...property, ...obj }
        })
      })
  }

  useEffect(() => {
    //遥测属性
    propertyRequest("pro_source = '01'", "[]", "data1")

    //遥信属性
    propertyRequest("pro_source = '02'", "[]", "data2")

  }, [])

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      if (modalProperty.type === "edit") {
        configObjectTemplate.settingValDetail(modalProperty.id)
          .then(res => {
            //关联属性报警和关联属性投用字段回显
            if(res.alarmProperty) {
              echoProperty({value:res.alarmProperty})
              .then(data => {
                setProperty((property) =>{
                  return {
                    ...property,
                    data1: [...property.data1, data.model]
                  }
                })
              })
            }
            if(res.applyProperty) {
              echoProperty({value:res.applyProperty})
              .then(data => {
                setProperty((property) =>{
                  return {
                    ...property,
                    data2: [...property.data2, data.model]
                  }
                })
              })
            }
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined,
            })
            form.resetFields()
          })
      } else {
        configObjectTemplate.settingValNew()
          .then(res => {
            setInitValues({
              ...res,
              unit: res.unit ? res.unit : undefined,
              uom: res.uom ? res.uom : undefined,
              actUom: res.actUom ? res.actUom : undefined,
              alarmProperty: res.alarmProperty ? res.alarmProperty : undefined,
              applyProperty: res.applyProperty ? res.applyProperty : undefined,
            })
            form.resetFields()
          })
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, modalProperty.id, modalProperty.type, visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (modalProperty.type === "add") {
          configObjectTemplate.settingValAdd({ ...values, template: templateCode, _method: 'PUT' })
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
          configObjectTemplate.settingValUpdate(modalProperty.id, { ...values, template: templateCode, _method: 'PUT' })
            .then((res) => {
              if(res && res.success) {
                message.success("编辑成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else{
                message.error("编辑失败")
                setOkLoading(false)
              }
            })
        }
      })
  }

  //属性搜索时请求
  const handleSearch1 = debounce((key) => {
    propertyRequest("pro_source = '01'", key ? JSON.stringify([{ property: 'desc', value: key }]) : [], "data1")
  }, 500)
  const handleSearch2 = debounce((key) => {
    propertyRequest("pro_source = '02'", key ? JSON.stringify([{ property: 'desc', value: key }]) : [], "data2")
  }, 500)

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
      <Form name="templateSettingForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="关联部件" name="unit">
              <Select placeholder="请选择关联部件">
                {
                  unitOption.length > 0 && unitOption.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.sn}-{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="组别" name="group">
              <Input placeholder="请输入组别" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="运行方式" name="runType">
              <Input placeholder="请输入运行方式" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保护类型" name="protectType" rules={[{ required: true, message: '请输入保护类型' }]}>
              <Input placeholder="请输入保护类型" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="保护参数" name="protectParam">
              <Input placeholder="请输入保护参数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设定参数" name="setPrarm" rules={[{ required: true, message: '请输入设定参数' }]}>
              <Input placeholder="请输入设定参数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="参与计算" name="calculateFunction" >
              <Radio.Group
                onChange={
                  (e) => {
                    setCalculate(e.target.value)
                    form.setFieldsValue({
                      defaultValue: undefined
                    })
                  }
                }
              >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="整定值" name="defaultValue" rules={[{ required: true, message: '请输入整定值' }]}>
              {
                calculate ? <InputNumber placeholder="请输入整定值" />
                : <Input placeholder="请输入整定值" />
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="参数单位" name="uom">
              <Select
                placeholder="请选择参数单位"
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
            <Form.Item label="时限" name="timeLimitParam">
              <Input placeholder="请输入时限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="值" name="actTimeLimit">
              <Input placeholder="请输入值" />
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
            <Form.Item label="作用" name="effect">
              <Input placeholder="请输入作用" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="关联属性报警" name="alarmProperty">
              <Select
                allowClear
                showSearch
                placeholder="请选择关联属性报警"
                filterOption={false}
                onSearch={handleSearch1}
              >
                {
                  property.data1.length > 0 && property.data1.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.code}-{item.desc}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="关联属性投用" name="applyProperty">
              <Select
                allowClear
                showSearch
                placeholder="请选择关联属性报警"
                filterOption={false}
                onSearch={handleSearch2}
              >
                {
                  property.data2.length > 0 && property.data2.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.code}-{item.desc}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="说明" name="descr">
              <Input.TextArea placeholder="请输入说明" />
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
