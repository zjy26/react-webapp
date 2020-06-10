import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, Select, message } from 'antd'
import { testTemplate } from '../../../api/experimental/testTemplate'
import { connect } from 'react-redux'
import { getObjectTemplateList, getStandardWork } from './store/index'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const NewModal = (props) => {
  const { getObjectTemplateListDispatch, getStandardWorkDispatch } = props
  const objTemplateOption = props.objectTemplate.toJS()
  const standardWorkOption = props.standardWork.toJS()

  const { visible, handleCancel, setDirty } = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    if (visible === true) {
      getObjectTemplateListDispatch()
      getStandardWorkDispatch()

      testTemplate.testTemplateNew()
        .then(res => {
          setInitValues({
            ...res,
            objectTemplate: res.objectTemplate ? res.objectTemplate : undefined,
            standardWork: res.standardWork ? res.standardWork : undefined,
          })
          form.resetFields()
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const params = {
          ...values,
          objectTemplate: values.objectTemplate.toString(),
          standardWork: values.standardWork.toString(),
          _method: 'PUT'
        }
        testTemplate.testTemplateAdd(params)
          .then((res) => {
            if (res && res.success) {
              handleCancel()
              setDirty((dirty) => dirty + 1)
              message.success("新建成功")
            } else {
              message.error("新建失败")
            }
          })
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="新建"
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form name="testNewForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="试验类型" name="experimentType" >
          <Input placeholder="请输入试验类型" />
        </Form.Item>
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
              objTemplateOption.map(item => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
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
              standardWorkOption.map(item => (
                <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="试验内容" name="content">
          <Input.TextArea placeholder="请输入试验内容" maxLength={200} />
        </Form.Item>
        <Form.Item label="试验目的" name="objective">
          <Input.TextArea placeholder="请输入试验目的" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
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

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(NewModal))
