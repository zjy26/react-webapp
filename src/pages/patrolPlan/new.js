import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Breadcrumb,
  Button,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
  Tabs,
  Table,
} from 'antd';
import { connect } from 'react-redux'
import AddObjModal from '../common/addObjModal'
import styles from './PatrolPlan.module.scss'

const { TabPane } = Tabs
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 22, offset: 2 },
  },
}
const patrolItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  }
}

let id = 0
const NewPatrolPlan = (props) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form
  const [activeKey, setActiveKey] = useState("bascInfo")  //设置显示tab
  const [obj, setObj] = useState({})
  const [recValue, setRecValue] = useState(null)
  const [robotObjList, setRobotObjList] = useState([])
  const [visible, setVisible] = useState({  //弹窗
    showAddObj: false,
  })

  useEffect(() => {
    document.title = "新建巡检计划"
    setObj({})
  }, [])

  const handleCancel = ()=>{
    setVisible({
      showAddObj: false
    })
  }

  //选择周期
  const selectRec = (value) => {
    setRecValue(value)
    setFieldsValue({
      startTime: '',
      endTime: '',
      runTime: '',
      dow: '',
      dom: '',
      keys: []
    })
  }

  //删除巡检时间
  const remove = k => {
    const keys = getFieldValue('keys');
    if (keys.length === 1) {
      return
    }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  //增加巡检时间
  const add = () => {
    const keys = getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    setFieldsValue({
      keys: nextKeys,
    })
  }

  getFieldDecorator('keys', { initialValue: [] })
  const keys = getFieldValue('keys');
  const patrolTimeItems = keys.map((k, index) => (
    <Col span={24} key={k}><Form.Item
      {...(index === 0 ? patrolItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? '巡检时间' : ''}
      required={false}
    >
      {getFieldDecorator(`patrolTime[${k}]`)(
        <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" />
      )}
      {keys.length > 1 ? (
        <MinusCircleOutlined className={styles.dynamicBtn} onClick={() => remove(k)} />
      ) : null}
    </Form.Item></Col>
  ))

  let formItem = null
  switch (recValue) {
    case 2:
      formItem = <Col span={12}><Form.Item label="开始时间">
        {getFieldDecorator('startTime')(
          <DatePicker showTime placeholder="请选择开始时间" />
        )}
      </Form.Item></Col>
      break;
    case 3:
      formItem = <div>
        <Col span={12}><Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item></Col>
      </div>
      break;
    case 4:
      formItem = <div>
        <Col span={12}><Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item></Col>
        {patrolTimeItems}
        <Col span={24}><Form.Item>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <PlusOutlined />增加巡检时间
          </Button>
        </Form.Item></Col>
      </div>
      break;
    case 5:
      formItem = <div>
        <Col span={12}><Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="星期">
          {getFieldDecorator('dow')(
            <Select
              mode="multiple"
              placeholder="请选择星期"
              style={{ width: '70%' }}
            >
              {props.weekData.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item></Col>
        {patrolTimeItems}
        <Col span={24}><Form.Item>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <PlusOutlined />增加巡检时间
          </Button>
        </Form.Item></Col>
      </div>
      break;
    case 6:
      formItem = <div>
        <Col span={12}><Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item></Col>
        <Col span={12}><Form.Item label="日期">
          {getFieldDecorator('dom')(
            <Select
              mode="multiple"
              placeholder="请选择日期"
              style={{ width: '70%' }}
            >
              {props.monthData.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item></Col>
        {patrolTimeItems}
        <Col span={24}><Form.Item>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <PlusOutlined />增加巡检时间
          </Button>
        </Form.Item></Col>
      </div>
      break;
    default:
      formItem = null
  }

  const objCols = [
    { title: '房间位置', dataIndex: 'robotPatrolLoc', key: 'robotPatrolLoc' },
    { title: '设备名称', dataIndex: 'object', key: 'object' },
    { title: '抽屉', dataIndex: 'drawer', key: 'drawer' },
    { title: '杂散', dataIndex: 'stray', key: 'stray' },
    { title: '操作', key: 'operation',
      render: () => <span>
        <Button type="link" size={'small'}>编辑</Button>&nbsp;&nbsp;
        <Button type="link" size={'small'}>删除</Button>
      </span>
    },
  ]

  const expandedRowRender = (record) => {
    const columns = [
      { title: '属性', dataIndex: 'property', key: 'property' },
      { title: '正常值', dataIndex: 'normalValue', key: 'normalValue' },
      { title: '类型', dataIndex: 'resultType', key: 'resultType'}
    ];

    const data = record.robotPlanItems
    return <Table rowKey="objMeter" columns={columns} dataSource={data} pagination={false} />
  }

  const table = robotObjList.length>0 ? <Table
    rowKey="object"
    columns={objCols}
    expandedRowRender={expandedRowRender}
    dataSource={robotObjList}
    style={{marginTop: 20}}
    pagination={false}
  /> : null

  return (
    <div>
      <Breadcrumb style={{margin: 30, fontSize: 20}}>
        <Breadcrumb.Item><Link to="/patrol-plan">巡检计划</Link></Breadcrumb.Item>
        <Breadcrumb.Item>新建</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}}>
        <TabPane tab="基本信息" key="bascInfo">
          <Form {...formItemLayout} >
              <Row gutter={24}>
                <Col span={24}>
                  <label style={{fontSize:18, marginRight:20}}>基本信息</label>
                </Col>
                <Col span={12}>
                  <Form.Item label="计划名称">
                    {getFieldDecorator("patrolName", {
                      initialValue: obj.patrolName,
                      rules: [{required: true,}],
                    })(<Input placeholder="请输入计划名称" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="线路">
                    {getFieldDecorator("line", {
                      initialValue: obj.line,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选择线路" >
                        {props.locationTree.line && props.locationTree.line.map(item =>
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点">
                    {getFieldDecorator("site", {
                      initialValue: obj.site,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选择站点" >
                        {props.locationTree.site && props.locationTree.site.map(item =>
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        )}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="负责人">
                    {getFieldDecorator("people", {
                      initialValue: obj.patrolPeople,
                      rules: [{required: true}],
                    })(
                      <Input placeholder="请输入负责人姓名" />
                    )}
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <label style={{fontSize:18, marginRight:20}}>计划周期</label>
                </Col>
                <Col span={12}>
                  <Form.Item label="周期">
                    {getFieldDecorator('recurrence', {
                      initialValue: obj.cycle,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选选周期"
                        onChange={selectRec}
                      >
                        {
                          props.recurrenceData.map(item =>
                            <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                          )
                        }
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {formItem}
              </Row>
            </Form>
            <Row type="flex" justify="end">
              <Col span={2}><Button onClick={props.handleCancel}><Link to="/patrol-plan">取消</Link></Button></Col>
              <Col span={2}><Button type="danger" onClick={()=>{setActiveKey("objectInfo")}}>下一步</Button></Col>
            </Row>
        </TabPane>
        <TabPane tab="设备信息" key="objectInfo">
          <Row>
            <Col span={4}><label style={{fontSize:18, marginRight:20}}>设备信息</label></Col>
            <Col span={2}><Button onClick={()=>setVisible({...visible, showAddObj:true})}>新增</Button></Col>
          </Row>
          {table}
        </TabPane>
      </Tabs>
      <AddObjModal visible={visible.showAddObj} site={getFieldValue("site")} {...{setRobotObjList, handleCancel}}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree,
    recurrenceData: state.recurrenceData,
    weekData: state.weekData,
    monthData: state.monthData,
  }
}

export default connect(mapStateToProps, null)(React.memo(Form.create()(NewPatrolPlan)))
