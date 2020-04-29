import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Input, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AuditModal from '../../common/auditModal'
import NewModal from './newModal'
import { configEntity } from '../../../api'
import { connect } from 'react-redux'
import {setTable, commonTable } from '../../common/table'
import { Link } from 'react-router-dom'

const ConfigInfo = props => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState({
    showAudit: false,
    showNew: false
  })
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [filter, setFilter] = useState(null)
  const nameRef = useRef(null)

  const handleCancel = () => {
    setVisible({
      showAudit: false,
      showNew: false
    })
  }

  //搜索
  const search = () => {
    setFilter([{"property":"name","value":nameRef.current.state.value}])
    setPager({
      ...pager,
      current: 1,
      page: 1,
      start: 0,
    })
    setDirty(dirty=>dirty+1)
  }

  //删除
  const deleteItem = (code)=>{
    Modal.confirm({
      title: '是否删除此条系统配置，删除后数据不能恢复？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        configEntity.configEntityDelete(code)
        .then((res) =>{
          if(res.success === true) {
            message.success("删除成功")
            setDirty((dirty)=> dirty+1)
          } else {
            message.error("此条业务数据在使用中，如需要删除，请调整关联信息，再进行删除!")
          }
        })
      },
      onCancel() {
      },
    })
  }

  //列表条目
  const columns = [
    {
      title: '业务数据名称',
      dataIndex: 'name'
    },
    {
      title: '业务数据代码',
      dataIndex: 'code'
    },
    {
      title: '类型',
      dataIndex: 'type'
    },
    {
      title: '代码类型',
      dataIndex: 'codeType'
    },
    {
      title: '应用类型',
      dataIndex: 'applyType'
    },
    {
      title: '描述',
      dataIndex: 'descr'
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
            <Button type="link" size={'small'}><Link to={"/config/config-info-detail/"+record.code}>查看详情</Link></Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{deleteItem(record.code)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "业务基础数据"
    setTable(configEntity.configEntityList, setData, setLoading, pager, setPager, filter)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <div>
      <Row style={{margin:30}}>
        <Col span={6}><Input placeholder="请输入业务数据名称" ref={nameRef} onPressEnter={search}/></Col>
        <Col span={4}><Button type="primary" onClick={search}>搜索</Button></Col>
        <Col span={14} style={{textAlign: "right"}}>
          <Button type="danger"
            style={{marginRight:30}}
            onClick={
              ()=>setVisible({...visible, showNew:true})
            }
          >新建</Button>
          <Button type="danger"
            onClick={
              ()=>setVisible({...visible, showAudit:true})
            }>
            审计
          </Button>
        </Col>
      </Row>

      { commonTable(columns, data, "code", loading, setDirty, pager, setPager, {}) }

      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
      <NewModal {...{handleCancel, setDirty, visible: visible.showNew}} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(React.memo(ConfigInfo))
