/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react'
import { /*DownOutlined,*/ DeleteOutlined, FileSearchOutlined, CopyOutlined, LayoutOutlined } from '@ant-design/icons'
import { Row, Col, Button, Input, Modal/*, Dropdown, Menu*/, message, Divider, Tooltip, Radio } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import ApplyRangeModal from './modal/applyRange'
import ApplyModal from './modal/apply'
import CopyModal from './modal/copy'
import { configObjectTemplate } from '../../../api/config/objectTemplate'
import { setTable, MainTable } from '../../common/table'
import { Link } from 'react-router-dom'
import { getClass } from './store/actionCreators'
import { connect } from 'react-redux'
import commonStyles from '../../Common.module.scss'

const ObjectTemplate = (props) => {
  const { getClassDispatch } = props

  const [clsType, setClsType] = useState("substation")
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
  const [modalProperty, setModalProperty] = useState()

  useEffect(() => {
    document.title = "模板定义"

    switch(clsType) {
      case "catenary":  //触网
      setTable(configObjectTemplate.objectTemplateList, setData, setLoading, pager, setPager, filter, {type: '01', sysFilterSql: 'ot_clsMajor = "07"'})
      getClassDispatch({
        org: props.user.toJS().org,
        fun: 'asset.classification',
        clsFun: 'asset.classification',
        major: '07'
      })
      break;
      case "unit":  //部件
      setTable(configObjectTemplate.objectTemplateList, setData, setLoading, pager, setPager, filter, {type: '02'})
      break;
      default:  //变电
        setTable(configObjectTemplate.objectTemplateList, setData, setLoading, pager, setPager, filter, {type: '01', sysFilterSql: 'ot_clsMajor = "06"'})
        getClassDispatch({
          org: props.user.toJS().org,
          fun: 'asset.classification',
          clsFun: 'asset.classification',
          major: '06'
        })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clsType, dirty])

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

  //已应用
  const alreadyApply = (code) => {
    setVisible({showApplyRange: true})
    setModalProperty({templateCode: code})
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
      title: clsType === 'substation' ? "应用范围" : null,
      render: (_, record) => {
        return (
          clsType === 'substation'
          ? record.applied > 0 ? <a href="#" onClick={() => alreadyApply(record.code)}>已应用</a> : "未应用"
          : null
        )
      }
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
            {
              record.type==='01'
              ? <Link to={"/config/object-template-detail/object/" + record.id}><Tooltip title="查看详情"><FileSearchOutlined /></Tooltip></Link>
              : <Link to={"/config/object-template-detail/unit/" + record.id}><Tooltip title="查看详情"><FileSearchOutlined /></Tooltip></Link>
            }
            <Divider type="vertical" />
            <Tooltip title="删除"><DeleteOutlined onClick={() => { deleteItem(record.id) }} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="复制">
              <CopyOutlined
                onClick={() => {
                  setVisible({showCopy: true})
                  setModalProperty({ name: record.name })
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            {
              clsType === 'substation'
              ? <Tooltip title="模板应用">
                  <LayoutOutlined
                    onClick={() => {
                      setVisible({showApply: true})
                      setModalProperty({
                        templateCode: record.code,
                        clsName: record.clsName,
                        brandName: record.brandName,
                        modelNumber: record.modelNumber,
                        brand: record.brand,
                        cls: record.cls
                      })
                    }}
                  />
                </Tooltip>
              : null
            }
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
        <Col>
          <Radio.Group
            defaultValue="substation"
            style={{ marginBottom: 8 }}
            onChange={e => setClsType(e.target.value)}
          >
            <Radio.Button value="substation">变电设备模板</Radio.Button>
            <Radio.Button value="catenary">触网设备模板</Radio.Button>
            <Radio.Button value="unit">部件模板</Radio.Button>
          </Radio.Group>
        </Col>
        <Col>
        {
          clsType === "unit"
          ? <Button type="primary">
              <Link to={"/config/object-template-detail/unit/" + null}>
                新建部件模板
              </Link>
            </Button>
          : clsType === "catenary" ?
            <Button type="primary">
              <Link to={"/config/object-template-detail/" + clsType + "/" + null}>
                新建触网设备模板
              </Link>
            </Button>
          : <Button type="primary">
              <Link to={"/config/object-template-detail/" + clsType + "/" + null}>
                新建变电设备模板
              </Link>
            </Button>
        }
          {/* <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="import" onClick={() => { setVisible({ ...visible, showImport: true }) }}>信息导入</Menu.Item>
                <Menu.Item key="download">下载</Menu.Item>
                <Menu.Item key="audit" onClick={() => { setVisible({ ...visible, showAudit: true }) }}>审计</Menu.Item>
              </Menu>
            }
          >
            <Button>更多功能<DownOutlined /></Button>
          </Dropdown> */}
        </Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "code",
        }}
      />

      <ApplyRangeModal {...{handleCancel, visible: visible.showApplyRange, modalProperty, location:props.location.toJS()}} />
      <ApplyModal {...{handleCancel, visible: visible.showApply, modalProperty, setDirty, location:props.location.toJS() }} />
      <CopyModal {...{handleCancel, visible: visible.showCopy, clsType, modalProperty, clsOption: props.class.toJS()}} />
      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
      <ImportModal {...{ handleCancel, visible: visible.showImport }} />

    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  location: state.getIn(['common', 'location']),
  class: state.getIn(['objectTemplate', 'class']),
})

const mapDispatchOBJ = {
  getClassDispatch: getClass,
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(ObjectTemplate))
