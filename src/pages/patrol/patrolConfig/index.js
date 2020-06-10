import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Cascader, Modal, message, Divider } from 'antd'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import ConfigModal from './configModal'
import { robotConfig } from '../../../api'
import { connect } from 'react-redux'
import {setTable, MainTable } from '../../common/table'
import commonStyles from '../../Common.module.scss'

const PatrolConfig = props => {
  const locationTree = props.location.toJS()

  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("新增配置")
  const [dirty, setDirty] = useState(0)
  const [newData, setNew] = useState(0)
  const [currentId, setCurrentId] = useState(null)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [filter, setFilter] = useState(null)
  const siteRef = useRef(null)

  const newModal = ()=> {
    setModalTitle("新增配置")
    setCurrentId(null)
    setNew((newData)=> newData+1)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false);
  }

  //删除
  const deleteItem = (id)=>{
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        robotConfig.robotConfigDelete(id)
        .then(() =>{
          message.success("删除成功")
          setDirty((dirty)=> dirty+1)
        })
      },
      onCancel() {
      },
    })
  }

  //编辑
  const editItem = (id)=>{
    setCurrentId(id)
    setModalTitle("编辑配置")
    setVisible(true)
  }

  //搜索
  const search = ()=> {
    if(siteRef.current.state.value[1]) {
      setFilter([{"property":"site","value": siteRef.current.state.value[1]}])
    } else {
      setFilter(null)
    }

    setPager({
      ...pager,
      current: 1,
      page: 1,
      start: 0,
    })
    setDirty(dirty=>dirty+1)
  }

  //列表条目
  const columns = [
    {
      title: '线路',
      dataIndex: 'siteLine',
      render:(text, record) => record.siteLine
    },
    {
      title: '站点',
      dataIndex: 'site',
      render:(text, record) => record.siteStation
    },
    {
      title: '服务器IP',
      dataIndex: 'ip'
    },
    {
      title: '服务器端口',
      dataIndex: 'port'
    },
    {
      title: '视频推流地址',
      dataIndex: 'cameraStreamUrl'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <FormOutlined onClick={()=>{editItem(record.id)}} />
            <Divider type="vertical" />
            <DeleteOutlined onClick={()=>{deleteItem(record.id)}} />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "巡检配置"
    setTable(robotConfig.robotConfigList, setData, setLoading, pager, setPager, filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <div>
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Cascader options={locationTree.lineSite} placeholder="请选择线路/站点" ref={siteRef} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>巡检配置数据列表</h3></Col>
        <Col>
          <Button type="primary" onClick={newModal}>新建</Button>
        </Col>
      </Row>

      <MainTable
        {...{ columns, data, loading, pager, setPager, setDirty,
          rowkey:"id",
        }}
      />

      <ConfigModal {...{visible, handleCancel, currentId, setDirty, title:modalTitle, newData, locationTree}} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location'])
})

export default connect(mapStateToProps, null)(React.memo(PatrolConfig))
