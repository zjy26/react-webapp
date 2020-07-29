import React, { useEffect, useState, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, message, Radio, InputNumber, Tooltip, Space } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
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
  const [type, setType] = useState(false)
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      if (modalProperty.type === "edit") {
        configObjectTemplate.proValueDetail(modalProperty.id)
          .then(res => {
            //属性回显
            setPropertyData([...propertyData, {code: res.code, desc:res.descr}])
            setType(res.calculateFunction)
            setInitValues({
              ...res,
              uom: res.uom ? res.uom : undefined,
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
            })
            form.resetFields()
          })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, modalProperty.id, modalProperty.type])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        var params = {
          ...values,
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
                setOkLoading(false)
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
      <Form name="templatePropertyForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            {
              modalProperty.type === "add" ?
                <Form.Item label="属性名称" name="code" rules={[{ required: true, message: '请输入属性名称' }]}>
                  <Select
                    showSearch
                    placeholder="请输入属性名称"
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (val, opt) => {
                        form.setFieldsValue({
                          descr: opt.name,
                          uom: opt.uom
                        })
                      }
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
                <Form.Item label="属性名称" name="code">
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
          <Col span={12}>
            <Form.Item
              name="calculateFunction"
              label={
                <Space>
                  计算信息
                  <Tooltip placement="top" title={"需要进行计算的数值可选择是，其他均默认为否"}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Space>
              }
            >
              <Radio.Group
                  onChange ={
                    (e)=>{
                      setType(e.target.value)
                      form.setFieldsValue({value: null})
                    }
                  }
                >
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12} hidden >
            <Form.Item label="属性名称" name="descr" >
              <Input placeholder="请输入属性名称"  />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="属性值" name="value">
              {
                type
                ? <InputNumber placeholder="请输入属性值" />
                : <Input placeholder="请输入属性值" />
              }
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
            <Form.Item label="属性说明" name="alias">
              <Input.TextArea placeholder="请输入属性说明" />
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
