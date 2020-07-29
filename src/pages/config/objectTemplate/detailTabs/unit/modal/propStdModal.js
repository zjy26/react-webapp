import React, { useState, useEffect, useContext } from 'react'
import { Modal, Button, Form, Input, Select, message, Divider } from 'antd'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { properties, echoProperty } from '../../../../../../api'
import { configObjectTemplate } from '../../../../../../api/config/objectTemplate'
import { setTable, MainTable } from '../../../../../common/table'
import debounce from 'lodash/debounce'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
}

//参数标准弹窗
const ParametersStandardModal = props => {
  const { modalProperty, MyContext } = props
  const [childVisible, setChildVisible] = useState(false)
  const [childModalProperty, setChildModalProperty] = useState({})
  const childHandleCancel = () => {
    setChildVisible(false)
  }
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [data, setData] = useState([])
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })

  useEffect(() => {
    if (props.visible === true) {
      setTable(configObjectTemplate.unitPropStdList, setData, setLoading, pager, setPager, [], { unitTemplate: modalProperty.unitTemplate })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, modalProperty.unitTemplate])

  const checkItem = (type, id) => {
    setChildVisible(true)
    setChildModalProperty({
      type: type,
      id: id,
      title: type === "add" ? "添加" : "编辑"
    })
  }
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configObjectTemplate.unitPropStdDelete(id)
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '属性',
      dataIndex: 'propertyDesc'
    },
    {
      title: '值',
      dataIndex: 'value'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <FormOutlined onClick={() => { checkItem("edit", record.id) }} />
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]
  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        title="参数标准"
        width={800}
        visible={props.visible}
        onCancel={props.handleCancel}
        zIndex={500}
        footer={[
          <Button key="cancel" onClick={() => props.handleCancel()}>取消</Button>,
          <Button key="add" type="primary" onClick={() => { checkItem("add", null) }}>添加</Button>,
        ]}
      >
        <MainTable
          {...{
            columns, data, loading, setDirty, pager, setPager,
            rowkey: "id",
          }}
        />
      </Modal>
      <CheckParametersStandardModal {...{ modalProperty, childVisible, childModalProperty, childHandleCancel, setDirty, MyContext }} />
    </React.Fragment>
  )
}

//参数标准新增编辑弹窗
const CheckParametersStandardModal = props => {
  const { modalProperty, childModalProperty, childVisible, childHandleCancel, setDirty, MyContext } = props
  const { propertiesOption } = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [propertyData, setPropertyData] = useState(propertiesOption)
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (childVisible) {
      setOkLoading(false)
      if (childModalProperty.type === "edit") {
        configObjectTemplate.unitPropStdDetail(childModalProperty.id)
          .then(res => {
            //属性回显
            if(res && res.property) {
              echoProperty({value: res.property})
              .then(res => {
                setPropertyData([...propertyData, res.model])
              })
            }
            setInitValues(res)
            form.resetFields()
          })
      } else {
        configObjectTemplate.unitPropStdNew()
          .then(res => {
            setInitValues({
              ...res,
              property: res.property ? res.property : undefined
            })
            form.resetFields()
            })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childModalProperty, form])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (childModalProperty.type === "add") {
          configObjectTemplate.unitPropStdAdd({
            ...values,
            unitTemplate: modalProperty.unitTemplate,
            _method: 'PUT'
          })
            .then((res) => {
              if(res && res.success) {
                message.success("新建成功")
                childHandleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.success("新建失败")
                setOkLoading(false)
              }
            })
        } else {
          configObjectTemplate.unitPropStdUpdate(childModalProperty.id, {
            ...values,
            unitTemplate: modalProperty.unitTemplate,
            _method: 'PUT'
          })
            .then((res) => {
              if(res && res.success) {
                message.success("编辑成功")
                childHandleCancel()
                setDirty(dirty => dirty + 1)
              } else {
                message.success("编辑失败")
                setOkLoading(false)
              }
            })
        }
      })
  }

  //属性搜索时请求
  const propertySearch = (key) => {
    properties({
      limit: 30,
      filter: JSON.stringify([{ property: 'desc', value: key }])
    })
      .then(res => {
        setPropertyData(res.models)
      })
  }
  const handleSearch = debounce(propertySearch, 500)

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={childModalProperty.title}
      okText="确认"
      cancelText="取消"
      visible={childVisible}
      onCancel={childHandleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="templatePropStdForm" form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="属性" name="property" rules={[{ required: true, message: '请选择属性' }]}>
          <Select
            placeholder="请选择属性"
            allowClear
            showSearch
            filterOption={false}
            onSearch={handleSearch}
          >
            {
              propertyData.length > 0 && propertyData.map(item => (
                <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="值"
          name="value"
          rules={[
            { required: true, message: '请输入值' },
            { whitespace: true, message: '内容不能为空' }
          ]}
        >
          <Input placeholder="请输入值" />
        </Form.Item>
        <Form.Item label="备注" name="remarks">
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ParametersStandardModal)
