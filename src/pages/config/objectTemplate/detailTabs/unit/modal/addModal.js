import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Select, Radio, Upload, message/*, TreeSelect*/ } from 'antd'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'
import { brands, echoSupplier, echoBrand } from '../../../../../../api'
import debounce from 'lodash/debounce'
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

const AddModal = props => {
  const { visible, handleCancel, setDirty, activeKey, MyContext, versionCode,modalProperty } = props
  const { templateCode, brandOption/*, unitClassOption*/ } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [associated, setAssociated] = useState([])
  const [okLoading, setOkLoading] = useState(false)

  const [brandData, setBrandData] = useState(brandOption)

  const [fileList, setFileList] = useState({
    objImage: [],
    objBim: []
  })
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  })

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      associatedTemplate()
      if(modalProperty.type === "edit"){
        configObjectTemplate.unitTemplateDetail(modalProperty.id)
          .then( res => {

            //品牌字段回显
            const brandVal = brandData.find(obj => obj.code === res.brand)
            if(!brandVal) {
              echoBrand({value: res.brand})
                .then( res => {
                  if(res) {
                    const item = brandData.find(obj => obj.code === res.code)
                    if(!item) {
                      setBrandData([...brandData, res])
                    }
                  }
                })
            }

            const detail = res.detail
              //const item = clsArr.find(obj => obj.code === detail.cls)
            if(detail) {  //有关联模板时详情数据
              //const item = clsArr.find(obj => obj.code === detail.cls)
              setInitValues({
                ...res,
                objectTemplateCode: res.objectTemplate,
                objectTemplate: detail.name,
                designLife: detail.designLife,
                repairLife: detail.repairLife,
                replaceLife: detail.replaceLife,
                versionCode: versionCode,
                //cls: item ? item.desc : undefined,
                manufact: detail.manufact && detail.manufact.name ? detail.manufact.name : null,
              })
              form.resetFields()

              showFile(detail.id, "d9ObjectTemplate-image", setFileList, "objImage")
              showFile(detail.id, "d9ObjectTemplate-bim", setFileList, "objBim")
            } else {    //无关联模板时详情数据
              //const clsItem = clsArr.find(obj => obj.code === res.cls)
              setInitValues({
                ...res,
                versionCode: versionCode,
                //cls: clsItem ? clsItem.desc : null,
              })
              setFileList({
                objImage: [],
                objBim: []
              })
              form.resetFields()
            }
          })
      } else {
        configObjectTemplate.unitTemplateNew()
        .then(res => {
          setInitValues({
            ...res,
            versionCode:versionCode,
            cls: res.cls ? res.cls : undefined,
            brand: res.brand ? res.brand : undefined,
            template: undefined,
            objectTemplate: undefined,
          })
          setFileList({
            objImage: [],
            objBim: []
          })
          form.resetFields()
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  //部件新增、编辑
  const unitAdd = (isStatic, values) => {
    if(modalProperty.type === "edit"){
      configObjectTemplate.unitTemplateUpdate(modalProperty.id, {
        ...values,
        isStatic: isStatic,
        objectTemplate: initValues.objectTemplateCode,
        _method: "PUT"
      })
      .then(res => {
        if (res.success) {
          message.success("修改成功")
          handleCancel()
          setDirty(dirty => dirty + 1)
        } else {
          message.error(res.message)
          setOkLoading(false)
        }
      })
    } else {
      configObjectTemplate.unitTemplateAdd(
        {
          ...values,
          isStatic: isStatic,
          template: templateCode,
          cls: '099',
          clsOrg: '*',
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
            setOkLoading(false)
          }
        })
    }

  }
  const handleOk = () => {
    form.validateFields()
    .then(values => {
        setOkLoading(true)
        if (activeKey === "static") {
          unitAdd(true, values)
        } else {
          unitAdd(false, values)
        }
      })
  }

  //关联模板时带入模板数据
  const templateChange = (val) => {
    if (val) {
      const item = associated.find(item => item.code === val)

      const { criticality, name, manufact, ...data } = item

      //制造商字段回显
      if(item.manufact) {
        echoSupplier({value: item.manufact})
        .then( res => {
          if(res && res.name) {
            form.setFieldsValue({manufact: res.name})
          }
        })
      }

      //品牌字段回显
      const brandVal = brandData.find(obj => obj.code === item.brand)
      if(!brandVal) {
        echoBrand({value: item.brand})
          .then( res => {
            if(res) {
              const item = brandData.find(obj => obj.code === res.code)
              if(!item) {
                setBrandData([...brandData, res])
              }
            }
          })
      }

      form.setFieldsValue(data)

      //关联模板下的附件
      if(data.id) {
        showFile(data.id, "d9ObjectTemplate-image", setFileList, "objImage")
        showFile(data.id, "d9ObjectTemplate-bim", setFileList, "objBim")
      }
    }
  }

  //关联模板搜索时请求
  const associatedTemplate = debounce((key) => {
    configObjectTemplate.associatedTemplate(
      {
        type: "02",
        cls: '099',
        brand: form.getFieldValue("brand"),
        modelNumber: form.getFieldValue("modelNumber"),
        limit: 30,
        filter: key ? JSON.stringify([{ property: 'name', value: key }]) : []
      }
    )
      .then(res => {
        setAssociated(res.models)
      })
    }, 500)

  //品牌搜索时请求
  const handleSearch = debounce((key) => {
    brands({
      limit: 30,
      filter: JSON.stringify([{ property: 'name', value: key }])
    })
      .then(res => {
        setBrandData(res.models)
      })
  }, 500)

  // //渲染设备分类、部件分类
  // const renderCls = (data) => {
  //   return data.map((item) => {
  //     if (item.children.length > 0) {
  //       return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc} disabled>{renderCls(item.children)}</TreeSelect.TreeNode>
  //     }
  //     return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>
  //   })
  // }

  // //广度遍历，在树形对象数组结构中查找指定对象
  // const breadthQuery = (tree, code) => {
  //   var stark = []
  //   stark = stark.concat(tree)
  //   while(stark.length) {
  //     const temp = stark.shift()
  //     if(temp.children) {
  //       stark = stark.concat(temp.children)
  //     }
  //     if(temp.model.code === code) {
  //       return temp
  //     }
  //   }
  // }

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
        <Form name="templateUnitForm" form={form} {...formItemLayout} initialValues={initValues}>
          <Row gutter={24}>
            <Col span={24}><h3 style={{ marginLeft: '3%' }}>基础信息</h3></Col>
            <Col span={12}>
              <Form.Item label="版本/镜像" name="versionCode">
                <Input disabled/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部件名称" name="name">
                <Input placeholder="请输入部件名称"/>
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="部件分类" name="cls" rules={[{ required: true, message: '请选择设备分类' }]}>
                <TreeSelect
                  showSearch
                  placeholder="请选择部件分类"
                  treeDefaultExpandAll
                  treeNodeFilterProp="title"
                  onChange={
                    val => {
                      const item = breadthQuery(unitClassOption, val)
                      form.setFieldsValue({
                        template: null,
                        clsType: item.model.type,
                        clsMajor: item.model.major,
                        clsOrg: item.model.org
                      })
                    }
                  }
                >
                  {renderCls(unitClassOption)}
                </TreeSelect>
              </Form.Item>
            </Col> */}
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
                {
                  modalProperty.type === "edit"
                  ? <Select disabled>
                      {
                        brandData.length > 0 && brandData.map(item => (
                          <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                  : <Select
                      placeholder="请选择品牌"
                      showSearch
                      allowClear
                      filterOption={false}
                      onSearch={handleSearch}
                      onChange={(val) => {
                        associatedTemplate()
                        form.setFieldsValue({ objectTemplate: null })
                      }}
                    >
                      {
                        brandData.length > 0 && brandData.map(item => (
                          <Select.Option key={item.id} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                }
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
                {
                  modalProperty.type === "edit"
                  ? <Input disabled />
                  : <Input
                      placeholder="请输入型号"
                      onChange={
                        () => {
                          associatedTemplate()
                          form.setFieldsValue({ objectTemplate: null })
                        }
                      }
                    />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规格" name="spec">
                <Input placeholder="请输入规格" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="关联模板" name="objectTemplate">
                {
                  modalProperty.type === "edit"
                  ? <Input disabled />
                  : <Select
                      allowClear
                      placeholder="请选择关联模板"
                      showSearch
                      filterOption={false}
                      onSearch={associatedTemplate}
                      onChange={ val => templateChange(val) }
                    >
                      {
                        associated.map(item => (
                          <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                }
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
            {/* <Col span={12}>
              <Form.Item label="版本/镜像" name="version">
                <Input disabled />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label=" 元器件编号" name="componentNumber">
                <Input placeholder="请输入元器件编号" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="描述" name="descr">
                <Input disabled />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="备注" name="remarks">
                <Input.TextArea placeholder="请输入备注"/>
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
              <Form.Item label="制造商" name="manufact">
                <Input disabled />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="一次变比参数" name="transRatio1">
                <InputNumber disabled />
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item label="二次变比参数" name="transRatio2">
                <InputNumber disabled />
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item label="制E码/订货编号" name="ecode">
                <Input disabled />
              </Form.Item>
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
      </Modal>

    </React.Fragment>
  )
}
export default React.memo(AddModal)
