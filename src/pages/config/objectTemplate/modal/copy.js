import React, { useState, useEffect } from 'react'
import { Modal, Form ,Input, Select, TreeSelect } from 'antd'
import { brands } from '../../../../api'
import debounce from 'lodash/debounce'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Copy = props => {
  const { modalProperty, visible, handleCancel, clsType, clsOption } = props
  const [form] = Form.useForm()
  const [brandData, setBrandData] = useState([])

  useEffect(() => {
    if (visible === true) {
      handleBrandSearch()
      form.setFieldsValue({name: modalProperty&&modalProperty.name})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  //渲染分类
  const renderObjCls = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.text} disabled>{renderObjCls(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  //品牌搜索时请求
  const handleBrandSearch = debounce((key) => {
    brands({
      limit: 30,
      filter: key ? JSON.stringify([{ property: 'name', value: key }]) : []
    })
      .then(res => {
        setBrandData(res.models)
      })
  }, 500)

  const handleOk = () => {
    form.validateFields()
    .then(values => {

    })
  }

  return (
    <React.Fragment>
      <Modal
        getContainer={false}
        maskClosable={false}
        title="复制模板"
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form name="objectCopyForm" form={form} {...formItemLayout}>
          <Form.Item
            label="模板名称"
            name="name"
            rules={[
              { whitespace: true, message: '内容不能为空' },
              { required: true, message: '请输入模板名称'}
            ]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          {
            clsType !== "unit"
            ? <Form.Item label="分类" name="cls" rules={[{ required: true, message: '请选择分类' }]}>
                <TreeSelect
                  showSearch
                  placeholder="请选择设备分类"
                  treeDefaultExpandAll
                  treeNodeFilterProp="title"
                >
                  { renderObjCls(clsOption) }
                </TreeSelect>
              </Form.Item>
            : null
          }
          <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择品牌' }]}>
            <Select
              placeholder="请选择品牌"
              showSearch
              allowClear
              filterOption={false}
              onSearch={handleBrandSearch}
            >
              {
                brandData.length > 0 && brandData.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
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
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default React.memo(Copy)
