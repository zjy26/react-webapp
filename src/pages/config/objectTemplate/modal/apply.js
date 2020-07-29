import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Input, Select, TreeSelect, Row, Col, Table, Divider, message } from 'antd'
import { configObjectTemplate } from '../../../../api/config/objectTemplate'

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

const Apply = props => {
  const { visible, handleCancel, location, modalProperty, setDirty } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [objectIds, setObjectIds] = useState([])

  useEffect(() => {
    if (modalProperty && visible === true) {
      setData([])
      form.setFieldsValue({
        brand: modalProperty.brandName,
        cls: modalProperty.clsName,
        modelNumber: modalProperty.modelNumber,
        usedTemplate: " "
      })
    } else {
      form.resetFields()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, modalProperty])

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'desc'
    },
    {
      title: '线路',
      render: (_, record) => {
        if (location && location.line) {
          const item = location.line.find(obj => obj.value === record.site.slice(0, 4))
          if (item)
            return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (_, record) => {
        if (location && location.site) {
          const item = location.site.find(obj => obj.value === record.site)
          if (item)
            return item.label
        }
      }
    },
    {
      title: '分类',
      dataIndex: 'functionalType',
      render: (_, record) => record._displayName.functionalType
    },
    {
      title: '品牌',
      dataIndex: 'brdName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '是否关联模板',
      render: (_, record) => {
        const text = record && record.template ? "是" : "否"
        return text
      }
    }
  ]

  //应用查询
  const check = () => {
    form.validateFields()
    .then(values => {
      setLoading(true)
      configObjectTemplate.templateApply({
        site: values.site.toString(),
        brand: modalProperty.brand,
        modelNumber: modalProperty.modelNumber,
        cls: modalProperty.cls,
        usedTemplate: values.usedTemplate
      })
        .then(res => {
          if(res && res.models) {
            setObjectIds([])
            setData(res.models)
            setLoading(false)
          }
        })
    })

  }

  //确定(应用模板)
  const rowSelection = {
    selectedRowKeys: objectIds,
    onChange: selectedRowKeys => {
      setObjectIds(selectedRowKeys)
    }
  }

  const handleOk = () => {
    configObjectTemplate.addObjTemplate({
      objectTemplate: modalProperty.templateCode,
      objectIds: objectIds.toString()
    })
    .then(res => {
      if(res && res.success) {
        message.success("应用成功")
        setDirty(dirty => dirty+1)
        handleCancel()
      }
    })
  }

  //渲染线路站点
  const renderLocation = (data) => {
    if(data && data.length>0) {
      return data.map((item) => {
        if (item.children) {
          return <TreeSelect.TreeNode key={item.value} value={item.value} title={item.label}>{renderLocation(item.children)}</TreeSelect.TreeNode>
        }
        return <TreeSelect.TreeNode key={item.value} value={item.value} title={item.label}></TreeSelect.TreeNode>
      })
    }
  }

  return (
    <React.Fragment>
      <Modal
        getContainer={false}
        maskClosable={false}
        title="模板应用"
        width={900}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form name="objectApplyForm" form={form} {...formItemLayout}>
          <Row gutter={24}>
            <Col span={24} id="objectApplySiteArea">
              <Form.Item
                {...{labelCol: {span: 3}, wrapperCol: {span: 20 }}}
                label="线路站点"
                name="site"
                rules={[{ required: true, message: '请选择线路站点'}]}
              >
                <TreeSelect
                  getPopupContainer={() => document.getElementById('objectApplySiteArea')}
                  placeholder="请选择线路站点"
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                >
                  { renderLocation(location&&location.lineSite) }
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="分类" name="cls">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌" name="brand">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name="modelNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否关联模板" name="usedTemplate" rules={[{ required: true, message: '请选择是否关联模板' }]}>
                <Select>
                  <Select.Option value=" ">全部</Select.Option>
                  <Select.Option value={true}>有关联模板</Select.Option>
                  <Select.Option value={false}>无关联模板</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={23} align="right">
              <Button type="primary" onClick={check}>查询</Button>
            </Col>
          </Row>
        </Form>
        <Divider />
        <Table rowKey="id" loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false} scroll={{ y: 400 }} />
      </Modal>
    </React.Fragment>
  )
}

export default React.memo(Apply)
