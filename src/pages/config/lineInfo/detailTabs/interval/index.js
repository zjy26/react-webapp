import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message, Divider } from 'antd'
import { MenuOutlined, FileSearchOutlined } from '@ant-design/icons'
import IntervalModal from './modal'
import { setTable, MainTable, getColumnSearchProps } from '../../../../common/table'
import { configLocation } from '../../../../../api/config/lineInfo'

const Interval = props => {
  const { lineCode, MyContext, setIntervalList } = props
  const { entity, activeKey } = useContext(MyContext)
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

  const [siteOption, setSiteOption] = useState([])

  const columns = [
    {
      title: '编码',
      dataIndex: 'code'
    },
    {
      title: '区间名称',
      dataIndex: 'descr',
      ...getColumnSearchProps('descr', "区间名称", searchProps, setSearchProps)
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType',
      filterMultiple: false,
      filters: entity.catenaryTypeOption.map(o=>{return{value:o.code, text:o.name}}),
      onFilter: (value, record) => record.catenaryType ? record.catenaryType.indexOf(value) === 0 : null,
      render: (text, record) => record._displayName.catenaryType
    },
    {
      title: '站点1',
      dataIndex: 'site1Desc',
      filterMultiple: false,
      filters: siteOption.map(o=>{return{value:o.desc, text:o.desc}}),
      onFilter: (value, record) => record.site1Desc ? record.site1Desc.indexOf(value) === 0 : null,
    },
    {
      title: '站点2',
      dataIndex: 'site2Desc',
      filterMultiple: false,
      filters: siteOption.map(o=>{return{value:o.desc, text:o.desc}}),
      onFilter: (value, record) => record.site2Desc ? record.site2Desc.indexOf(value) === 0 : null,
    },
    {
      title: '行车路线',
      dataIndex: 'vehicleRoute',
      filterMultiple: false,
      filters: entity.vehicleRouteOption.map(o=>{return{value:o.code, text:o.name}}),
      onFilter: (value, record) => record.vehicleRoute ? record.vehicleRoute.indexOf(value) === 0 : null,
      render: (text, record) => record._displayName.vehicleRoute
    },
    {
      title: '是否长/大区间',
      dataIndex: 'isLarge',
      filterMultiple: false,
      filters: [{text: "是", value: "true"}, {text: "否", value: "false"}],
      onFilter: (value, record) => record.isLarge&&record.isLarge.toString() ? record.isLarge.toString().indexOf(value) === 0 : null,
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
      filterMultiple: false,
      filters: [{text: "有", value: "true"}, {text: "无", value: "false"}],
      onFilter: (value, record) => record.hasIntervalPlace&&record.hasIntervalPlace.toString() ? record.hasIntervalPlace.toString().indexOf(value) === 0 : null,
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

  useEffect(() => {
    setTable(configLocation.configIntervalList, setData, setLoading, pager, setPager, filter, { level: 4, line: lineCode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dirty])

  //当前线路所有站点
  useEffect(() => {
    if(activeKey === "netInfo") {
      configLocation.configLocationList({ level: 4, line: lineCode })
        .then(res => {
          if (res && res.models) {
            setSiteOption(res.models)
          }
        })
    }
  }, [activeKey, lineCode])

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
          columns, data, loading, pager, setPager, setDirty, setFilter,
          rowkey: "id"
        }}
      />

      <IntervalModal {...{ visible: visible, modalProperty, handleCancel, setDirty, MyContext, setIntervalList, siteOption }} />
    </React.Fragment>
  )
}

export default React.memo(Interval)
