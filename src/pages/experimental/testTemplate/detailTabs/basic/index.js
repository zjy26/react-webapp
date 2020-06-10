import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Input, Select, Modal, message } from 'antd'
import { testTemplate } from '../../../../../api/experimental/testTemplate'
import { connect } from 'react-redux'
import { getObjectTemplateList, getStandardWork } from '../../store/index'

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
  const { getObjectTemplateListDispatch, getStandardWorkDispatch } = props
  const { id, setEditStatus } = props

  const objTemplateData = props.objectTemplate
  const standardWorkData = props.standardWork

  const [edit, setEdit] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [initValues, setInitValues] = useState({})
  const [form] = Form.useForm()

  setEditStatus(edit)  //用于其他tab点击前确认基础信息是否保存

  useEffect(() => {
    getObjectTemplateListDispatch()
    getStandardWorkDispatch()

  }, [getObjectTemplateListDispatch, getStandardWorkDispatch])


  useEffect(() => {
    if (objTemplateData.toJS().length > 0 && standardWorkData.toJS().length > 0) {
      testTemplate.testTemplateDetail(id)
        .then(res => {
          if (res) {
            const objectTemplateArr = res.objectTemplate && res.objectTemplate.split(",")
            const descrArr1 = objectTemplateArr && objectTemplateArr.map(item => {
              const data = objTemplateData.toJS().length > 0 && objTemplateData.toJS().find(obj => obj.code === item)
              if(data) {
                return "".concat(data.name)
              } else {
                return null
              }
            })

            const standardWorkArr = res.standardWork && res.standardWork.split(",")
            const descrArr2 = standardWorkArr && standardWorkArr.map(item => {
              const data = standardWorkData.toJS().length > 0 && standardWorkData.toJS().find(obj => obj.code === item)
              if(data) {
                return "".concat(data.name)
              } else {
                return null
              }
            })

            setInitValues({
              ...res,
              objectTemplate: res.objectTemplate ? res.objectTemplate.split(",") : [],
              standardWork: res.standardWork ? res.standardWork.split(",") : [],
              objectTemplateDesc: descrArr1 ? descrArr1.join("，") : null,
              standardWorkDesc: descrArr2 ? descrArr2.join("，") : null
            })
            form.resetFields()
          }
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dirty, objTemplateData, standardWorkData])


  //取消编辑
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }

  //基本信息编辑保存
  const save = () => {
    form.validateFields()
      .then(values => {
        form.isFieldsTouched() ?
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              let params = {
                ...values,
                objectTemplate: values.objectTemplate.toString(),
                standardWork: values.standardWork.toString(),
                _method: 'PUT'
              }
              testTemplate.testTemplateUpdate(id, params)
                .then(res => {
                  if (res) {
                    if (res && res.success) {
                      message.success("保存成功")
                      setDirty((dirty) => dirty + 1)
                      setEdit(false)
                    }
                  }
                })
            },
            onCancel() {
            },
          })
          : setEdit(false)
      })
  }

  return (
    <React.Fragment>
      <Row>
        <Col span={20}><h3>基础信息</h3></Col>
        {
          edit ?
            <Col span={4} align="right">
              <Button type="link" onClick={save}>保存</Button>
              <Button type="link" onClick={cancel}>取消</Button>
            </Col> :
            <Col span={4} align="right">
              <Button type="link" onClick={() => { setEdit(true) }}>编辑</Button>
            </Col>
        }
      </Row>
      <Form name="testBasicForm" {...formItemLayout} form={form} initialValues={initValues} style={{ margin: 20 }}>
        {
          edit ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="试验类型" name="experimentType">
                  <Input placeholder="请输入试验类型" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="试验名称"
                  name="name"
                  rules={[
                    { whitespace: true, message: '内容不能为空' },
                    { required: true, message: '请输入试验名称' },
                    { max: 20, message: '最大长度为20个字符' }
                  ]}
                >
                  <Input placeholder="请输入试验名称" maxLength={20} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="试验对象"
                  name="objectTemplate"
                  rules={[
                    { required: true, message: '请选择试验对象' }
                  ]}
                >
                  <Select
                    placeholder="请选择试验对象"
                    mode="multiple"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      objTemplateData.toJS().map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="标准作业计划" name="standardWork">
                  <Select
                    placeholder="请选择标准作业计划"
                    allowClear
                    mode="multiple"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      standardWorkData.toJS().map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验内容" name="content">
                  <Input.TextArea placeholder="请输入试验内容" maxLength={200} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验目的" name="objective">
                  <Input.TextArea placeholder="请输入试验目的" maxLength={200} />
                </Form.Item>
              </Col>
            </Row> :
            <Row>
              <Col span={12}>
                <Form.Item label="试验类型">
                  {initValues.experimentType}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验名称">
                  {initValues.name}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验对象">
                  {initValues.objectTemplateDesc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="标准作业计划">
                  {initValues.standardWorkDesc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验内容">
                  {initValues.content}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="试验目的">
                  {initValues.objective}
                </Form.Item>
              </Col>
            </Row>
        }
      </Form>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  objectTemplate: state.getIn(['testTemplate', 'objectTemplate']),   //试验对象
  standardWork: state.getIn(['testTemplate', 'standardWork']),  //标准作业计划
})

const mapDispatchOBJ = {
  getObjectTemplateListDispatch: getObjectTemplateList,
  getStandardWorkDispatch: getStandardWork,
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(Basic))

