import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Row, Select, Input, Col, Upload, message, DatePicker } from 'antd'
import { overheadLine,echoSupplier,echoBrand } from '../../../../../api'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import moment from 'moment'
import { showFile } from '../../../../common/upload'

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
  const { modalProperty, visible, handleCancel, activeKey,MyContext } = props
  const [form] = Form.useForm()
  const { brandOption,unitClassOption,unitTemplateOption } = useContext(MyContext)
  const [initValues, setInitValues] = useState({})
  const [okLoading, setOkLoading] = useState(false)

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

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      if (modalProperty.edit === false && modalProperty.type === "static" && modalProperty.detil === true) {
        //查看详情(设备表不存在记录)
        configObjectTemplate.unitTemplateDetail(modalProperty.id)
          .then(res => {
            if (res ) {
              //品牌字段回显
              if(res.brand) {
                echoBrand({value: res.brand})
                .then(brand => {
                  setInitValues({
                    ...res,
                    desc: res.name,
                    brand: brand ? brand.name : undefined,
                    manufact: res.detail && res.detail.manufact && res.detail.manufact.name ? res.detail.manufact.name : undefined,
                    enable: res.enable === true ? "启用" : "未启用",
                    criticality: res.criticality === true ? "是" : "否",
                    commissDate: modalProperty.commissDate ? moment(modalProperty.commissDate) : undefined,
                    objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
                    ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined,
                    designLife: res.detail && res.detail.designLife  ? res.detail.designLife : undefined,
                    repairLife: res.detail && res.detail.repairLife  ? res.detail.repairLife : undefined,
                    replaceLife: res.detail && res.detail.replaceLife  ? res.detail.replaceLife : undefined,
                })
              })
            }else {
                setInitValues({
                  ...res,
                  desc: res.name,
                  manufact: res.detail && res.detail.manufact && res.detail.manufact.name ? res.detail.manufact.name : undefined,
                  enable: res.enable === true ? "启用" : "未启用",
                  criticality: res.criticality === true ? "是" : "否",
                  commissDate: modalProperty.commissDate ? moment(modalProperty.commissDate) : undefined,
                  objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
                  ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined,
                  designLife: res.detail && res.detail.designLife  ? res.detail.designLife : undefined,
                  repairLife: res.detail && res.detail.repairLife  ? res.detail.repairLife : undefined,
                  replaceLife: res.detail && res.detail.replaceLife  ? res.detail.replaceLife : undefined,
                })
              }
              if(res.detail){
                //关联模板中的附件
                showFile(res.detail.id, "d9ObjectTemplate-image", setFileList, "objImage")
                showFile(res.detail.id, "d9ObjectTemplate-bim", setFileList, "objBim")
              } else {
                //关联模板中的附件
                showFile(null, "d9ObjectTemplate-image", setFileList, "objImage")
                showFile(null, "d9ObjectTemplate-bim", setFileList, "objBim")
              }
              form.resetFields()
            }
          })

      } else if (modalProperty.edit === false && modalProperty.type === "dynamic" && modalProperty.detil === true) {
        //动态部件查看详情
        overheadLine.objectUnitDetail(modalProperty.id)
          .then(res => {
            if (res) {
              if(res.template){
                const template = unitTemplateOption.find(obj => obj.code === res.template)
                if(template)
                {
                  showFile(template.id, "d9ObjectTemplate-image", setFileList, "objImage")
                  showFile(template.id, "d9ObjectTemplate-bim", setFileList, "objBim")
                }else{
                  showFile(null, "d9ObjectTemplate-image", setFileList, "objImage")
                  showFile(null, "d9ObjectTemplate-bim", setFileList, "objBim")
                }

              }else{
                showFile(null, "d9ObjectTemplate-image", setFileList, "objImage")
                showFile(null, "d9ObjectTemplate-bim", setFileList, "objBim")
              }
              //const item = clsArr.find(obj => obj.code === res.firstLevelCls)
              setInitValues({
                ...res,
                //cls: item ? item.desc : undefined,
                brand: res.brand && res.brand.name ? res.brand.name : undefined,
                manufact: res.manufact ? res.manufact.name : undefined,
                enable: res.enable === true ? "启用" : "未启用",
                criticality: res.criticality === true ? "是" : "否",
                commissDate: res.commissDate ? moment(res.commissDate) : null,
                objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
                ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined
              })
              form.resetFields()
            }
          })
      }
      else if (modalProperty.edit === true && modalProperty.type === 'static') {
        //静态部件编辑
        form.setFieldsValue({
          name: modalProperty.desc,
          brand: modalProperty.brand,
          modelNumber: modalProperty.modelNumber,
          spec: modalProperty.spec,
          commissDate: modalProperty.commissDate ? moment(modalProperty.commissDate) : null,
          objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
          ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined
        })
      } else {
        overheadLine.objectUnitDetail(modalProperty.id)
          .then(res => {
            if(res.template){
              const template = unitTemplateOption.find(obj => obj.code === res.template)
              showFile(template.id, "d9ObjectTemplate-image", setFileList, "objImage")
              showFile(template.id, "d9ObjectTemplate-bim", setFileList, "objBim")
            }else{
              //关联模板中的附件
              showFile(null, "d9ObjectTemplate-image", setFileList, "objImage")
              showFile(null, "d9ObjectTemplate-bim", setFileList, "objBim")
            }
            //制造商字段回显
            if(res.manufact) {
            echoSupplier({value: res.manufact})
              .then( manufact => {
                setInitValues({
                  ...res,
                  name:res.desc,
                  brand: res.brand && res.brand.name ? res.brand.name : undefined,
                  //cls: item ? item.desc : undefined,
                  manufact: manufact ? manufact.name : undefined,
                  enable: res.enable === true ? "启用" : "未启用",
                  criticality: res.criticality === true ? "是" : "否",
                  commissDate: res.commissDate ? moment(res.commissDate) : undefined,
                  objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
                  ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined
                })
              })
            }else{
              //const item = clsArr.find(obj => obj.code === res.firstLevelCls)
              setInitValues({
                ...res,
                name:res.desc,
                brand: res.brand && res.brand.name ? res.brand.name : undefined,
                //cls: item ? item.desc : undefined,
                enable: res.enable === true ? "启用" : "未启用",
                criticality: res.criticality === true ? "是" : "否",
                commissDate: res.commissDate ? moment(res.commissDate) : undefined,
                objectMark: modalProperty.objectMark ? modalProperty.objectMark : undefined,
                ecode: modalProperty.fcCode ? modalProperty.fcCode : undefined
              })

            }
            form.resetFields()
          })
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, activeKey])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (modalProperty.edit === false) {
          const params = {
            _method: 'PUT',
            commissDate: values.commissDate ? moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.commissDate,
            objectMark: values.objectMark,
            ecode: values.ecode
          }
          overheadLine.objectUnitUpdate(modalProperty.id, params)
            .then(res => {
              if (res) {
                message.success("修改成功")
                props.renderChildData(true, modalProperty.mainId, modalProperty.templateCode)
                form.resetFields()
                props.setDirty((dirty) => dirty + 1)
                handleCancel()
              }
            })
        } else {
          const params = {
            _method: 'PUT',
            commissDate: values.commissDate ? moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.commissDate,
            objectId: modalProperty.objectId,
            d9OverheadLineObjectId: modalProperty.mainId,
            sn: modalProperty.unitSn,
            objectMark: values.objectMark,
            ecode: values.ecode,
            static: true
          }
          overheadLine.objectUnitUpdate(modalProperty.id, params)
            .then(res => {
              if (res) {
                message.success("修改成功")
                props.renderChildData(true, modalProperty.mainId, modalProperty.templateCode)
                form.resetFields()
                props.setDirty((dirty) => dirty + 1)
                handleCancel()
              }
            })
        }
      }
      )
  }

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
    <React.Fragment>
      <Modal
        maskClosable={false}
        getContainer={false}
        title={modalProperty.title}
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okButtonProps={{ loading: okLoading }}
      >
        {modalProperty.title === '查看详情' ?
        <Form form={form} name="checkForm" {...formItemLayout} initialValues={initValues}>
            <Row gutter={24}>
              <Col span={24}><h3 style={{ marginLeft: '3%' }}>基础信息</h3></Col>
              {/* <Col span={12}>
            <Form.Item label="部件分类">{initValues.cls}</Form.Item>
          </Col> */}
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
                <Form.Item label="元器件编号">{initValues.componentNumber}</Form.Item>
              </Col>
              {/* <Col span={12}>
            <Form.Item label="描述">{initValues.desc}</Form.Item>
          </Col> */}
              {/* <Col span={12}>
            <Form.Item label="状态">{initValues.enable}</Form.Item>
          </Col> */}
              <Col span={12}>
                <Form.Item label="启用日期">{initValues.commissDate ? moment(initValues.commissDate).format('YYYY-MM-DD') : null}</Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="部件标识">{initValues.objectMark}</Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="E码/订货编号">{initValues.ecode}</Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="备注">{initValues.remarks}</Form.Item>
              </Col>
              <Col span={24}><h3 style={{ marginLeft: '3%' }}>部件信息</h3></Col>
              <Col span={12}>
                <Form.Item label="设计寿命">
                  {initValues.designLife?initValues.designLife+'年':null}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="大修年限">
                  {initValues.repairLife?initValues.repairLife+'年':null}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="更换年限">
                  {initValues.replaceLife?initValues.replaceLife+'年':null}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="关键部件">{initValues.criticality}</Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制造商">{initValues.manufact}</Form.Item>
              </Col>
              {/* <Col span={12}>
            <Form.Item label="一次变比参数">{initValues.transRatio1}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="二次变比参数">{initValues.transRatio2}</Form.Item>
          </Col> */}
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
            :
            <Form form={form} name="checkForm" {...formItemLayout} initialValues={initValues}>
              <Row gutter={24}>
                {<Col span={24}><h3 style={{ marginLeft: '3%' }}>基础信息</h3></Col>}
                {/* <Col span={12}>
                  {modalProperty.edit ===false?
                  <Form.Item label="部件分类" name="firstLevelCls">
                    <Select placeholder="请选择设备分类" disabled>
                      {
                        unitClassOption && unitClassOption.length>0 && unitClassOption.map(item=> (
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
                  </Form.Item>:<Form.Item label="部件分类" name="cls">
                    <Select placeholder="请选择设备分类" disabled>
                      {
                        unitClassOption && unitClassOption.length>0 && unitClassOption.map(item=> (
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
                  </Form.Item>}
                </Col> */}
                <Col span={12}>
                  <Form.Item label="部件名称" name="name">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="品牌" name="brand">
                    <Select placeholder="请选择品牌" disabled>
                      {
                        brandOption && brandOption.length > 0 && brandOption.map(item => (
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="型号" name="modelNumber">
                    <Input placeholder="请输入型号" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="规格" name="spec">
                    <Input placeholder="请输入规格" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="启用日期" name="commissDate" rules={[{ required: true, message: '请选择启用日期' }]}>
                    <DatePicker placeholder="请选择启用日期" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="部件标识" name="objectMark">
                    <Input placeholder="请输入部件标识" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="E码/订货编号" name="ecode">
                    <Input placeholder="请输入E码/订货编号" />
                  </Form.Item>
                </Col>
              </Row>
              </Form>}
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(CheckModal)
