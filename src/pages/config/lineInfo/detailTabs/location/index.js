import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import SiteModal from './modal'
import { setTable, commonTable } from '../../../../common/table'
import { configLocation } from '../../../../../api'

const Location = props => {
  const {id, MyContext, entity, setSiteList} = props
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

  const columns = [
    {
      title: '站点',
      dataIndex: 'desc'
    },
    {
      title: '车站类型',
      dataIndex: 'siteFunction',
      render: (text) => {
        const item = entity.siteFunctionOption.find(obj=> obj.code === text)
        if(item) {
          return item.name
        }
      }
    },
    {
      title: '变电所类型',
      dataIndex: 'style',
      render: (text) => {
        const item = entity.styleOption.find(obj=> obj.code === text)
        if(item) {
          return item.name
        }
      }
    },
    {
      title: '车站位置类型',
      dataIndex: 'locationType',
      render: (text) => {
        const item = entity.locationTypeOption.find(obj=> obj.code === text)
        if(item) {
          return item.name
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button key="check" type="link" size={'small'} onClick={(e)=>{checkSite("check", record.id)}}>查看详情</Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={(e)=>{checkSite("edit", record.id)}}>编辑</Menu.Item>
                  <Menu.Item key="deleteSite" onClick={(e)=>{deleteItem(record.id)}}>删除</Menu.Item>
                  <Menu.Item key="upload" onClick={(e)=>{upload("upload", record.id)}}>上传平面图</Menu.Item>
                  <Menu.Item key="graph" onClick={(e)=>{upload("graph", record.id)}}>上传HT图形</Menu.Item>
                </Menu>
              }
            >
              <Button>
                <DownOutlined />
              </Button>
            </Dropdown>
          </span>
        )
      }
    }
  ]

  setSiteList(data)  //当前线路所有站点，传给区间站点选择所用

  useEffect(() => {
    setTable(configLocation.configLocationList, setData, setLoading, pager, setPager, [], {level: 4, lineId:id})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //关闭弹窗
  const handleCancel = () => setVisible({})

  const checkSite = (type, id) => {
    setVisible({showSite: true})
    switch (type) {
      case "add":
        setModalProperty({title: "新建", type: "add", siteId: null})
        break;
      case "edit":
        setModalProperty({title: "编辑", type: "edit", siteId: id})
        break;
      default:
        setModalProperty({title: "查看详情", type: "check", siteId: id})
    }
  }

  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        configLocation.configLocationDelete(id)
        .then((res) =>{
          if(res.success === true) {
            message.success("删除成功")
            setDirty((dirty)=> dirty+1)
          } else {
            message.error("删除失败!")
          }
        })
      },
      onCancel() {
      },
    })
  }

  const upload = () => {

  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>站点信息</h3></Col>
        <Col><Button type="danger" onClick={()=>checkSite("add", null)}>新建站点</Button></Col>
      </Row>
      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }

      <SiteModal {...{visible:visible.showSite, modalProperty, handleCancel, setDirty, MyContext}} />
    </React.Fragment>
  )
}

export default React.memo(Location)
