import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Select, Radio, message, Button } from 'antd'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

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
  const { visible, handleCancel, setDirty, template, MyContext } = props
  const { brandOption, suppliersOption, unitClassOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [nameVisible, setNameVisible] = useState()
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      configObjectTemplate.unitDynamicTemplateNew()
        .then(res => {
          setInitValues(res)
          form.resetFields()
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  //新建
  const checkList = (values) => {
    configObjectTemplate.unitDynamicTemplateAdd(
      {
        ...values,
        template: template,
        objectTemplate: form.getFieldValue("code") ? form.getFieldValue("code") : null,
        _method: 'PUT'
      }
    )
      .then(() => {
        message.success("新建成功")
        handleCancel()
        setDirty(dirty => dirty + 1)
      })

  }
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (!values.template) {
          values.name ? checkList(values) : setNameVisible(true)
        } else {
          checkList(values)
        }
      })
      .catch(err => {
        if (!err.values.name) {
          setNameVisible(true)
        }
      })
  }

  //模板名称弹窗确定、取消
  const handleNameOk = () => {
    if (form.getFieldValue("name")) {
      modalClose()
    }
  }
  const modalClose = () => {
    setNameVisible(false)
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
        okButtonProps={{ loading: okLoading }}
      >
        <Form form={form} {...formItemLayout} initialValues={initValues}>
          {

          }
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
                    unitClassOption && unitClassOption.length > 0 && unitClassOption.map(item => (
                      <Select.Option
                        key={item.id}
                        value={item.model.code}
                        type={item.model.type}
                        major={item.model.major}
                        org={item.model.org}
                      >
                        {item.text}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="专业" name="clsMajor">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="类型" name="clsType">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="分类组织" name="clsOrg">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌' }]}>
                <Select
                  placeholder="请选择品牌"
                >
                  {
                    brandOption && brandOption.length > 0 && brandOption.map(item => (
                      <Select.Option key={item.id} value={item.id} code={item.code}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name="modelNumber" rules={[{ required: true, message: '请输入型号' }]}>
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规格" name="spec">
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="版本/镜像" name="version">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 元器件编号" name="componentNumber">
                {
                  <Input placeholder="请输入元器件编号" />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="描述" name="descr" rules={[{ required: true, message: '请输入描述' }]}>
                {
                  <Input placeholder="请输入描述" />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="enable">
                <Radio.Group>
                  <Radio value={true}>启用</Radio>
                  <Radio value={false}>未启用</Radio>
                </Radio.Group>

              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注" name="remarks">
                <Input.TextArea placeholder="请输入备注" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备编号" name="code" style={{ display: "none" }}>
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24}><h3 style={{ marginLeft: '3%' }}>部件信息</h3></Col>
            <Col span={12}>
              <Form.Item label="设计寿命" name="designLife">
                <InputNumber placeholder="请输入设计寿命" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="大修年限" name="repairLife">
                <InputNumber placeholder="请输入大修年限" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换年限" name="replaceLife">
                <InputNumber placeholder="请输入更换年限" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关键部件" name="criticality">
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商" name="manufact">
                <Select placeholder="请选择制造商" allowClear>
                  {
                    suppliersOption && suppliersOption.length > 0 && suppliersOption.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="一次变比参数" name="transRatio1">
                <InputNumber placeholder="请输入一次变比参数" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="二次变比参数" name="transRatio2">
                <InputNumber placeholder="请输入二次变比参数" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制E码/订货编号" name="ecode">
                <Input placeholder="请输入E码/订货编号" />
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


      {/* 模板名称弹窗 */}
      <Modal
        maskClosable={false}
        title="模板名称"
        visible={nameVisible}
        onCancel={modalClose}
        onOk={handleNameOk}
        footer={[
          <Button key="submit" type="primary" onClick={handleNameOk}>
            确定
          </Button>,
        ]}
      >
        <div>注：此条新建部件数据会形成模板，请输入模板名称</div>
        <Form form={form}>
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(AddModal)
