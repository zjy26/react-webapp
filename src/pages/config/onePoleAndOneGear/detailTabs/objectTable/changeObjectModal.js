import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, message, InputNumber, DatePicker, TreeSelect } from 'antd'
import { anchorSections, overheadLine, brands,echoBrand } from '../../../../../api'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import moment from 'moment'
import debounce from 'lodash/debounce'

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

const ChangeObjectModal = props => {
  const { visible, handleCancel, setDirty, renderChildData, MyContext } = props
  const [objData, setObjData] = useState([])
  const { brandOption, peopleOption, typeOption, code, classOption/*,unitClassOption*/ } = useContext(MyContext)
  const [brandData, setBrandData] = useState(brandOption)
  const [associated, setAssociated] = useState([])
  const [form] = Form.useForm()
  const [unitTemplateList, setUnitTemplateList] = useState([])
  const [anchorSectionList, setAnchorSectionList] = useState([])
  const [type, setType] = useState('01')
  const [unitSn, setUnitSn] = useState(null)

  const [templateCode, setTemplateCode] = useState('01')
  const [unitTemplate, setUnitTemplate] = useState({
    id: null,
    objectId: null
  })
  const [objectCode, setObjectCode] = useState('01')
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    anchorSections({ line: props.line })
      .then(res => {
        if (res) {
          setAnchorSectionList(res.models)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
  }, [props.line])

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      associatedTemplate()
      form.resetFields()
      setType("01")
      form.setFieldsValue({ type: '01' })
      overheadLine.overheadLineObjectList({ code: code })
        .then(res => {
          if (res && res.models) {
            if (objData !== res.models)
              setObjData(res.models)
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        let { oldbrand, oldmodelNumber, clsName, ...data } = values
        setOkLoading(false)
        if (data.type === "01") {
          let params = {
            ...data,
            replaceTime: values.replaceTime ? moment(new Date(values.replaceTime), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.replaceTime
          }
          overheadLine.objectChangeAdd(params)
            .then(res => {
              if (res.success) {
                message.success("新建成功")
                setDirty(dirty => dirty + 1)
                renderChildData(true,res.overheadLineObject,res.presentTemplate)
                handleCancel()
              }
            })
        } else if (data.type === "02") {
          let params = {
            ...data,
            unitTemplateId: unitTemplate.id,
            objectId: unitTemplate.objectId,
            unitSn: unitSn ? unitSn : null,
            presentCls: '99',
            presentClsOrg: '*',
            replaceTime: values.replaceTime ? moment(new Date(values.replaceTime), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.replaceTime,
          }
          overheadLine.objectChangeAdd(params)
            .then(res => {
              if (res.success) {
                message.success("新建成功")
                setDirty(dirty => dirty + 1)
                handleCancel()
              }
            })
        }
      })
      .catch(err => {
        if (!err.values.name) {
        }
      })
  }

  //关联模板搜索时请求
  const associatedTemplate = debounce((key) => {
    if (form.getFieldValue("type") === "01") {
      configObjectTemplate.associatedTemplate(
        {
          type: "01",
          clsMajor:'07',
          cls: form.getFieldValue("presentCls"),
          brand: form.getFieldValue("presentBrand"),
          limit: 30,
          modelNumber: form.getFieldValue("presentModelNumber"),
          name:key
        }
      )
      .then(res => {
        if (res && res.models) {
          setAssociated(res.models)
        }
      })
    } else if (form.getFieldValue("type") === "02") {
      configObjectTemplate.associatedTemplate(
        {
          type: "02",
          // clsMajor:'07',
          // cls: '099',
          limit: 30,
          brand: form.getFieldValue("presentBrand"),
          modelNumber: form.getFieldValue("presentModelNumber"),
          name:key
        }
      )
      .then(res => {
        if (res && res.models) {
          setAssociated(res.models)
        }
      })
    }
  }, 500)


  const templateChange = (val) => {
    const item = associated.find(item => item.code === val)
    if(item){
      //品牌字段回显
      if(item.brand) {
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
      form.setFieldsValue({presentModelNumber:item.modelNumber,presentCls:item.cls,presentBrand:item.brand})
    }

  }

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

  //关联部件
  const associatedUnitTemplate = (open) => {
    if (open) {
      overheadLine.unitTemplateList({ id: objectCode, template: templateCode })
        .then(res => {
          if (res.objectUnitList) {
            setUnitTemplateList(res.objectUnitList)
          }
        })
    }
  }

  //渲染设备分类
  const renderCls = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.text} disabled>{renderCls(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  //广度遍历，在树形对象数组结构中查找指定对象
  const breadthQuery = (tree, code) => {
    var stark = []
    stark = stark.concat(tree)
    while (stark.length) {
      const temp = stark.shift()
      if (temp.children) {
        stark = stark.concat(temp.children)
      }
      if (temp.model.code === code) {
        return temp
      }
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
        okButtonProps={{ loading: okLoading }}
      >
        <Form form={form} name="changeObjectForm" {...formItemLayout}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="更换类型" name="type" rules={[{ required: true, message: '请选择更换类型' }]}>
                <Select
                  placeholder="请选择更换类型"
                  onChange={val => {
                    form.resetFields()
                    form.setFieldsValue({ type: val })
                    if (type !== val){
                      setType(val)
                      associatedTemplate()
                    }
                  }}
                >
                  {
                    typeOption && typeOption.length > 0 && typeOption.map(item => (
                      <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            {
              type === "01" ?
                <Col span={24}><h3>设备信息</h3></Col> :
                <Col span={24}><h3>部件信息</h3></Col>
            }
            <Col span={12}>
              <Form.Item label="设备描述" name="overheadLineObject" rules={[{ required: true, message: '请选择设备' }]}>
                <Select placeholder="请选择设备"
                  onChange={
                    (value) => {
                      const objects = objData.find(obj => obj.id === value)
                      if (type === "01") {
                        form.setFieldsValue({
                          originalBrand: objects.brdName,
                          originalModelNumber: objects.modelNumber,
                          clsName: objects.clsName
                        })
                      } else if (type === "02") {
                        if (templateCode !== objects.template) {
                          setTemplateCode(objects.template)
                        }
                        form.setFieldsValue({ unit: undefined })
                        setObjectCode(value)
                      }
                    }
                  }
                >
                  {
                    objData && objData.length > 0 && objData.map((item) => (
                      <Select.Option key={item.id} value={item.id}>{item.descr + "(" + item.sn + ")"}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            {
              type === "02" ?
                <Col span={12} >
                  <Form.Item label="部件名称" name="unit" rules={[{ required: true, message: '请选择部件' }]}>
                    <Select
                      onDropdownVisibleChange={open => associatedUnitTemplate(open)}
                      onChange={
                        (value) => {
                          const object = unitTemplateList.find(obj => obj.template === value)
                          form.setFieldsValue({
                            originalBrand: object.brand,
                            originalModelNumber: object.modelNumber,
                            clsName: object.firstLevelCls
                          })
                          setUnitSn(object.unitSn)
                          setUnitTemplate({
                            ...unitTemplate,
                            id: object.unitTemplateId,
                            objectId: object.id
                          })
                        }
                      }
                    >
                      {
                        unitTemplateList && unitTemplateList.length > 0 && unitTemplateList.map(item => (
                          <Select.Option key={item.template} value={item.template}>{item.desc + "(" + item.id + ")"}</Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col> : null
            }
            {type === "02" ?
              // <Col span={12}>
              //   <Form.Item label="部件分类" name="clsName">
              //     <Input disabled />
              //   </Form.Item>
              // </Col>
              null
              :
              <Col span={12}>
                <Form.Item label="设备分类" name="clsName">
                  <Input disabled />
                </Form.Item>
              </Col>}
            {type === '02' ? <Col span={12}>
              <Form.Item label="原部件品牌" name="originalBrand">
                <Input disabled />
              </Form.Item>
            </Col> :
              <Col span={12}>
                <Form.Item label="原设备品牌" name="originalBrand">
                  <Input disabled />
                </Form.Item>
              </Col>}
            {type === '02' ?
              <Col span={12}>
                <Form.Item label="原部件型号" name="originalModelNumber">
                  <Input disabled />
                </Form.Item>
              </Col>
              : <Col span={12}>
                <Form.Item label="原设备型号" name="originalModelNumber">
                  <Input disabled />
                </Form.Item>
              </Col>}
            {
              type === "01" ?
                <Col span={24}><h3>新设备信息</h3></Col> :
                <Col span={24}><h3>新部件信息</h3></Col>
            }
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="新设备分类" name="presentCls" rules={[{ required: true, message: '请选择新设备分类' }]}>
                  <TreeSelect
                    showSearch
                    placeholder="请选择设备分类"
                    treeDefaultExpandAll
                    allowClear
                    treeNodeFilterProp="title"
                    onChange={
                      (val, opt) => {
                        associatedTemplate()
                        form.setFieldsValue({presentTemplate:null})
                        const item = breadthQuery(classOption, val)
                        if(item){
                          form.setFieldsValue({
                            clsType: item.model.type,
                            clsMajor: item.model.major,
                            clsOrg: item.model.org
                          })
                        }

                      }
                    }
                  >
                    {renderCls(classOption)}
                  </TreeSelect>
                </Form.Item>
              </Col> :
              //   <Col span={12}>
              //   <Form.Item label="新部件分类" name="presentCls" rules={[{required: true, message: '请选择新部件分类'}]}>
              //     <Select placeholder="请选择新部件分类"
              //       onChange={
              //         (val, opt) => {form.setFieldsValue({
              //           clsType: opt.type,
              //           clsMajor: opt.major,
              //           presentClsOrg: opt.org
              //           }
              //         )
              //         setTemplateCls(val)
              //         }

              //       }
              //     >
              //       {
              //         unitClassOption.map(item => (
              //           <Select.Option
              //             key={item.id}
              //             value={item.model.code}
              //             type={item.model.type}
              //             major={item.model.major}
              //             org={item.model.org}
              //           >
              //             {item.model.desc}
              //           </Select.Option>
              //         ))
              //       }
              //     </Select>
              //   </Form.Item>
              // </Col>
              null}
            <Col span={12} style={{ display: 'none' }}>
              <Form.Item label="分类组织" name="presentClsOrg">
                <Input disabled />
              </Form.Item>
            </Col>
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="新设备品牌" name="presentBrand" rules={[{ required: true, message: '请选择新设备品牌' }]}>
                  <Select
                    placeholder="请选择新设备品牌"
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (value) => {
                        associatedTemplate()
                        form.setFieldsValue({presentTemplate:null})
                      }
                    }
                  >
                    {
                      brandData && brandData.length > 0 && brandData.map(item => (
                        <Select.Option key={item.id} value={item.code} code={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col> :
              <Col span={12}>
                <Form.Item label="新部件品牌" name="presentBrand" rules={[{ required: true, message: '请选择新部件品牌' }]}>
                  <Select placeholder="请选择新部件品牌"
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (value) => {
                        associatedTemplate()
                        form.setFieldsValue({presentTemplate:null})
                      }
                    }
                  >
                    {
                      brandData && brandData.length > 0 && brandData.map(item => (
                        <Select.Option key={item.id} value={item.code} code={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="新设备型号" name="presentModelNumber" rules={[
                  { whitespace: true, message: '内容不能为空' },
                  { required: true, message: '请输入新设备型号' }
                ]}>
                  <Input placeholder="请输入新设备型号"
                    onChange={
                      (e) => {
                        associatedTemplate()
                        form.setFieldsValue({presentTemplate:null})
                      }
                    }
                  />
                </Form.Item>
              </Col> :
              <Col span={12}>
                <Form.Item label="新部件型号" name="presentModelNumber" rules={[
                  { whitespace: true, message: '内容不能为空' },
                  { required: true, message: '请输入新设备型号' }
                ]}>
                  <Input placeholder="请输入新部件型号"
                    onChange={
                      (e) => {
                        associatedTemplate()
                        form.setFieldsValue({presentTemplate:null})
                      }
                    }
                  />
                </Form.Item>
              </Col>}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="关联模板" name="presentTemplate">
                  <Select
                    allowClear
                    placeholder="请选择关联模板"
                    showSearch
                    filterOption={false}
                    onSearch={associatedTemplate}
                    onChange={ val => templateChange(val) }
                  >
                    {
                      associated && associated.length > 0 && associated.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col> : <Col span={12}>
                <Form.Item label="关联模板" name="presentTemplate">
                  <Select
                    allowClear
                    placeholder="请选择关联模板"
                    showSearch
                    filterOption={false}
                    onSearch={associatedTemplate}
                    onChange={ val => templateChange(val) }
                  >
                    {
                      associated && associated.length > 0 && associated.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>}
            {type === "01" ? <Col span={12}>
              <Form.Item label="长度(m)" name="length">
                <InputNumber placeholder="请输入长度" />
              </Form.Item>
            </Col> : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="设备标识" name="objectMark">
                  <Input placeholder="请输入设备标识" />
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="另一根锚段号" name="anchorSection">
                  <Select placeholder="请选择锚段号">
                    {
                      anchorSectionList && anchorSectionList.map(item => (
                        <Select.Option key={item.code} value={item.code}>
                          {item.descr}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="另一根股道数" name="stationTrack">
                  <Input placeholder="请输入另一根股道数" />
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="形式" name="shape">
                  <Input placeholder="请输入形式" />
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="单双线" name="singleDouleLine">
                  <Select allowClear>
                    <Select.Option value="1">单线</Select.Option>
                    <Select.Option value="2">双线</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="道岔号" name="turnout">
                  <Input placeholder="请输入道岔号" />
                </Form.Item>
              </Col>
              : null}
            {type === "01" ?
              <Col span={12}>
                <Form.Item label="股道数据" name="stationTrackData">
                  <Input placeholder="请输入股道数据" />
                </Form.Item>
              </Col>
              : null}
            <Col span={12}>
              <Form.Item label="E码/订货编号" name="ecode">
                <Input placeholder="请输入E码/订货编号" />
              </Form.Item>
            </Col>
            {type === '02' ? <Col span={12}>
              <Form.Item label="部件标识" name="objectMark">
                <Input placeholder="请输入部件标识" />
              </Form.Item>
            </Col> : null}

            <Col span={24}><h3>更换信息</h3></Col>
            <Col span={12}>
              <Form.Item label="负责人" name="principal" rules={[{ required: true, message: '请选择负责人' }]}>
                <Select placeholder="请选择负责人"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {
                    peopleOption && peopleOption.length > 0 && peopleOption.map(item => (
                      <Select.Option key={item.id} value={item.id} code={item.code}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换日期" name="replaceTime" rules={[{ required: true, message: '请选择日期' }]}>
                <DatePicker placeholder="请选择日期" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换原因" name="reason">
                <Input.TextArea maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(ChangeObjectModal)
