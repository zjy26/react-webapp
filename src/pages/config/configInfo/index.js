import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Input, Modal, message, Divider } from 'antd'
import { ExclamationCircleOutlined, FileSearchOutlined, DeleteOutlined } from '@ant-design/icons'
import AuditModal from '../../common/auditModal'
import NewModal from './newModal'
import { configEntity } from '../../../api/config/configInfo'
import { setTable, MainTable } from '../../common/table'
import { Link } from 'react-router-dom'
import commonStyles from '../../Common.module.scss'

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
  const [filter, setFilter] = useState([])
  const nameRef = useRef(null)

  const handleCancel = () => {
    setVisible({
      showAudit: false,
      showNew: false
    })
  }

  //搜索
  const search = () => {
    const nameVal = nameRef.current.state.value
    nameVal ? setFilter([{ "property": "name", "value": nameVal }]) : setFilter([])

    setPager({
      ...pager,
      current: 1,
      page: 1,
      start: 0,
    })
    setDirty(dirty => dirty + 1)
  }

  //删除
  const deleteItem = (code) => {
    Modal.confirm({
      title: '是否删除此条系统配置，删除后数据不能恢复？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configEntity.configEntityDelete(code)
          .then((res) => {
            if (res.success === true) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
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
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: '业务数据代码',
      dataIndex: 'code'
    },
    {
      title: '描述',
      dataIndex: 'descr',
      ellipsis: true
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <Link to={"/config/config-info-detail/" + record.code}><FileSearchOutlined /></Link>
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.code) }} />
          </>
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
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Input placeholder="请输入业务数据名称" ref={nameRef} onPressEnter={search} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>业务数据列表</h3></Col>
        <Col>
          <Button type="primary"
            onClick={
              () => setVisible({ ...visible, showNew: true })
            }
          >新建</Button>
          <Button
            onClick={
              () => setVisible({ ...visible, showAudit: true })
            }>
            审计
          </Button>
        </Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "code",
        }}
      />

      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
      <NewModal {...{ handleCancel, setDirty, visible: visible.showNew }} />
    </div>
  )
}

export default React.memo(ConfigInfo)
