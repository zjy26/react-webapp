import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Select, Radio, message } from 'antd'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  }
}

const AddModal = props => {
  const { visible, handleCancel, setDirty, activeKey, MyContext } = props
  const { templateCode, brandOption, unitClassOption, suppliersOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [associated, setAssociated] = useState([])

  const [brandCode, setBrandCode] = useState()

  useEffect(() => {
    if (visible) {
      if (activeKey === "static") {
        configObjectTemplate.unitTemplateNew()
          .then(res => {
            setInitValues({
              ...res,
              cls: res.cls ? res.cls : undefined,
              brand: res.brand ? res.brand : undefined,
              template: undefined
            })
            setBrandCode(undefined)
            form.resetFields()
          })
      } else {
        configObjectTemplate.unitDynamicTemplateNew()
          .then(res => {
            setInitValues({
              ...res,
              cls: res.cls ? res.cls : undefined,
              brand: res.brand ? res.brand : undefined,
              template: undefined
            })
            form.resetFields()
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, activeKey])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (activeKey === "static") {
          configObjectTemplate.unitTemplateAdd(
            {
              template: templateCode,
              objectTemplate: form.getFieldValue("code") ? form.getFieldValue("code") : null,
              _method: 'PUT'
            }
          )
            .then((res) => {
              if (res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error(res.message)
              }
            })
        } else {
          configObjectTemplate.unitDynamicTemplateAdd(
            {
              template: templateCode,
              objectTemplate: form.getFieldValue("code") ? form.getFieldValue("code") : null,
              _method: 'PUT'
            }
          )
            .then((res) => {
              if (res.success) {
                message.success("新建成功")
                handleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.error(res.message)
              }
            })
        }
      })
  }

  //关联模板
  const associatedTemplate = (open) => {
    if (open) {
      configObjectTemplate.associatedTemplate(
        {
          type: "02",
          cls: form.getFieldValue("cls"),
          brand: brandCode,
          modelNumber: form.getFieldValue("modelNumber"),
          spec: form.getFieldValue("spec")
        }
      )
        .then(res => {
          if (res && res.models) {
            setAssociated(res.models)
          }
        })
    }
  }
  const templateChange = (val) => {
    if (val) {
      const item = associated.find(item => item.id === val)
      const { brand, manufact, ...data } = item
      const manufactVal = suppliersOption.find(obj => obj.code === item.manufact)
      form.setFieldsValue({
        ...data,
        manufact: manufactVal ? manufactVal.id : null
      })
    } else {
      form.resetFields()
    }
  }

  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        getContainer={false}
        title="新建"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form name="templateUnitForm" form={form} {...formItemLayout} initialValues={initValues}>
          <Row gutter={24}>
            <Col span={24}><h3 style={{ marginLeft: '3%' }}>基础信息</h3></Col>
            <Col span={12}>
              <Form.Item label="部件分类" name="cls" rules={[{ required: true, message: '请选择设备分类' }]}>
                <Select
                  showSearch
                  placeholder="请选择部件分类"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={
                    (val, opt) => form.setFieldsValue({
                      template: null,
                      clsType: opt.type,
                      clsMajor: opt.major,
                      clsOrg: opt.org
                    })
                  }
                >
                  {
                    unitClassOption.map(item => (
                      <Select.Option
                        key={item.id}
                        value={item.model.code}
                        type={item.model.type}
                        major={item.model.major}
                        org={item.model.org}
                      >
                        {item.model.desc}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} hidden>
              <Form.Item label="专业" name="clsMajor">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12} hidden>
              <Form.Item label="类型" name="clsType">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12} hidden>
              <Form.Item label="分类组织" name="clsOrg">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌' }]}>
                <Select
                  placeholder="请选择品牌"
                  onChange={(val, opt) => {
                    setBrandCode(opt.code)
                    form.setFieldsValue({ template: null })
                  }}
                >
                  {
                    brandOption.length > 0 && brandOption.map(item => (
                      <Select.Option key={item.id} value={item.id} code={item.code}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="型号"
                name="modelNumber"
                rules={[
                  { whitespace: true, message: '内容不能为空' },
                  { required: true, message: '请输入型号' }
                ]}
              >
                <Input placeholder="请输入型号" onChange={() => form.setFieldsValue({ template: null })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规格" name="spec">
                <Input placeholder="请输入规格" onChange={() => form.setFieldsValue({ template: null })} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关联模板" name="template">
                <Select
                  allowClear
                  placeholder="请选择关联模板"
                  onDropdownVisibleChange={open => associatedTemplate(open)}
                  onChange={
                    val => templateChange(val)
                  }
                >
                  {
                    associated.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                  }
                </Select>

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="版本/镜像" name="version">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 元器件编号" name="componentNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="描述" name="descr">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="enable">
                <Radio.Group disabled>
                  <Radio value={true}>启用</Radio>
                  <Radio value={false}>未启用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注" name="remarks">
                <Input.TextArea disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关联模板编号" name="code" hidden>
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24}><h3 style={{ marginLeft: '3%' }}>部件信息</h3></Col>
            <Col span={12}>
              <Form.Item label="设计寿命" name="designLife">
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="大修年限" name="repairLife">
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换年限" name="replaceLife">
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关键部件" name="criticality">
                <Radio.Group disabled>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商" name="manufact">
                <Select disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="一次变比参数" name="transRatio1">
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="二次变比参数" name="transRatio2">
                <InputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制E码/订货编号" name="ecode">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备图片">

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="BIM结构图">

              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </React.Fragment>
  )
}
export default React.memo(AddModal)
