import React, { useState, useEffect, useContext } from 'react'
import { ExclamationCircleOutlined, MenuOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { Modal, Button, Tabs, message, Dropdown, Menu, Table, Divider, Pagination, Row } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import Modal1 from './modal/modal1'
import Modal2 from './modal/modal2'
import Modal3 from './modal/modal3'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const Monitor = props => {
  const { MyContext } = props
  const { templateCode, monitorPointTypeOption } = useContext(MyContext)

  const [activeKey, setActiveKey] = useState("01")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [visible, setVisible] = useState({})
  const [modalProperty, setModalProperty] = useState({})

  const [child, setChild] = useState({})

  useEffect(() => {
    setTable(configObjectTemplate.propertyTemplateList, setData, setLoading, pager, setPager, [], { template: templateCode, source: activeKey })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, activeKey])

  const columns = {
    col1: [
      { title: '属性代码', dataIndex: 'code' },
      { title: '属性名称', dataIndex: 'descr' },
      { title: '属性说明', dataIndex: 'alias', ellipsis: true },
      {
        title: '开关属性', dataIndex: 'switch', render: (text) => {
          return text === true ? "有" : "无"
        }
      },
      { title: '故障原因', dataIndex: 'reason', ellipsis: true },
      { title: '处理方法', dataIndex: 'action', ellipsis: true },
      { title: '备注', dataIndex: 'remarks', ellipsis: true },
      {
        title: '操作', render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={() => checkDefault("add", record.id, record.code)}>添加预设值</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={() => { check("edit", record.id) }}>编辑</Menu.Item>
                    <Menu.Item key="delete" onClick={() => { deleteItem(record.id) }}>删除</Menu.Item>
                  </Menu>
                }
              >
                <MenuOutlined style={{ cursor: 'pointer' }} />
              </Dropdown>
            </span>
          )
        }
      }
    ],
    childCol: [
      { title: '描述', dataIndex: 'name' },
      { title: '值', dataIndex: 'value' },
      {
        title: '预设值', dataIndex: 'isDefault', render: (text) => {
          return text === true ? "是" : "否"
        }
      },
      {
        title: '操作', render: (text, record) => {
          return (
            <>
              <FormOutlined onClick={() => { checkDefault("edit", record.id, record.property) }} />
              <Divider type="vertical" />
              <DeleteOutlined onClick={() => { deleteDefault(record.id, record.property) }} />
            </>
          )
        }
      },
    ],
    col2: [
      { title: '属性代码', dataIndex: 'code' },
      { title: '属性名称', dataIndex: 'descr' },
      { title: '属性说明', dataIndex: 'alias', ellipsis: true },
      { title: '备注', dataIndex: 'remarks', ellipsis: true },
      { title: '阈值上限', dataIndex: 'maxValue' },
      { title: '阈值下限', dataIndex: 'minValue' },
      { title: '增量阈值上限', dataIndex: 'incMaxValue' },
      { title: '增量阈值下限', dataIndex: 'incMinValue' },
      { title: '阈值中线', dataIndex: 'medianValue' },
      { title: '计量单位', dataIndex: 'uomName' },
      { title: '故障原因', dataIndex: 'reason', ellipsis: true },
      { title: '处理方法', dataIndex: 'action', ellipsis: true },
      {
        title: '操作', render: (text, record) => {
          return (
            <>
              <FormOutlined onClick={() => { check("edit", record.id) }} />
              <Divider type="vertical" />
              <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
            </>
          )
        }
      }
    ]
  }

  //预设值列表(点击展开时请求)
  const renderChildData = (expanded, propertyCode) => {
    if (expanded) {
      configObjectTemplate.propEntityTemplateList(
        {
          template: templateCode,
          source: activeKey,
          property: propertyCode
        }
      )
        .then(res => {
          if (res && res.models) {
            const obj = {}
            obj[propertyCode] = res.models
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

  //渲染预设值列表
  const expandedRowRender = (record) => {
    return (
      <Table
        rowKey="id"
        loading={loading}
        columns={columns.childCol}
        dataSource={child[record.code]}
        pagination={false}
      />
    )
  }

  const handleCancel = () => {
    setVisible({})
  }

  //新建编辑
  const check = (type, id) => {
    setModalProperty({ title: type === "add" ? "新建" : "编辑", type: type, id: id, activeKey: activeKey })
    if (activeKey === "02" || activeKey === "07") {
      setVisible({ showModal2: true })
    } else {
      setVisible({ showModal1: true })
    }
  }

  //列表删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        configObjectTemplate.propertyTemplateDelete(id)
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  //新增编辑预设值
  const checkDefault = (type, id, property) => {
    setModalProperty({
      title: type === "add" ? "添加" : "编辑",
      type: type,
      id: id,
      property: property,
      activeKey: activeKey
    })
    setVisible({ showModal3: true })
  }

  //删除预设值
  const deleteDefault = (id, code) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        configObjectTemplate.propEntityTemplateDelete(id)
          .then((res) => {
            if (res.success) {
              message.success("删除成功")
              renderChildData(true, code)
            }
          })
      },
      onCancel() {
      },
    })
  }

  let content = null
  switch (activeKey) {
    case "01":
      content = <MainTable
        {...{
          data, loading, pager, setPager, setDirty,
          columns: columns.col2,
          rowkey: "code",
          scroll: { x: 1600 },
        }}
      />
      break;
    case "02":
      content = <>
        <Table
          rowKey="code"
          columns={columns.col1}
          expandedRowRender={(record) => expandedRowRender(record)}
          onExpand={(expanded, record) => renderChildData(expanded, record.code)}
          dataSource={data}
          pagination={false}
        />
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
      </>
      break;
    case "09":
      content = <MainTable
        {...{
          data, loading, pager, setPager, setDirty,
          columns: columns.col2,
          rowkey: "code",
          scroll: { x: 1600 },
        }}
      />
      break;
    case "07":
      content = <>
        <Table
          rowKey="code"
          columns={columns.col1}
          expandedRowRender={(record) => expandedRowRender(record)}
          onExpand={(expanded, record) => renderChildData(expanded, record.code)}
          dataSource={data}
          pagination={false}
        />
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
      </>
      break;
    case "06":
      content = <MainTable
        {...{
          data, loading, pager, setPager, setDirty,
          columns: columns.col2,
          rowkey: "code",
          scroll: { x: 1600 },
        }}
      />
      break;
    case "08":
      content = <MainTable
        {...{
          data, loading, pager, setPager, setDirty,
          columns: columns.col2,
          rowkey: "code",
          scroll: { x: 1600 },
        }}
      />
      break;
    default:
  }

  return (
    <React.Fragment>
      <Tabs
        activeKey={activeKey}
        onChange={key => setActiveKey(key)}
        tabBarExtraContent={<Button type="primary" onClick={() => { check("add", null) }}>新建</Button>}
        style={{ margin: '0 30px' }}
      >
        {
          monitorPointTypeOption.map(item => (
            <Tabs.TabPane tab={item.name} key={item.code}>
              {content}
            </Tabs.TabPane>
          ))
        }
      </Tabs>

      <Modal1 {...{ visible: visible.showModal1, handleCancel, modalProperty, MyContext, setDirty }} />
      <Modal2 {...{ visible: visible.showModal2, modalProperty, handleCancel, MyContext, setDirty }} />
      <Modal3 {...{ visible: visible.showModal3, modalProperty, handleCancel, MyContext, renderChildData }} />
    </React.Fragment>
  )
}

export default React.memo(Monitor)
