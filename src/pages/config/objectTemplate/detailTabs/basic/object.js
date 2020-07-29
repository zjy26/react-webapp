import React, { useEffect, useState, useContext } from 'react'
import { Row, Col, Button, Form, Input, InputNumber, Select, Radio, message, TreeSelect, Upload, Modal } from 'antd'
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

const ObjectModal = props => {
  const { setTemplateCode, MyContext, setVersionCode, setObjectClass, setCheckStatus } = props
  const { id, org, brandOption, suppliersOption, classOption, objectClsOption, typeOption, importanceOption, classificationOption, mainClsOption } = useContext(MyContext)
  const [edit, setEdit] = useState({
    basicEdit: false,
    objectEdit: false,
    enterpriseEdit: false,
  })

  const [dirty, setDirty] = useState(0)
  const [form] = Form.useForm()
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
            type: '01',
            cls: res.cls ? res.cls : undefined,
            brand: res.brand ? res.brand : undefined,
            manufact: res.manufact ? res.manufact : undefined,
            importance: res.importance ? res.importance : undefined,
            classification: res.classification ? res.classification : undefined,
            objectCls: res.objectCls ? res.objectCls : undefined,
            mainCls: res.mainCls ? res.mainCls : undefined,
          })
          form.resetFields()
        })
    } else {  //查看
      configObjectTemplate.objectTemplateDetail(id)
        .then(res => {
          if (res) {
            setTemplateCode(res.code)
            setVersionCode(res.version)
            setObjectClass(res.cls)

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
              mainCls: res.mainCls ? res.mainCls : undefined,
              objectCls: res.objectCls ? res.objectCls : undefined,
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

  //新建保存
  const save = () => {
    form.validateFields()
      .then(values => {
        const params = {
          ...values,
          org: org,
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateAdd(params)
          .then(res => {
            setTemplateCode(res.code)
            message.success("保存成功")
            window.location.href = ("/iomm/spa/app/config/object-template-detail/object/" + res.id)
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

  //基础信息编辑
  const basicSave = () => {
    form.validateFields()
      .then(values => {
        const params = {
          name: values.name,
          spec: values.spec,
          descr: values.descr,
          enable: values.enable,
          remarks: values.remarks,
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

  //设备信息编辑
  const objectSave = () => {
    form.validateFields()
      .then(values => {
        const params = {
          designLife: values.designLife,
          repairLife: values.repairLife,
          replaceLife: values.replaceLife,
          maintenanceCycle: values.maintenanceCycle,
          manufact: values.manufact,
          overhaulLife: values.overhaulLife,
          serviceLife: values.serviceLife,
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateUpdate(id, params)
          .then(res => {
            message.success("编辑成功")
            setEdit({
              ...edit,
              objectEdit: false
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
      .then(() => {
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

  //企业信息编辑
  const enterpriseSave = () => {
    form.validateFields()
      .then(values => {
        const params = {
          importance: values.importance,
          classification: values.classification,
          objectCls: values.objectCls,
          mainCls: values.mainCls,
          _method: 'PUT'
        }
        configObjectTemplate.objectTemplateUpdate(id, params)
          .then(res => {
            message.success("编辑成功")
            setEdit({
              ...edit,
              enterpriseEdit: false
            })
            setDirty(dirty => dirty + 1)
            setCheckStatus(status => {
              return {
                ...status,
                info3: true
              }
            })
          })
      })
  }

  //递归渲染固定资产树形结构数据
  const renderTree = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.id} value={item.model.id} title={item.text} disabled>{renderTree(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.id} value={item.model.id} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  //渲染设备分类
  const renderObjCls = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.text} disabled>{renderObjCls(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  //广度遍历，在树形对象数组结构中查找指定对象
  const breadthQuery = (tree, item, value) => {
    var stark = []
    stark = stark.concat(tree)
    while (stark.length) {
      const temp = stark.shift()
      if (temp.children) {
        stark = stark.concat(temp.children)
      }
      if (temp['model'][item] === value) {
        return temp
      }
    }
  }

  //搜索时请求
  const handleRequest = (url, name, key, option) => {
    url({
      limit: 30,
      filter: JSON.stringify([{ property: name, value: key }])
    })
      .then(res => {
        const obj = {}
        obj[option] = res.models
        setSearchOption(searchOption => {
          return { ...searchOption, ...obj }
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

  //设备信息取消编辑
  const objectCancel = () => {
    setEdit({
      ...edit,
      objectEdit: false
    })
    setCheckStatus(status => {
      return {
        ...status,
        info2: true
      }
    })
    form.resetFields()
  }

  //企业信息取消编辑
  const enterpriseCancel = () => {
    setEdit({
      ...edit,
      enterpriseEdit: false
    })
    setCheckStatus(status => {
      return {
        ...status,
        info3: true
      }
    })
    form.resetFields()
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
          <Form name="templateNewForm" form={form} {...formItemLayout} initialValues={initValues} style={{ margin: 20 }}>
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
                <Form.Item label="描述" name="descr">
                  <Input placeholder="请输入描述" />
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
                <Form.Item label="设备分类" name="cls" rules={[{ required: true, message: '请选择设备分类' }]}>
                  <TreeSelect
                    showSearch
                    placeholder="请选择设备分类"
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                    onChange={
                      val => {
                        const item = breadthQuery(classOption, "code", val)
                        form.setFieldsValue({
                          clsType: item.model.type,
                          clsMajor: item.model.major,
                          clsOrg: item.model.org
                        })
                      }
                    }
                  >
                    { renderObjCls(classOption) }
                  </TreeSelect>
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
                <Form.Item label="备注" name="remarks">
                  <Input.TextArea placeholder="请输入备注" />
                </Form.Item>
              </Col>
              <Col span={24}><h3>设备信息</h3></Col>
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
                <Form.Item label="建议维护周期(年)" name="maintenanceCycle">
                  <InputNumber placeholder="请输入建议维护周期(年)" min={0} />
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
                <Form.Item label="规程大修寿命" name="overhaulLife">
                  <InputNumber placeholder="请输入规程大修寿命" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="规程使用寿命" name="serviceLife">
                  <InputNumber placeholder="请输入规程使用寿命" min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备图片">
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
              <React.Fragment>
                <Col span={24}><h3>企业信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="重要程度" name="importance">
                    <Select placeholder="请选择重要程度" allowClear>
                      {
                        importanceOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ABC分类" name="classification">
                    <Select placeholder="请选择ABC分类" allowClear>
                      {
                        classificationOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="固定资产分类" name="objectCls">
                    <TreeSelect
                      showSearch
                      placeholder="请选择固定资产分类"
                      treeDefaultExpandAll
                      treeNodeFilterProp="title"
                    >
                      {renderTree(objectClsOption)}
                    </TreeSelect>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备大类" name="mainCls">
                    <Select placeholder="请选择设备大类" allowClear>
                      {
                        mainClsOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </React.Fragment>
            </Row>
            <Col offset={18} span={2} align="right"><Button type="primary" onClick={save}>确定</Button></Col>
          </Form>
          :  //编辑查看
          <Form name="templateDetailForm" form={form} {...formItemLayout} initialValues={initValues} style={{ margin: 20 }}>
            <Row gutter={24}>
              <Col span={20}><h3>基础信息</h3></Col>
              {
                edit.basicEdit ?
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
                      <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                        <Select disabled
                          placeholder="请选择类型"
                        >
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
                      <Form.Item label="编码" name="code">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备分类" name="cls">
                        <TreeSelect disabled>
                          { renderObjCls(classOption) }
                        </TreeSelect>
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
                        <Input placeholder="请输入规格" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="描述" name="descr">
                        <Input placeholder="请输入描述" />
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
                      <Form.Item label="类型" >
                        {'设备'}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="版本/镜像">
                        {initValues.version}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="编码">
                        {initValues.code}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备分类">
                        {
                          Object.keys(classOption).length > 0 && breadthQuery(classOption, "code", initValues.cls)
                            ? breadthQuery(classOption, "code", initValues.cls).text
                            : null
                        }
                      </Form.Item>
                    </Col>
                    <Col span={12} hidden>
                      <Form.Item label="专业">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12} hidden>
                      <Form.Item label="类型">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12} hidden>
                      <Form.Item label="分类组织">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="品牌" >
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
                      <Form.Item label="描述">
                        {initValues.descr}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="状态">
                        {initValues.enable ? '启用' : '未启用'}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="备注">
                        {initValues.remarks}
                      </Form.Item>
                    </Col>
                  </React.Fragment>
              }
              <Col span={20}><h3>设备信息</h3></Col>
              {
                edit.objectEdit
                  ?
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button type="link" onClick={objectSave}>保存</Button>
                      <Button type="link" onClick={objectCancel}>取消</Button>
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
                      <Form.Item label="建议维护周期(年)" name="maintenanceCycle">
                        <InputNumber placeholder="请输入建议维护周期(年)" min={0} />
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
                      <Form.Item label="规程大修寿命(年)" name="overhaulLife">
                        <InputNumber placeholder="请输入规程大修寿命(年)" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="规程使用寿命(年)" name="serviceLife">
                        <InputNumber placeholder="请输入规程使用寿命(年)" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备图片">
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
                          setEdit({ ...edit, objectEdit: true })
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
                      <Form.Item label="设计寿命(年)">
                        {initValues.designLife?initValues.designLife+'年':initValues.designLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="大修年限(年)">
                        {initValues.repairLife?initValues.repairLife+'年':initValues.repairLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="建议维护周期(年)" >
                        {initValues.maintenanceCycle?initValues.maintenanceCycle+'年':initValues.maintenanceCycle}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="制造商">
                        {initValues.manufactDesc}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="规程大修寿命">
                        {initValues.overhaulLife?initValues.overhaulLife+'年':initValues.overhaulLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="规程使用寿命">
                        {initValues.serviceLife?initValues.serviceLife+'年':initValues.serviceLife}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备图片">
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
                          <img alt="设备图片" style={{ width: '100%' }} src={preview.previewImage} />
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
              <Col span={20}><h3>企业信息</h3></Col>
              {
                edit.enterpriseEdit
                  ?
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button type="link" onClick={enterpriseSave}>保存</Button>
                      <Button type="link" onClick={enterpriseCancel}>取消</Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="重要程度" name="importance">
                        <Select placeholder="请选择重要程度" allowClear>
                          {
                            importanceOption.map(item => (
                              <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="ABC分类" name="classification">
                        <Select placeholder="请选择ABC分类" allowClear>
                          {
                            classificationOption.map(item => (
                              <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="固定资产分类" name="objectCls">
                        <TreeSelect
                          showSearch
                          placeholder="请选择固定资产分类"
                          treeDefaultExpandAll
                          treeNodeFilterProp="title"
                        >
                          {renderTree(objectClsOption)}
                        </TreeSelect>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备大类" name="mainCls">
                        <Select placeholder="请选择设备大类" allowClear>
                          {
                            mainClsOption.map(item => (
                              <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Col span={4} align="right">
                      <Button
                        type="link"
                        onClick={() => {
                          setEdit({ ...edit, enterpriseEdit: true })
                          setCheckStatus(status => {
                            return {
                              ...status,
                              info3: false
                            }
                          })
                        }}
                      >
                        编辑
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="重要程度">
                        {
                          importanceOption.length > 0 &&
                          importanceOption.find(obj => obj.code === initValues.importance) &&
                          importanceOption.find(obj => obj.code === initValues.importance).name
                        }
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="ABC分类" >
                        {initValues.classification}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="固定资产分类">
                        {
                          objectClsOption.length > 0 && breadthQuery(objectClsOption[0], "id", initValues.objectCls)
                            ? breadthQuery(objectClsOption[0], "id", initValues.objectCls).text
                            : null
                        }
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="设备大类">
                        {
                          mainClsOption.length > 0 &&
                          mainClsOption.find(obj => obj.code === initValues.mainCls) &&
                          mainClsOption.find(obj => obj.code === initValues.mainCls).name
                        }
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

export default React.memo(ObjectModal)
