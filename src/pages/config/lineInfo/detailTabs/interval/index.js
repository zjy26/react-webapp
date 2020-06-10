import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message, Divider } from 'antd'
import { MenuOutlined, FileSearchOutlined } from '@ant-design/icons'
import IntervalModal from './modal'
import { setTable, MainTable } from '../../../../common/table'
import { configLocation } from '../../../../../api/config/lineInfo'

const Interval = props => {
  const { lineCode, MyContext, setIntervalList } = props
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

  const columns = [
    {
      title: '区间名称',
      dataIndex: 'descr'
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType',
      render: (text, record) => record._displayName.catenaryType
    },
    {
      title: '站点1',
      dataIndex: 'site1Desc'
    },
    {
      title: '站点2',
      dataIndex: 'site2Desc'
    },
    {
      title: '行车路线',
      dataIndex: 'vehicleRoute',
      render: (text, record) => record._displayName.vehicleRoute
    },
    {
      title: '是否长/大区间',
      dataIndex: 'isLarge',
      render: (text) => {
        if (text) {
          return "是"
        } else {
          return "否"
        }
      }
    },
    {
      title: '有无区间所',
      dataIndex: 'hasIntervalPlace',
      render: (text) => {
        if (text) {
          return "有"
        } else {
          return "无"
        }
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

  setIntervalList(data)
  useEffect(() => {
    setTable(configLocation.configIntervalList, setData, setLoading, pager, setPager, [], { level: 4, line: lineCode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

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
        configLocation.configIntervalDelete(id)
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
        <Col><h3>区间信息</h3></Col>
        <Col><Button type="primary" onClick={() => checkItem("add", null)} style={{ marginRight: 20 }}>新建区间</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "id",
        }}
      />

      <IntervalModal {...{ visible: visible, modalProperty, handleCancel, setDirty, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(Interval)
