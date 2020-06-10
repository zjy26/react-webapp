import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from "moment"
import { DownOutlined } from '@ant-design/icons'
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Cascader,
  Switch,
  Menu,
  Dropdown,
  Modal,
  message,
} from 'antd';
import CycleModal from './cycleModal'
import ImportModal from '../../common/importModal'
import AuditModal from '../../common/auditModal'
import { robotPlan } from '../../../api'
import { connect } from 'react-redux'
import {setTable, commonTable } from '../../common/table'

const PatrolPlan = props => {
  const locationTree = props.location.toJS()
  const recurrenceData = props.recurrenceData.toJS()
  const weekData = props.weekData.toJS()
  const monthData = props.monthData.toJS()

  const [form] = Form.useForm()
  const [dirty, setDirty] = useState(0)
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({  //弹窗
    showCycle: false,
    showDetail: false,
    showImport: false,
    showAudit: false
  })
  const [recurrence, setRecurrence] = useState(null)
  const [currentId, setCurrentId] = useState(null)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [filter, setFilter] = useState(null)

  const handleCancel = () => {
    setVisible({
      showCycle: false,
      showDetail: false,
      showImport: false,
      showAudit: false
    })
  }

  //搜索
  const search = async () => {
    try {
      const values = await form.validateFields()
      const filterArr = []
      for(var key of Object.keys(values)) {
        const filterObj = {}
        filterObj["property"] = key
        filterObj["value"] = values[key]?values[key]:""
        if(key==="site") {
          values[key].length>0 ? filterObj["value"] = values[key][1] : filterObj["value"] = ""
        }
        filterArr.push(filterObj)
      }

      setFilter(filterArr)

      setPager({
        ...pager,
        current: 1,
        page: 1,
        start: 0,
      })
      setDirty(dirty=>dirty+1)
    }
    catch {}
  }

  //变更状态
  const showConfirm = (id, checked) => {
    Modal.confirm({
      title: `是否将该计划${checked==="APPR" ? '使用状态' : '停用状态'}变更为${checked==="APPR" ? '停用状态' : '使用状态'}？变更后，该巡检计划${checked==="APPR" ? '将会暂停' : '会按时进行巡检'}。`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        (() => {
          robotPlan.robotPlanStatus({id: id, patrolPlanStatus:checked === "APPR"? "WAPPR":"APPR"})
          .then(res=>{
            message.success("状态变更成功")
          })
          .catch(err=>{
            console.log("状态变更失败")
          })
          setDirty(dirty=>dirty+1)
        })()
      },
      onCancel() {
      },
    })
  }

  //编辑周期
  const editRecurrence = (id, recurrence) => {
    setCurrentId(id)
    setRecurrence(recurrence)
    setVisible({showCycle:true})
  }

  //手动启动
  const manual = (id)=> {
    robotPlan.robotPlanManual({id: id})
    .then(()=>{
      message.success("启动成功")
    })
    .catch(err=>{
      console.log("启动失败")
    })
  }

  //更多功能按钮
  const menu = (
    <Menu>
      <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})} }>信息导入</Menu.Item>
      <Menu.Item key="download">下载</Menu.Item>
      <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})} }>审计</Menu.Item>
    </Menu>
  )

  //列表条目
  const columns = [
    {
      title: '巡检名称',
      dataIndex: 'desc',
      width: 300,
      render: (text, record) => {
        return (
          <Button type="link" size={'small'}><Link to={"/patrol-plan-detail/"+record.id}>{text}</Link></Button>
        )
      }
    },
    {
      title: '线路',
      dataIndex: 'line',
      render: (text, record) => {
        if(locationTree && locationTree.line) {
          const item = locationTree.line.find(obj=> obj.value === record.site.slice(0,4))
          return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (text, record) => record.siteStation
    },
    {
      title: '巡检人',
      dataIndex: 'peopleName',
    },
    {
      title: '周期',
      dataIndex: 'recurrence',
      render: (text, record) => {
        if(record.recurrence) {
          const item = recurrenceData.length>0&&recurrenceData.find(obj=>obj.value === record.recurrence)
          if(item){
            return item.name
          }
        }
      }
    },
    {
      title: '计划状态',
      dataIndex: 'patrolPlanStatus',
      render: (text, record)=> (
        <Switch key={record.id} checkedChildren="使用" unCheckedChildren="停用"
          checked={record.patrolPlanStatus === "APPR" ? true : false}
          onChange={()=>showConfirm(record.id, record.patrolPlanStatus)}
        />
      )
    },
    {
      title: '创建人',
      dataIndex: 'createdbyFullname',
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      render: (text, record) => moment(record.startDate).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1"><Link to={"/patrol-plan-detail/"+record.id}>查看详情</Link></Menu.Item>
                  <Menu.Item key="2" onClick={()=>{editRecurrence(record.id, record.recurrence)}}>编辑周期</Menu.Item>
                  <Menu.Item key="3" onClick={()=>{manual(record.id)}}>手动启动</Menu.Item>
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
  ];

  //获取列表数据
  useEffect(() => {
    document.title = "巡检计划"
    setTable(robotPlan.robotPlanList, setData, setLoading, pager, setPager, filter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  return (
    <div>
      <Form layout="inline" form={form} style={{margin: 30}}>
        <Row gutter={24}>
          <Col span={4}>
            <Form.Item name="desc">
              <Input placeholder="请输入计划名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="createdbyFullname">
              <Input placeholder="请输入计划创建人" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="peopleName">
              <Input placeholder="请输入计划巡检人" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="site">
              <Cascader
                options={locationTree.lineSite}
                placeholder="请选择线路/站点"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="recurrence">
              <Select placeholder="请选择周期" allowClear={true} style={{ width: 160 }}>
                {
                  recurrenceData.map(item=>
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button type="primary" onClick={search}>搜索</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row type="flex" justify="end">
        <Col span={2}>
          <Button type="danger"><Link to={"/patrol-plan-new"}>新建</Link></Button>
          </Col>
          <Col span={3}>
          <Dropdown overlay={menu}>
            <Button type="danger">更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col>
      </Row>

      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {x: 1600}) }

      <CycleModal
        visible={visible.showCycle}
        {...{recurrenceData, weekData, monthData, currentId, recurrence, handleCancel, setDirty}}
      />
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
    </div>
  );
}

const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location']),
  recurrenceData: state.getIn(['patrolPlan', 'recurrenceData']),
  weekData: state.getIn(['patrolPlan', 'weekData']),
  monthData: state.getIn(['patrolPlan', 'monthData'])
})

export default connect(mapStateToProps, null)(React.memo(PatrolPlan))
