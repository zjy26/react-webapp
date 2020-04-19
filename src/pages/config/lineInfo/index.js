import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Row, Col, Button, Select, DatePicker, Modal, Dropdown, Menu } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import UploadModal from './uploadModal'
import NewModal from './newModal'
import { robotConfig } from '../../../api'
import { connect } from 'react-redux'
import {setTable, commonTable } from '../../common/table'
import { Link } from 'react-router-dom'
import moment from "moment"

const LineInfo = props => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [uploadTitle, setupLoadTitle] = useState("上传附件")
  const [visible, setVisible] = useState({
    showAudit: false,
    showImport: false,
    showUpload: false
  })
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [filter, setFilter] = useState([
    {"property":"code","value":""},
    {"property":"commissionDate","value":""}
  ])

  const handleCancel = () => {
    setVisible({
      showAudit: false,
      showImport: false,
      showUpload: false,
      showNew: false
    })
  }

  //搜索
  const search = () => {
    setPager({
      ...pager,
      current: 1,
      page: 1,
      start: 0,
    })
    setDirty(dirty=>dirty+1)
  }

  //新建
  const addItem = () => {
    setVisible({...visible, showNew: true})
  }

  //删除
  const deleteItem = (id)=>{
    Modal.confirm({
      title: '是否删除此配置，删除后数据不能恢复？/此条系统配置已在应用，请先移除，进行删除！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {

      },
      onCancel() {
      },
    })
  }

  //上传附件、图形
  const upload = (type, id)=> {
    if(type === "graph") {
      setupLoadTitle("上传图形")
    } else {
      setupLoadTitle("上传附件")
    }
    setVisible({...visible, showUpload: true})
  }

  //列表条目
  const columns = [
    {
      title: '线路描述',
      dataIndex: 'desc'
    },
    {
      title: '开始运营日期',
      dataIndex: 'commissionDate'
    },
    {
      title: '日运营时间',
      dataIndex: 'runTime'
    },
    {
      title: '线长',
      dataIndex: 'lineLeader'
    },
    {
      title: '班次',
      dataIndex: 'class'
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType'
    },
    {
      title: '备注',
      dataIndex: 'comment'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'}><Link to={"/config/line-info-detail/"+record.id}>查看详情</Link></Button>&nbsp;&nbsp;
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="delete" onClick={()=>{deleteItem(record.id)}}>删除</Menu.Item>
                  <Menu.Item key="graph" onClick={(e)=>{upload(e.key, record.id)}}>上传图形</Menu.Item>
                  <Menu.Item key="upload" onClick={(e)=>{upload(e.key, record.id)}}>上传附件</Menu.Item>
                </Menu>
              }
            >
              <Button>
                <DownOutlined />
              </Button>
            </Dropdown>
          </span>
        );
      }
    }
  ]

  useEffect(() => {
    document.title = "线路信息"
    setTable(robotConfig.robotConfigList, setData, setLoading, pager, setPager, filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <div>
      <Row style={{marginTop:30, marginLeft:30}}>
        <Col span={4}>
          <Select
            placeholder="请选择线路"
            style={{width:'80%'}}
            allowClear={true}
            onChange={value=>{
              setFilter(filter=>{
                filter.splice(0,1,{"property":"code","value":value?value:""})
                return filter
              })
            }}
          >
            {
              props.locationTree.line&&props.locationTree.line.map(item=>
                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
              )
            }
          </Select>
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder="请选择开始运营时间"
            style={{width:'80%'}}
            onChange={value=>{
              setFilter(filter=>{
                filter.splice(1,1,{"property":"commissionDate","value":value?moment(value, 'YYYY-MM-DD HH:mm:ss').valueOf():""})
                return filter
              })
            }}
          />
        </Col>
        <Button type="primary" onClick={search}>搜索</Button>
      </Row>

      <Row type="flex" justify="end">
        <Col span={2}>
          <Button type="danger" onClick={addItem}>新建线路</Button>
        </Col>
        <Col span={3}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})} }>信息导入</Menu.Item>
                <Menu.Item key="download">下载</Menu.Item>
                <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})} }>审计</Menu.Item>
              </Menu>
            }
          >
            <Button type="danger">更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col>
      </Row>

      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }

      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
      <ImportModal {...{handleCancel, visible: visible.showImport}} />
      <UploadModal {...{handleCancel, visible: visible.showUpload, title:uploadTitle}} />
      <NewModal {...{handleCancel, visible: visible.showNew}} />

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree
  }
}

export default connect(mapStateToProps, null)(React.memo(LineInfo))
