import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Modal, message, Divider, Table, Pagination, Form, Input } from 'antd'
import { FormOutlined, DeleteOutlined, FileAddOutlined, ExclamationCircleOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import PropertyModal, { NameModal } from './modal'
import { setTable } from '../../../../common/table'
import { testTemplate } from '../../../../../api/experimental/testTemplate'

const TestingProperty = props => {
  const { id } = props
  const [form] = Form.useForm()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [child, setChild] = useState({})
  const [visible, setVisible] = useState({})
  const [modalProperty, setModalProperty] = useState({})

  const [editingKey, setEditingKey] = useState('')
  const isEditing = record => record.id === editingKey

  const handleCancel = () => {
    setVisible({})
  }
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: `请输入试验名称` },
              { max: 5, message: '不超过5个字符' }
            ]}
          >
            <Input maxLength={5} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  //修改名称
  const edit = record => {
    form.setFieldsValue({
      name: record.name
    })
    setEditingKey(record.id)
  }

  //保存名称
  const save = id => {
    form.validateFields()
    .then(row => {
      testTemplate.experimentTemplateItemUpdate(id, { name: row.name, _method: 'PUT' })
        .then(res => {
          if (res && res.success) {
            message.success("修改成功")
            setEditingKey('')
            setDirty(dirty => dirty + 1)
          }
        })
    })
  }

  const columns = {
    mainCol: [
      { title: '试验名称', dataIndex: 'name', editable: true, width: 130 },
      {
        title: '编辑',
        align: 'left',
        render: (_, record) => {
          const editable = isEditing(record)
          return editable ? (
            <span>
              <SaveOutlined
                style={{ marginRight: 8 }}
                onClick={() => save(record.id)}
              />
              <CloseOutlined onClick={() => setEditingKey('')} />
            </span>
          ) : (
            <FormOutlined onClick={() => edit(record)} />
          )
        },
      },
      {
        title: '操作',
        align: 'right',
        render: (_, record) => {
          return (
            <>
              <FileAddOutlined onClick={() => { checkProperty("add", record.id) }} />
              <Divider type="vertical" />
              <DeleteOutlined onClick={() => deleteName(record.id)} />
            </>
          )
        }
      },
    ],
    childCol: [
      { title: '试验属性', dataIndex: 'propertyDesc' },
      { title: '计量单位', dataIndex: 'uom' },
      { title: '标准值', dataIndex: 'standardValue' },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <>
              <FormOutlined onClick={() => { checkProperty("edit", record.id, record.experimentTemplateItem) }} />
              <Divider type="vertical" />
              <DeleteOutlined onClick={() => deleteProperty(record.id, record.experimentTemplateItem)} />
            </>
          )
        }
      }
    ]
  }

  const mergedColumns = columns.mainCol.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    setTable(testTemplate.experimentTemplateItemList, setData, setLoading, pager, setPager, [], { experimentTemplateId: id })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //试验名称删除
  const deleteName = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        testTemplate.experimentTemplateItemDelete(id)
          .then((res) => {
            if (res && res.success) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
            }
          })
      },
      onCancel() {
      },
    })
  }

  //试验属性删除
  const deleteProperty = (id, item) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        testTemplate.experimentTemplateDataDelete(id)
          .then((res) => {
            if (res && res.success) {
              message.success("删除成功")
              renderChildData(true, item)
            }
          })
      },
      onCancel() {
      },
    })
  }

  //属性列表(点击展开时请求)
  const renderChildData = (expanded, id) => {
    if (expanded) {
      testTemplate.experimentTemplateDataList(
        {
          experimentTemplateItemId: id
        }
      )
        .then(res => {
          if (res && res.models) {
            const obj = {}
            obj[id] = res.models
            setChild((child) => {
              return {
                ...child,
                ...obj
              }
            })
          }
        })
    }
  }

  //渲染属性列表
  const expandedRowRender = (record) => {
    return (
      <Table
        rowKey="id"
        loading={loading}
        columns={columns.childCol}
        dataSource={child[record.id]}
        pagination={false}
      />
    )
  }

  //新增试验名称
  const checkName = (type, id) => {
    setVisible({ showName: true })
    setModalProperty({
      type: type,
      name: type === "add" ? "新建" : "编辑",
      id: id,
    })
  }

  //新增试验属性
  const checkProperty = (type, id, item) => {
    setVisible({ showProperty: true })
    setModalProperty({
      type: type,
      name: type === "add" ? "新建" : "编辑",
      id: id,
      item: item
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>试验属性</h3></Col>
        <Col><Button type="primary" onClick={() => { checkName("add", null) }} style={{ marginRight: 20 }}>新建</Button></Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey="id"
          columns={mergedColumns}
          expandedRowRender={(record) => expandedRowRender(record)}
          onExpand={(expanded, record) => renderChildData(expanded, record.id)}
          dataSource={data}
          pagination={false}
          showHeader={false}
        />
      </Form>
      <Row type="flex" justify="end" style={{ padding: '16px' }}>
        <Pagination
          pageSize={pager.limit}
          total={pager.total}
          current={pager.current}
          showSizeChanger
          showQuickJumper
          showTotal={() => `共 ${pager.total} 条`}
          onShowSizeChange={(current, pageSize) => {
            setPager({
              ...pager,
              current: 1,
              page: 1,
              start: 0,
              limit: pageSize
            })
            setDirty(dirty => dirty + 1)
          }}
          onChange={((page, pageSize) => {
            setPager({
              ...pager,
              current: page,
              page: page,
              start: page > 1 ? pageSize * (page - 1) : 0,
              limit: pageSize
            })
            setDirty(dirty => dirty + 1)
          })}
        />
      </Row>

      <PropertyModal {...{ visible: visible.showProperty, handleCancel, modalProperty, renderChildData }} />
      <NameModal {...{ visible: visible.showName, handleCancel, modalProperty, setDirty, id }} />

    </React.Fragment>
  )
}

export default React.memo(TestingProperty)
