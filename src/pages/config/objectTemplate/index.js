import React, { useState, useEffect, useRef } from 'react'
import { DownOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { Row, Col, Button, Input, Modal, Dropdown, Menu, message, Divider } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import { configObjectTemplate } from '../../../api/config/objectTemplate'
import { setTable, MainTable } from '../../common/table'
import { Link } from 'react-router-dom'
import commonStyles from '../../Common.module.scss'

const ObjectTemplate = () => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState({})
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [filter, setFilter] = useState([])
  const templateRef = useRef(null)

  useEffect(() => {
    document.title = "模板定义"
    setTable(configObjectTemplate.objectTemplateList, setData, setLoading, pager, setPager, filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //关闭弹窗
  const handleCancel = () => setVisible({})

  //搜索
  const search = () => {
    if (templateRef.current.state.value) {
      setFilter([{ "property": "name", "value": templateRef.current.state.value }])
    } else {
      setFilter([])
    }

    setPager({
      ...pager,
      current: 1,
      page: 1,
      start: 0,
    })
    setDirty(dirty => dirty + 1)
  }

  //删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否删除此配置，删除后数据不能恢复？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configObjectTemplate.objectTemplateDelete(id)
          .then((res) => {
            if (res.success === true) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
            } else {
              message.error(res.message)
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
      title: '模板名称',
      dataIndex: 'name'
    },
    {
      title: '编码',
      dataIndex: 'code'
    },
    {
      title: '版本/镜像',
      dataIndex: 'version'
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        const descr = text === "01" ? "设备" : "部件"
        return descr
      }
    },
    {
      title: '设备/部件分类',
      dataIndex: 'clsName'
    },
    {
      title: '品牌',
      dataIndex: 'brandName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <Link to={"/config/object-template-detail/" + record.id}><FormOutlined /></Link>
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]


  return (
    <React.Fragment>
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Input placeholder="请输入模板名称" ref={templateRef} onPressEnter={search} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>模板数据列表</h3></Col>
        <Col>
          <Button type="primary">
            <Link to={"/config/object-template-detail/" + null}>
              新建
            </Link>
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="import" onClick={() => { setVisible({ ...visible, showImport: true }) }}>信息导入</Menu.Item>
                <Menu.Item key="download">下载</Menu.Item>
                <Menu.Item key="audit" onClick={() => { setVisible({ ...visible, showAudit: true }) }}>审计</Menu.Item>
              </Menu>
            }
          >
            <Button>更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "code",
        }}
      />

      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
      <ImportModal {...{ handleCancel, visible: visible.showImport }} />

    </React.Fragment>
  )
}

export default React.memo(ObjectTemplate)
