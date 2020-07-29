import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message, Tag, Divider } from 'antd'
import { MenuOutlined, FileSearchOutlined } from '@ant-design/icons'
import SiteModal from './modal'
import { setTable, MainTable, getColumnSearchProps } from '../../../../common/table'
import { configLocation } from '../../../../../api/config/lineInfo'

const Location = props => {
  const { lineCode, MyContext } = props
  const { entity } = useContext(MyContext)
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
  const [visible, setVisible] = useState({})
  const [modalProperty, setModalProperty] = useState({})

  const [searchProps, setSearchProps] = useState({
    column: "",
    text: ""
  })
  const [filter, setFilter] = useState([])

  const columns = [
    {
      title: null,
      width: 30,
      render: (text, record) => {
        if (record.isDutyPoint) {
          return (
            <Tag color="blue"> 值守点</Tag>
          )
        } else {
          return null
        }
      }
    },
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '站点',
      dataIndex: 'desc',
      ...getColumnSearchProps('desc', "站点", searchProps, setSearchProps)
    },
    {
      title: '站点代码',
      dataIndex: 'code'
    },
    {
      title: '车站类型',
      dataIndex: 'siteFunction',
      filterMultiple: false,
      filters: entity.siteFunctionOption.map(o=>{return{value:o.code, text:o.name}}),
      onFilter: (value, record) => record.siteFunction ? record.siteFunction.indexOf(value) === 0 : null,
      render: (text, record) => record._displayName.siteFunction
    },
    {
      title: '变电所类型',
      dataIndex: 'style',
      filterMultiple: false,
      filters: entity.styleOption.map(o=>{return{value:o.code, text:o.name}}),
      onFilter: (value, record) => record.style ? record.style.indexOf(value) === 0 : null,
      render: (text, record) => record._displayName.style
    },
    {
      title: '车站位置类型',
      dataIndex: 'locationType',
      filterMultiple: false,
      filters: entity.locationTypeOption.map(o=>{return{value:o.code, text:o.name}}),
      onFilter: (value, record) => record.locationType ? record.locationType.indexOf(value) === 0 : null,
      render: (text, record) => record._displayName.locationType
    },
    {
      title: '房间数量',
      dataIndex: 'roomNum',
      render: (text, record) => {
        if (record.roomNum > 0) {
          return (<a href={window.apiBase + '/iomm/config/robotpatrolloc/index?filter=%5B%7B%22property%22%3A%22siteStation%22%2C%22value%22%3A%22' + record.desc + '%22%7D%5D'}>{record.roomNum}</a>)
        } else {
          return record.roomNum
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <FileSearchOutlined onClick={(e) => { checkSite("check", record.id) }} />
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={(e) => { checkSite("edit", record.id) }}>编辑</Menu.Item>
                  <Menu.Item key="deleteSite" onClick={(e) => { deleteItem(record.id) }}>删除</Menu.Item>
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
    setTable(configLocation.configLocationList, setData, setLoading, pager, setPager, filter, { level: 4, line: lineCode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dirty])

  //关闭弹窗
  const handleCancel = () => setVisible({})

  const checkSite = (type, id) => {
    setVisible({ showSite: true })
    switch (type) {
      case "add":
        setModalProperty({ title: "新建", type: "add", siteId: null })
        break;
      case "edit":
        setModalProperty({ title: "编辑", type: "edit", siteId: id })
        break;
      default:
        setModalProperty({ title: "查看详情", type: "check", siteId: id })
    }
  }

  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configLocation.configLocationDelete(id)
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
        <Col><h3>站点信息</h3></Col>
        <Col><Button type="primary" onClick={() => checkSite("add", null)} style={{ marginRight: 20 }}>新建站点</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty, setFilter,
          rowkey: "id",
        }}
      />

      <SiteModal {...{ visible: visible.showSite, modalProperty, handleCancel, setDirty, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(Location)
