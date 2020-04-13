import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import moment from "moment"
import { DownOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Cascader,
  Switch,
  Table,
  Menu,
  Dropdown,
  Pagination,
  Modal,
  message,
} from 'antd';
import CycleModal from './cycleModal'
import ImportModal from '../common/importModal'
import AuditModal from '../common/auditModal'
import { robotPlan } from '../../api'
import { connect } from 'react-redux'

const PatrolPlan = props => {
  const { getFieldDecorator } = props.form
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

  const handleCancel = () => {
    setVisible({
      showCycle: false,
      showDetail: false,
      showImport: false,
      showAudit: false
    })
  }

  //变更状态
  const showConfirm = (id, checked) => {
    Modal.confirm({
      title: `是否将该计划${checked==="APPR" ? '使用状态' : '停用状态'}变更为${checked==="APPR" ? '停用状态' : '使用状态'}？变更后，该巡检计划${checked==="APPR" ? '将会暂停' : '会按时进行巡检'}。`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        (() => {
          robotPlan.robotPlanStatus({id: id, patrolPlanStatus:checked})
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
    .then(res=>{
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
        if(props.locationTree.line.length>0) {
          const item = props.locationTree.line.find(obj=> obj.value === record.site.slice(0,4))
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
        const item = props.recurrenceData.find(obj=>obj.value === record.recurrence)
        return item.name
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

    setLoading(true)
    robotPlan.robotPlanList()
    .then(res => {
      if(res){
        setData(res)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  }, [dirty])

  return (
    <div>
      <Form layout="inline" style={{margin: 30}}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('desc')(<Input placeholder="请输入计划名称" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('createdbyFullname')(<Input placeholder="请输入计划创建人姓名" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('peopleName')(<Input placeholder="请输入计划巡检人姓名" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('site')(<Cascader options={props.locationTree.lineSite} placeholder="请选择线路/站点" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('recurrence')(
                <Select placeholder="请选择周期" style={{ width: 160 }}>
                  {
                    props.recurrenceData.map(item=>
                      <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                    )
                  }
                </Select>
              )}
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
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

      <Table loading={loading} rowKey="id" columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="end"><Pagination total={20} showSizeChanger showQuickJumper style={{margin:30}}/></Row>

      <CycleModal
        visible={visible.showCycle}
        recurrenceData={props.recurrenceData}
        weekData={props.weekData}
        monthData={props.monthData}
        {...{currentId, recurrence, handleCancel, setDirty}}
      />
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    recurrenceData: state.recurrenceData,
    weekData: state.weekData,
    monthData: state.monthData,
    locationTree: state.locationTree,
    robotPatrolPlanType: state.robotPatrolPlanType
  }
}
export default connect(mapStateToProps, null)(React.memo(Form.create()(PatrolPlan)))
