import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Select, Radio, message, TreeSelect } from 'antd'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

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

const Basic = props => {
  const { setTemplateCode, MyContext, setActiveKey } = props
  const { id, brandOption, suppliersOption, classOption, objectClsOption, unitClassOption, typeOption, voltageLevelOption, importanceOption, classificationOption, mainClsOption } = useContext(MyContext)

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [type, setType] = useState("01")

  useEffect(() => {
    if (id === 'null') {  //新建
      configObjectTemplate.objectTemplateNew()
        .then(res => {
          setInitValues({
            ...res,
            type: "01",
            cls: res.cls ? res.cls : undefined,
            brand: res.brand ? res.brand : undefined,
            manufact: res.manufact ? res.manufact : undefined,
            importance: res.importance ? res.importance : undefined,
            classification: res.classification ? res.classification : undefined,
            objectCls: res.objectCls ? res.objectCls : undefined,
            voltageLevel: res.voltageLevel ? res.voltageLevel : undefined,
            mainCls: res.mainCls ? res.mainCls : undefined,
          })
          form.resetFields()
        })
    } else {  //查看
      configObjectTemplate.objectTemplateDetail(id)
        .then(res => {
          if (res) {
            setTemplateCode(res.code)
            setInitValues({
              ...res,
              brand: res.brand.id,
              manufact: res.manufact && res.manufact.id ? res.manufact.id : undefined,
              importance: res.importance ? res.importance : undefined,
              classification: res.classification ? res.classification : undefined,
              voltageLevel: res.voltageLevel ? res.voltageLevel : undefined,
              mainCls: res.mainCls ? res.mainCls : undefined,
            })
            form.resetFields()
            setType(res.type)
          }
        })
        .catch(() => {
          console.log("业务基础数据详情获取失败")
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  //保存
  const save = () => {
    form.validateFields()
      .then(values => {
        const params = {
          ...values,
          _method: 'PUT'
        }
        id !== "null" ?    //编辑
          configObjectTemplate.objectTemplateUpdate(id, params)
            .then(res => {
              message.success("编辑成功")
            })
          :    //新建
          configObjectTemplate.objectTemplateAdd(params)
            .then(res => {
              setTemplateCode(res.code)
              message.success("保存成功")
              setActiveKey("unitInfo")
            })
      })
  }

  //递归渲染固定资产树形结构数据
  const renderTree = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.id} value={item.model.id} title={item.model.desc}>{renderTree(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.id} value={item.model.id} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  return (
    <React.Fragment>
      <Form name="templateDetailForm" form={form} {...formItemLayout} initialValues={initValues} style={{ margin: '10px 0' }}>
        <Row>
          <Col offset={4} span={16}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
                  <Input placeholder="请输入计划名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                  <Select
                    placeholder="请选择类型"
                    onChange={val => {
                      setType(val)
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
              <Col span={24}><h3 style={{ marginLeft: '10%' }}>基础信息</h3></Col>
              {
                id !== "null" ?
                  <React.Fragment>
                    <Col span={12}>
                      <Form.Item label="版本/镜像" name="version">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                    {
                      type === "01" ?
                        <Col span={12}>
                          <Form.Item label="编码" name="code">
                            <Input disabled />
                          </Form.Item>
                        </Col> : null
                    }
                  </React.Fragment> : null
              }
              {
                type === "02" ?
                  <Col span={12}>
                    <Form.Item label="元器件编号" name="componentNumber">
                      <Input placeholder="请输入元器件编号" />
                    </Form.Item>
                  </Col> : null
              }
              <Col span={12}>
                <Form.Item
                  label="描述"
                  name="descr"
                  rules={[
                    { whitespace: true, message: '内容不能为空' },
                    { required: true, message: '请输入描述' }
                  ]}
                >
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
              {
                type === "01" ?
                  <Col span={12}>
                    <Form.Item label="设备分类" name="cls" rules={[{ required: true, message: '请选择设备分类' }]}>
                      <Select
                        placeholder="请选择设备分类"
                        onChange={
                          (val, opt) => form.setFieldsValue({
                            clsType: opt.type,
                            clsMajor: opt.major,
                            clsOrg: opt.org
                          })
                        }
                      >
                        {
                          classOption.map(item => (
                            <Select.OptGroup key={item.id} label={item.text}>
                              {
                                item.children.map(child => (
                                  <Select.Option
                                    key={child.model.code}
                                    value={child.model.code}
                                    type={child.model.type}
                                    major={child.model.major}
                                    org={child.model.org}
                                  >
                                    {child.model.desc}
                                  </Select.Option>
                                ))
                              }
                            </Select.OptGroup>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  :
                  <Col span={12}>
                    <Form.Item label="部件分类" name="cls" rules={[{ required: true, message: '请选择部件分类' }]}>
                      <Select
                        showSearch
                        placeholder="请选择部件分类"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={
                          (val, opt) => form.setFieldsValue({
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
              }
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
                  <Select placeholder="请选择品牌">
                    {
                      brandOption.map(item => (
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

              {
                type === "01" ?
                  <Col span={24}><h3 style={{ marginLeft: '10%' }}>设备信息</h3></Col> :
                  <Col span={24}><h3 style={{ marginLeft: '10%' }}>部件信息</h3></Col>
              }
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
              {
                type === "01" ?
                  <Col span={12}>
                    <Form.Item label="建议维护周期" name="maintenanceCycle">
                      <InputNumber placeholder="请输入建议维护周期" min={0} />
                    </Form.Item>
                  </Col>
                  :
                  <Col span={12}>
                    <Form.Item label="关键部件" name="criticality">
                      <Select placeholder="是否关键部件">
                        <Select.Option value={false}>否</Select.Option>
                        <Select.Option value={true}>是</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
              }
              <Col span={12}>
                <Form.Item label="制造商" name="manufact">
                  <Select placeholder="请选择制造商" allowClear>
                    {
                      suppliersOption.map(item => (
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
                <Form.Item label="遵循标准" name="standard">
                  <Input placeholder="请输入遵循标准" />
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

              {
                type === "01" ?
                  <React.Fragment>
                    <Col span={24}><h3 style={{ marginLeft: '10%' }}>企业信息</h3></Col>
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
                        >
                          {renderTree(objectClsOption)}
                        </TreeSelect>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="电压等级" name="voltageLevel">
                        <Select placeholder="请选择电压等级" allowClear>
                          {
                            voltageLevelOption.map(item => (
                              <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
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
                    <Col span={12}>
                      <Form.Item label="制E码/订货编号" name="ecode">
                        <Input placeholder="请输入E码/订货编号" />
                      </Form.Item>
                    </Col>
                  </React.Fragment> : null
              }
            </Row>
          </Col>
        </Row>
        <Col offset={18} span={2} align="right"><Button type="primary" onClick={save}>确定</Button></Col>
      </Form>
    </React.Fragment>
  )
}

export default React.memo(Basic)
