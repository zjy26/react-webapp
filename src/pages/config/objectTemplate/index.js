import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Input, Modal } from 'antd'
import AuditModal from '../../common/auditModal'
import { robotConfig } from '../../../api'
import { connect } from 'react-redux'
import {setTable, commonTable } from '../../common/table'
import { Link } from 'react-router-dom'

const ObjectTemplate = props => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState({
    showAudit: false
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
      showAudit: false
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
  const deleteItem = (id)=>{
    Modal.confirm({
      title: '是否删除模板信息，删除后模板将不能恢复？/模板正在引用，暂不可删除模板！',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {

      },
      onCancel() {
      },
    })
  }

  //列表条目
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'template'
    },
    {
      title: '创建人',
      dataIndex: 'createdby'
    },
    {
      title: '创建时间',
      dataIndex: 'created'
    },
    {
      title: '代码类型',
      dataIndex: 'type'
    },
    {
      title: '更新人',
      dataIndex: 'updatedby'
    },
    {
      title: '更新时间',
      dataIndex: 'updated'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'}><Link to={"/config/object-template-detail/"+record.id}>查看详情</Link></Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{deleteItem(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "模板定义"
    setTable(robotConfig.robotConfigList, setData, setLoading, pager, setPager, filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <div>
      <Row style={{margin:30}}>
        <Col span={6}><Input placeholder="请输入模板名称" ref={nameRef} onPressEnter={search}/></Col>
        <Col span={4}><Button type="primary" onClick={search}>搜索</Button></Col>
        <Col span={14} style={{textAlign: "right"}}>
          <Button type="danger"style={{marginRight:30}}><Link to={"/config/object-template-detail/"+ null}>新建</Link></Button>
          <Button type="danger"
            onClick={
              ()=>setVisible({...visible, showAudit:true})
            }>
            审计
          </Button>
        </Col>
      </Row>

      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }

      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, null)(React.memo(ObjectTemplate))
