import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Input, message, Modal, Divider } from 'antd'
import { ExclamationCircleOutlined, FileSearchOutlined, DeleteOutlined } from '@ant-design/icons'
import NewModal from './newModal'
import AuditModal from '../../common/auditModal'
import { testTemplate } from '../../../api/experimental/testTemplate'
import { Link } from 'react-router-dom'
import { setTable, MainTable } from '../../common/table'
import commonStyles from '../../Common.module.scss'

const PatrolConfig = props => {

  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
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

  //删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        testTemplate.testTemplateDelete(id)
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
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

  //列表条目
  const columns = [
    {
      title: '试验类型',
      dataIndex: 'experimentType'
    },
    {
      title: '试验名称',
      dataIndex: 'name',
      ellipsis: true
    },
    {
      title: '试验对象',
      dataIndex: 'objectTemplateName',
      ellipsis: true
    },
    {
      title: '试验内容',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '试验目的',
      dataIndex: 'objective',
      ellipsis: true
    },
    {
      title: '标准作业计划',
      dataIndex: 'standardWorkName',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <Link to={"/experiment-template-detail/" + record.id}><FileSearchOutlined /></Link>
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "试验模板"
    setTable(testTemplate.testTemplateList, setData, setLoading, pager, setPager, filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <React.Fragment>
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Input placeholder="请输入试验名称" ref={nameRef} onPressEnter={search} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>试验数据列表</h3></Col>
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
          rowkey: "id",
        }}
      />

      <NewModal {...{ handleCancel, setDirty, visible: visible.showNew }} />
      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
    </React.Fragment>
  )
}

export default React.memo(PatrolConfig)
