import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Row, Col, Button, Select, DatePicker, Modal, Dropdown, Menu, message, Tooltip } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import UploadModal from './uploadModal'
import NewModal from './newModal'
import { configLocation, people, CATENARY_TYPE } from '../../../api'
import { connect } from 'react-redux'
import {setTable, commonTable } from '../../common/table'
import { Link } from 'react-router-dom'
import moment from "moment"

const LineInfo = props => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [uploadTitle, setupLoadTitle] = useState("上传附件")
  const [visible, setVisible] = useState({})
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
  const [catenaryTypeOption, setCatenaryTypeOption] = useState([])  //触网类型
  const [lineLeaderOption, setLineLeaderDataOption] = useState([])  //线长

  useEffect(() => {
    document.title = "线路信息"
    setTable(configLocation.configLocationList, setData, setLoading, pager, setPager, filter, {level: 2})

    //线长
    people()
    .then((res)=>{
      if(res && res.models) {
        setLineLeaderDataOption(res.models)
      }
    })

    //触网类型
    CATENARY_TYPE()
    .then((res)=>{
      if(res && res.models) {
        setCatenaryTypeOption(res.models)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //关闭弹窗
  const handleCancel = () => setVisible({})

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

  //删除
  const deleteItem = (id)=>{
    Modal.confirm({
      title: '是否删除此配置，删除后数据不能恢复？',
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
            message.error("该线路下存在站点，禁止删除!")
          }
        })
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
      dataIndex: 'commissionDate',
      render: (text) => {
        if(text) {
          return moment(text ).format("YYYY-MM-DD")
        }
      }
    },
    {
      title: '日运营时间',
      render: (text, record) => {
        if(record.runStartTime) {
          const time1 = moment(record.runStartTime, 'hh:mm')
          const time2 = moment(record.runEndTime, 'hh:mm')
          const time = time2.diff(time1, 'minute')  //相差的分钟数
          const hours = Math.round(time/60*100)/100  //相差的小时数(保留两位小数)
          return (
            <Tooltip title={<><div>开始时间：{record.runStartTime}</div><div>结束时间：{record.runEndTime}</div></>}>
              <span>{hours}h</span>
            </Tooltip>
          )
        }
      }
    },
    {
      title: '线长',
      dataIndex: 'lineLeader',
      render: (text, record) => record._displayName.lineLeader
    },
    {
      title: '班次',
      dataIndex: 'class'
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType',
      render: (text) => {
        const item = catenaryTypeOption.find(obj=>obj.code === text)
        if(item) {
          return item.name
        }
      }
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
              data&&data.map(item=>
                <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
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
          <Button
            type="danger"
            onClick={
              ()=>setVisible({showNew: true})
            }
          >
            新建线路
          </Button>
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
      <NewModal {...{handleCancel, visible: visible.showNew, setDirty, user:props.user, catenaryTypeOption, lineLeaderOption}} />

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(React.memo(LineInfo))
