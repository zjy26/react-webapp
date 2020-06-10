import React, { useState, useEffect } from 'react'
import { Modal, Form, Row, Col } from 'antd'
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

const CheckModal = props => {
  const { modalProperty, visible, handleCancel, activeKey, unitClassOption } = props

  //部件分类
  const clsArr = []
  unitClassOption.map(item => {
    clsArr.push(item.model)
    return clsArr
  })

  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (visible) {
      if (activeKey === "static") {
        configObjectTemplate.unitTemplateDetail(modalProperty.id)
          .then(res => {
            const detail = res.detail
            if(detail) {  //有关联模板时详情数据
              const item = clsArr.find(obj => obj.code === detail.cls)
              setInitValues({
                ...detail,
                cls: detail.cls ? item.desc : null,
                brand: detail.brand && detail.brand.name ? detail.brand.name : null,
                manufact: detail.manufact && detail.manufact.name ? detail.manufact.name : null,
                enable: detail.enable === true ? "启用" : "未启用",
                criticality: detail.criticality === true ? "是" : "否",
              })
            } else {    //TODO无关联模板时详情数据
              setInitValues({
                ...res
              })
            }
          })
      } else {
        configObjectTemplate.unitDynamicTemplateDetail(modalProperty.id)
          .then(res => {
            const item = clsArr.find(obj => obj.code === res.cls)
            setInitValues({
              ...res.detail,
              cls: res.cls ? item.desc : null,
              brand: res.brand && res.brand.descr ? res.brand.descr : null,
              manufact: res.manufact && res.manufact.name ? res.manufact.name : null,
              enable: res.enable === true ? "启用" : "未启用",
              criticality: res.criticality === true ? "是" : "否",
            })
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, activeKey])


  return (
    <Modal
      maskClosable={false}
      title="详情"
      width={800}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form {...formItemLayout}>
        <Row gutter={24}>
          <Col span={24}><h3 style={{ marginLeft: '3%' }}>基础信息</h3></Col>
          <Col span={12}>
            <Form.Item label="部件分类">{initValues.cls}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="品牌">{initValues.brand}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="型号">{initValues.modelNumber}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格">{initValues.spec}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="	元器件编号">{initValues.componentNumber}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{initValues.descr}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="状态">{initValues.enable}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{initValues.remarks}</Form.Item>
          </Col>

          <Col span={24}><h3 style={{ marginLeft: '3%' }}>部件信息</h3></Col>
          <Col span={12}>
            <Form.Item label="设计寿命">{initValues.designLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="大修年限">{initValues.repairLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="更换年限">{initValues.replaceLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="关键部件">{initValues.criticality}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造商">{initValues.manufact}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="一次变比参数">{initValues.transRatio1}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="二次变比参数">{initValues.transRatio2}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制E码/订货编号">{initValues.ecode}</Form.Item>
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
  )
}
export default React.memo(CheckModal)
