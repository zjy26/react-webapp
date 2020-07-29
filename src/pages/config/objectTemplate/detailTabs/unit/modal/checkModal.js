import React, { useState, useEffect } from 'react'
import { Modal, Form, Row, Col, Upload } from 'antd'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'
import { echoBrand } from '../../../../../../api'
import { showFile } from '../../../../../common/upload'

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
  const { modalProperty, visible, handleCancel, unitClassOption } = props

  const [fileList, setFileList] = useState({
    objImage: [],
    objBim: []
  })
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  })

  //部件分类
  const clsArr = []
  unitClassOption.map(item => {
    clsArr.push(item.model)
    return clsArr
  })

  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (visible) {
      configObjectTemplate.unitTemplateDetail(modalProperty.id)
        .then(res => {
          const detail = res.detail
          if(detail) {  //有关联模板时详情数据
            const item = clsArr.find(obj => obj.code === detail.cls)
            setInitValues({
              ...res,
              brand: detail.brand && detail.brand.name,
              designLife:detail.designLife,
              repairLife:detail.repairLife,
              replaceLife:detail.replaceLife,
              cls: item ? item.desc : undefined,
              manufact: detail.manufact && detail.manufact.name ? detail.manufact.name : null,
              criticality: res.criticality === true ? "是" : "否",
            })

            showFile(detail.id, "d9ObjectTemplate-image", setFileList, "objImage")
            showFile(detail.id, "d9ObjectTemplate-bim", setFileList, "objBim")
          } else {    //无关联模板时详情数据
            echoBrand({value: res.brand})
            .then(brand => {
              const clsItem = clsArr.find(obj => obj.code === res.cls)
              setInitValues({
                ...res,
                brand: brand.name,
                cls: clsItem ? clsItem.desc : null,
                criticality: res.criticality === true ? "是" : "否",
              })
              setFileList({
                objImage: [],
                objBim: []
              })
            })
          }
          return detail
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  //图片预览
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreview({
      ...preview,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  const previewCancel = () => setPreview({ ...preview, previewVisible: false })

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
            <Form.Item label="部件名称">{initValues.name}</Form.Item>
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
            <Form.Item label="关键部件">{initValues.criticality}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="	元器件编号">{initValues.componentNumber}</Form.Item>
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
            <Form.Item label="制造商">{initValues.manufact}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="部件图片">
              <Upload
                fileList={fileList.objImage}
                listType="picture-card"
                onPreview={handlePreview}
                disabled
              />
              <Modal
                visible={preview.previewVisible}
                title={preview.previewTitle}
                footer={null}
                onCancel={previewCancel}
              >
                <img alt="部件图片" style={{ width: '100%' }} src={preview.previewImage} />
              </Modal>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="BIM结构图">
              <Upload fileList={fileList.objBim} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default React.memo(CheckModal)
