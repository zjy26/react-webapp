import React, { useState, useEffect } from 'react'
import { DownOutlined, MenuOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Row, Col, Button, Select, DatePicker, Modal, Dropdown, Menu, message, Tooltip, Divider, Form } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import UploadModal from './uploadModal'
import NewModal from './newModal'
import { configLocation } from '../../../api/config/lineInfo'
import { people, CATENARY_TYPE, userLine } from '../../../api'
import { requestApi } from '../../../api/request'
import { connect } from 'react-redux'
import { setTable, MainTable } from '../../common/table'
import { Link } from 'react-router-dom'
import moment from "moment"
import commonStyles from '../../Common.module.scss'

const LineInfo = props => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [uploadProperty, setUploadProperty] = useState({})
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
  const [catenaryTypeOption, setCatenaryTypeOption] = useState([])  //触网类型
  const [lineLeaderOption, setLineLeaderDataOption] = useState([])  //线长

  useEffect(() => {
    document.title = "线路信息"
    setTable(configLocation.configLocationList, setData, setLoading, pager, setPager, filter, { level: 2 })

    userLine()  //新增线路后确保搜索框内线路数据及时更新

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  useEffect(() => {
    //线长
    people()
      .then((res) => {
        if (res && res.models) {
          setLineLeaderDataOption(res.models)
        }
      })

    //触网类型
    CATENARY_TYPE()
      .then((res) => {
        if (res && res.models) {
          setCatenaryTypeOption(res.models)
        }
      })
  }, [])

  //关闭弹窗
  const handleCancel = () => setVisible({})

  //搜索
  const search = () => {
    form.validateFields()
      .then(values => {
        const filterArr = [
          { "property": "code", "value": values.code ? values.code : "" },
          { "property": "commissionDate", "value": values.commissionDate ? moment(values.commissionDate).format("YYYY-MM-DD") : "" },
        ]
        setFilter(filterArr)
      })
      .then(() => {
        setPager({
          ...pager,
          current: 1,
          page: 1,
          start: 0,
        })
        setDirty(dirty => dirty + 1)
      })

  }

  //删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否删除此配置，删除后数据不能恢复？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        requestApi(
          configLocation.configLocationDelete(id),
          () => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          },
          (res) => message.error(res.actionErrors[0])
        )
      },
      onCancel() {
      },
    })
  }

  //上传附件、图形
  const upload = (type, id) => {
    setUploadProperty({
      title: type === "graph" ? "上传图形" : "上传附件",
      record: id
    })
    setVisible({ ...visible, showUpload: true })
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
        if (text) {
          return moment(text).format("YYYY-MM-DD")
        }
      }
    },
    {
      title: '日运营时间',
      render: (text, record) => {
        if (record.runStartTime) {
          const time1 = moment(record.runStartTime, 'hh:mm')
          const time2 = moment(record.runEndTime, 'hh:mm')
          const time = time2.diff(time1, 'minute')  //相差的分钟数
          const hours = Math.round(time / 60 * 100) / 100  //相差的小时数(保留两位小数)
          return (
            <Tooltip title={<><div>开始时间：{record.runStartTime}</div><div>结束时间：{record.runEndTime}</div></>}>
              <span>{hours}h</span>
            </Tooltip>
          )
        }
      }
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType',
      render: (text) => {
        if (text) {
          const arr = text.split(",")
          const descrArr = arr.map(item => {
            const data = catenaryTypeOption.find(obj => obj.code === item)
            return "".concat(data ? data.name : "")
          })
          return descrArr.join("，")
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <Link to={"/config/line-info-detail/" + record.id}><FileSearchOutlined /></Link>
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="delete" onClick={() => { deleteItem(record.id) }}>删除</Menu.Item>
                  <Menu.Item key="graph" onClick={(e) => { upload(e.key, record.id) }}>上传图形</Menu.Item>
                  <Menu.Item key="upload" onClick={(e) => { upload(e.key, record.id) }}>上传附件</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
          </>
        );
      }
    }
  ]

  return (
    <div>
      <Form form={form} name="lineSearchForm">
        <Row className={commonStyles.searchForm}>
          <Col span={5} id="codeArea">
            <Form.Item name="code" style={{ lineHeight: "unset" }}>
              <Select placeholder="请选择线路" allowClear getPopupContainer={() => document.getElementById('codeArea')}>
                {
                  props.userLine.toJS().map(item =>
                    <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item name="commissionDate" style={{ lineHeight: "unset" }}>
              <DatePicker placeholder="请选择开始运营时间" />
            </Form.Item>
          </Col>
          <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
        </Row>
      </Form>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>线路数据列表</h3></Col>
        <Col>
          <Button
            type="primary"
            onClick={
              () => setVisible({ showNew: true })
            }
          >
            新建线路
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
            <Button hidden>更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "id",
        }}
      />

      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
      <ImportModal {...{ handleCancel, visible: visible.showImport }} />
      <UploadModal {...{ handleCancel, visible: visible.showUpload, uploadProperty }} />
      <NewModal {...{ handleCancel, visible: visible.showNew, setDirty, user: props.user.toJS(), catenaryTypeOption, lineLeaderOption }} />

    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  userLine: state.getIn(['common', 'userLine'])
})

export default connect(mapStateToProps, null)(React.memo(LineInfo))
