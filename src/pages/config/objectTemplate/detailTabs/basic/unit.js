import React, { useEffect, useState, useContext } from 'react'
import { Row, Col, Form, Input, InputNumber, Select, Radio, message, Button, Upload, Modal } from 'antd'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import { brands, suppliers, upload } from '../../../../../api'
import debounce from 'lodash/debounce'
import { EditUpload, showFile } from '../../../../common/upload'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const UnitModal = props => {
  const { setTemplateCode, MyContext, setVersionCode, setCheckStatus } = props
  const { id, org, brandOption, suppliersOption, typeOption } = useContext(MyContext)

  const [edit, setEdit] = useState({
    basicEdit: false,
    unitEdit: false
  })

  const [form] = Form.useForm()
  const [dirty, setDirty] = useState(0)
  const [initValues, setInitValues] = useState({})

  const [searchOption, setSearchOption] = useState({
    brands: brandOption,
    suppliers: suppliersOption,
  })

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
    if (id === 'null') {  //新建
      configObjectTemplate.objectTemplateNew()
        .then(res => {
          setInitValues({
            ...res,
            type: "02",
            cls: res.cls ? res.cls : undefined,
            brand: res.brand ? res.brand : undefined,
            manufact: res.manufact ? res.manufact : undefined,
          })
          form.resetFields()
        })
    } else {  //查看
      configObjectTemplate.objectTemplateDetail(id)
        .then(res => {
          if (res) {
            setTemplateCode(res.code)
            setVersionCode(res.version)

            //品牌型号字段回显
            setSearchOption({
              brands: res.brand ? [...searchOption.brands, res.brand] : searchOption.brands,
              suppliers: res.manufact ? [...searchOption.suppliers, res.manufact] : searchOption.suppliers
            })
            setInitValues({
              ...res,
              brand: res.brand && res.brand.id,
              brandDesc: res.brand && res.brand.name,
              manufact: res.manufact ? res.manufact.id : undefined,
              manufactDesc: res.manufact && res.manufact.name,
              classification: res.classification ? res.classification : undefined,
            })
            form.resetFields()
          }
        })
        .then(() => {
          showFile(id, "d9ObjectTemplate-image", setFileList, "objImage")
          showFile(id, "d9ObjectTemplate-bim", setFileList, "objBim")
        })
        .catch(() => {
          console.log("业务基础数据详情获取失败")
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dirty])

  //新建时保存
  const save = () => {
    form.validateFields()
      .then(values => {
        const params = {
          ...values,
          org: org,
          cls: '099',
          clsOrg: '*',
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateAdd(params)
          .then(res => {
            setTemplateCode(res.code)
            message.success("保存成功")
            window.location.href = ("/iomm/spa/app/config/object-template-detail/unit/" + res.id)
            return res
          })
          .then(data => {
            if (data && data.id) {
              const ids = []
              for (var i in fileList) {
                fileList[i].forEach(item => {
                  if (item.status === "done") {
                    ids.push(item.uid)
                  }
                })
              }
              upload({
                ids: ids.toString(),
                record: data.id
              })
            }
          })
      })
  }

  //基础信息编辑保存
  const basicSave = () => {
    form.validateFields()
      .then(values => {
        const params = {
          name: values.name,
          componentNumber: values.componentNumber,
          descr: values.descr,
          enable: values.enable,
          remarks: values.remarks,
          spec: values.spec,
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateUpdate(id, params)
          .then(res => {
            message.success("编辑成功")
            setEdit({
              ...edit,
              basicEdit: false
            })
            setDirty(dirty => dirty + 1)
            setCheckStatus(status => {
              return {
                ...status,
                info1: true
              }
            })
          })
      })
  }

  //部件信息编辑保存
  const unitSave = () => {
    form.validateFields()
      .then(values => {
        const params = {
          designLife: values.designLife,
          repairLife: values.repairLife,
          replaceLife: values.replaceLife,
          manufact: values.manufact,
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateUpdate(id, params)
          .then(res => {
            message.success("编辑成功")
            setEdit({
              ...edit,
              unitEdit: false
            })
            setDirty(dirty => dirty + 1)
            setCheckStatus(status => {
              return {
                ...status,
                info2: true
              }
            })
          })
      })
      .then(data => {
        const ids = []
        for (var i in fileList) {
          fileList[i].forEach(item => {
            if (item.status === "done") {
              ids.push(item.uid)
            }
          })
        }
        upload({
          ids: ids.toString(),
          record: id
        })
      })
  }

  //基础信息取消编辑
  const basicCancel = () => {
    setEdit({
      ...edit,
      basicEdit: false
    })
    setCheckStatus(status => {
      return {
        ...status,
        info1: true
      }
    })
    form.resetFields()
  }

  //部件信息取消编辑
  const unitCancel = () => {
    setEdit({
      ...edit,
      unitEdit: false
    })
    setCheckStatus(status => {
      return {
        ...status,
        info2: true
      }
    })
    form.resetFields()
  }

  //搜索时请求
  const handleRequest = (url, name, key, option) => {
    url({
      limit: 30,
      filter: key ? JSON.stringify([{ property: name, value: key }]) : []
    })
      .then(res => {
        const obj = {}
        obj[option] = res.models
        setSearchOption(searchOption => {
          return { ...searchOption, ...obj }
        })
      })
  }

  const handleBrand = debounce((key) => {
    handleRequest(brands, 'name', key, "brands")
  }, 500)

  const handleSupplier = debounce((key) => {
    handleRequest(suppliers, 'name', key, "suppliers")
  }, 500)

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
      {
        id === "null"
          ?  //新建
          <Form name="templateDetailForm" form={form} {...formItemLayout} initialValues={initValues} style={{ margin: 20 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
                  <Input placeholder="请输入模板名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                  <Select disabled
                    placeholder="请选择类型"
                    onChange={val => {
                      form.setFieldsValue({ cls: null })
                    }}
                  >
                    {
                      typeOption.map(item => (
                        <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}><h3>基础信息</h3></Col>
              <Col span={12}>
                <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌' }]}>
                  <Select
                    showSearch
                    placeholder="请选择品牌"
                    filterOption={false}
                    onSearch={handleBrand}
                  >
                    {
                      searchOption.brands.length > 0 && searchOption.brands.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
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
                  <Input placeholder="请输入型号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="规格" name="spec">
                  <Input placeholder="请输入规格" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="状态" name="enable" rules={[{ required: true, message: '请选择状态' }]}>
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
              <Col span={24}><h3>部件信息</h3></Col>
              <Col span={12}>
                <Form.Item label="设计寿命(年)" name="designLife">
                  <InputNumber placeholder="请输入设计寿命" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="大修年限(年)" name="repairLife">
                  <InputNumber placeholder="请输入大修年限" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="更换年限(年)" name="replaceLife">
                  <InputNumber placeholder="请输入更换年限" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制造商" name="manufact">
                  <Select
                    placeholder="请选择制造商"
                    allowClear
                    showSearch
                    filterOption={false}
                    onSearch={handleSupplier}
                  >
                    {
                      searchOption.suppliers.length > 0 && searchOption.suppliers.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="部件图片">
                  <EditUpload
                    accept="image/*"
                    listType="picture-card"
                    model='d9ObjectTemplate-image'
                    fileList={fileList.objImage}
                    setFileList={setFileList}
                    option="objImage"
                    type={2}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="BIM结构图">
                  <EditUpload
                    accept=".rfa"
                    model='d9ObjectTemplate-bim'
                    fileList={fileList.objBim}
                    setFileList={setFileList}
                    option="objBim"
                  />
                  格式:.rfa
                </Form.Item>
              </Col>
            </Row>
            <Col align="right"><Button type="primary" onClick={save}>确定</Button></Col>
          </Form>
          :  //编辑查看
          <Form name="templateDetailForm" form={form} {...formItemLayout} initialValues={initValues} style={{ margin: 20 }}>
            <Row gutter={24}>
              <Col span={20}><h3>基础信息</h3></Col>
              {
                edit.basicEdit
                  ?
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button type="link" onClick={basicSave}>保存</Button>
                      <Button type="link" onClick={basicCancel}>取消</Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
                        <Input placeholder="请输入计划名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="类型" name="type">
                        <Select disabled>
                          {
                            typeOption.map(item => (
                              <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
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
                      <Form.Item label="品牌" name="brand">
                        <Select disabled>
                          {
                            searchOption.brands.length > 0 && searchOption.brands.map(item => (
                              <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="型号" name="modelNumber">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="规格" name="spec">
                        <Input placeholder='请输入规格' />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="状态" name="enable" rules={[{ required: true, message: '请选择状态' }]}>
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
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button
                        type="link"
                        onClick={() => {
                          setEdit({ ...edit, basicEdit: true })
                          setCheckStatus(status => {
                            return {
                              ...status,
                              info1: false
                            }
                          })
                        }}
                      >
                        编辑
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="模板名称">
                        {initValues.name}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="类型">
                        {'部件'}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="版本/镜像" >
                        {initValues.version}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="品牌">
                        {initValues.brandDesc}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="型号">
                        {initValues.modelNumber}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="规格">
                        {initValues.spec}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="状态">
                        {initValues.enable ? "启用" : "未启用"}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="备注" >
                        {initValues.remarks}
                      </Form.Item>
                    </Col>
                  </React.Fragment>
              }
              <Col span={20}><h3>部件信息</h3></Col>
              {
                edit.unitEdit
                  ?
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button type="link" onClick={unitSave}>保存</Button>
                      <Button type="link" onClick={unitCancel}>取消</Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设计寿命(年)" name="designLife">
                        <InputNumber placeholder="请输入设计寿命(年)" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="大修年限(年)" name="repairLife">
                        <InputNumber placeholder="请输入大修年限(年)" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="更换年限(年)" name="replaceLife">
                        <InputNumber placeholder="请输入更换年限(年)" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="制造商" name="manufact">
                        <Select
                          placeholder="请选择制造商"
                          allowClear
                          showSearch
                          filterOption={false}
                          onSearch={handleSupplier}
                        >
                          {
                            searchOption.suppliers.length > 0 && searchOption.suppliers.map(item => (
                              <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="部件图片">
                        <EditUpload
                          accept="image/*"
                          listType="picture-card"
                          model='d9ObjectTemplate-image'
                          fileList={fileList.objImage}
                          setFileList={setFileList}
                          option="objImage"
                          type={2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="BIM结构图">
                        <EditUpload
                          accept=".rfa"
                          model='d9ObjectTemplate-bim'
                          fileList={fileList.objBim}
                          setFileList={setFileList}
                          option="objBim"
                        />
                        格式:.rfa
                      </Form.Item>
                    </Col>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button
                        type="link"
                        onClick={() => {
                          setEdit({ ...edit, unitEdit: true })
                          setCheckStatus(status => {
                            return {
                              ...status,
                              info2: false
                            }
                          })
                        }}
                        >
                        编辑
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设计寿命">
                        {initValues.designLife?initValues.designLife+'年':initValues.designLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="大修年限">
                        {initValues.repairLife?initValues.repairLife+'年':initValues.repairLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="更换年限">
                        {initValues.replaceLife?initValues.replaceLife+'年':initValues.replaceLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="制造商">
                        {initValues.manufactDesc}
                      </Form.Item>
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
                  </React.Fragment>
              }
            </Row>
          </Form>
      }
    </React.Fragment>
  )
}

export default React.memo(UnitModal)
