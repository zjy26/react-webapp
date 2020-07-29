import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message, Divider } from 'antd'
import { MenuOutlined, FileSearchOutlined } from '@ant-design/icons'
import AnchorModal from './modal'
import { setTable, MainTable, getColumnSearchProps } from '../../../../common/table'
import { configLocation } from '../../../../../api/config/lineInfo'

const Anchor = props => {
  const { MyContext } = props
  const { lineCode, activeKey } = useContext(MyContext)
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})

  const [searchProps, setSearchProps] = useState({
    column: "",
    text: ""
  })
  const [filter, setFilter] = useState([])

  const [intervalOption, setIntervalOption] = useState([])
  //当前线路所有区间
  useEffect(() => {
    if(activeKey === "anchorInfo") {
      configLocation.configIntervalList({ level: 4, line: lineCode })
        .then(res => {
          if (res && res.models) {
            setIntervalOption(res.models)
          }
        })
    }
  }, [activeKey, lineCode])

  const columns = [
    {
      title: '编码',
      dataIndex: 'scode'
    },
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '锚段描述',
      dataIndex: 'descr',
      ...getColumnSearchProps('descr', "锚段描述", searchProps, setSearchProps)
    },
    {
      title: '锚段号',
      dataIndex: 'code',
      ...getColumnSearchProps('code', "锚段号", searchProps, setSearchProps)
    },
    {
      title: '锚段长度',
      dataIndex: 'length'
    },
    {
      title: '关联区间',
      dataIndex: 'interval',
      render: (text) => {
        const intervalArr = text.split(",")
        const intArr = intervalArr.map(item => +item)
        const descrArr = intArr.map(item => {
          const data = intervalOption.find(obj => obj.id === item)
          return "".concat(data ? data.descr : "")
        })
        return descrArr.join("，")
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <FileSearchOutlined onClick={(e) => { checkItem("check", record.id) }} />
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={(e) => { checkItem("edit", record.id) }}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={(e) => { deleteItem(record.id) }}>删除</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    setTable(configLocation.configAnchorlList, setData, setLoading, pager, setPager, filter, { line: lineCode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dirty])

  //关闭弹窗
  const handleCancel = () => setVisible(false)

  const checkItem = (type, id) => {
    setVisible(true)
    switch (type) {
      case "add":
        setModalProperty({ title: "新建", type: "add", id: null })
        break;
      case "edit":
        setModalProperty({ title: "编辑", type: "edit", id: id })
        break;
      default:
        setModalProperty({ title: "查看详情", type: "check", id: id })
    }
  }

  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configLocation.configAnchorDelete(id)
          .then((res) => {
            if (res.success === true) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
            } else {
              message.error("删除失败!")
            }
          })
      },
      onCancel() {
      },
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>锚段信息</h3></Col>
        <Col><Button type="primary" onClick={() => checkItem("add", null)} style={{ marginRight: 20 }}>新建锚段</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty, setFilter,
          rowkey: "id",
        }}
      />

      <AnchorModal {...{ visible: visible, modalProperty, handleCancel, setDirty, MyContext, intervalOption }} />
    </React.Fragment>
  )
}

export default React.memo(Anchor)
