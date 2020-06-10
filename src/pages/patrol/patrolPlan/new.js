import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Button,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
  Tabs,
  Table,
  message,
} from 'antd';
import moment from "moment"
import { connect } from 'react-redux'
import { robotPlan } from '../../../api'
import AddObjModal from '../../common/addObjModal'
import AddPatrolItemModal from '../../common/addPatrolItemModal'

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
    xs: { span: 22, offset: 2 },
    sm: { span: 20, offset: 4 },
  },
}

const NewPatrolPlan = (props) => {
  const locationTree = props.location.toJS()
  const recurrenceData = props.recurrenceData.toJS()
  const weekData = props.weekData.toJS()
  const monthData = props.monthData.toJS()

  const [form] = Form.useForm()
  const [activeKey, setActiveKey] = useState("bascInfo")  //设置显示tab
  const [siteValue, setSiteValue] = useState(null)
  const [siteOption, setSiteOption] = useState([])  //站点选择
  const [recValue, setRecValue] = useState(null)
  const [robotObjList, setRobotObjList] = useState([])  //设备信息主记录
  const [robotObjRecord, setRobotObjRecord] = useState({})  //设备信息单条主记录
  const [patrolItemData, setPatrolItemData] = useState([])  //设备信息巡检项
  const [visible, setVisible] = useState({  //弹窗
    showAddObj: false,
    showAddPatrolItem: false
  })

  useEffect(() => {
    document.title = "新建巡检计划"
    robotPlan.robotPlanNew()
    .then((res)=>{
      form.setFieldsValue({...res, dow:[], dom:[]})
    })
  }, [form])

  const handleCancel = ()=>{
    setVisible({
      showAddObj: false,
      showAddPatrolItem: false
    })
  }

  //选择周期
  const selectRec = (value) => {
    setRecValue(value)
    form.resetFields(["startTime", "endTime", "runTime", "dom", "dow", "patrolTime"])
  }

  let formItem = null
  switch (recValue) {
    case 2:
      formItem = <Col span={12}>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
      </Col>
      break;
    case 3:
      formItem = <>
        <Col span={12}>
          <Form.Item label="开始时间" name="startTime">
            <DatePicker showTime placeholder="请选择开始时间" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="结束时间" name="endTime">
            <DatePicker showTime placeholder="请选择结束时间" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="启动时间" name="runTime">
            <TimePicker placeholder="请选择启动时间" />
          </Form.Item>
        </Col>
      </>
      break;
    case 4:
      formItem = <>
      <Col span={12}>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
      </Col>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <Col span={12}>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" style={{width:"70%"}}/>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </Col>
            )
          }}
        </Form.List>
      </>
      break;
    case 5:
      formItem = <>
      <Col span={12}>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="星期" name="dow">
          <Select
            mode="multiple"
            placeholder="请选择星期"
          >
            {weekData.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <Col span={12}>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" style={{width:"70%"}}/>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </Col>
            )
          }}
        </Form.List>
      </>
      break;
    case 6:
      formItem = <>
        <Col span={12}>
          <Form.Item label="开始时间" name="startTime" >
            <DatePicker showTime placeholder="请选择开始时间" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="结束时间" name="endTime">
            <DatePicker showTime placeholder="请选择结束时间" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="启动时间" name="runTime">
            <TimePicker placeholder="请选择启动时间" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="日期" name="dom">
            <Select
              mode="multiple"
              placeholder="请选择日期"
            >
              {monthData.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <Col span={12}>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" style={{width:"70%"}}/>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </Col>
            )
          }}
        </Form.List>
      </>
      break;
    default:
      formItem = null
  }

  const addPatrolItem = record => {
    setRobotObjRecord(record)
    setVisible({
      ...visible,
      showAddPatrolItem: true
    })

  }

  //设备信息表格
  const objCols = [
    { title: '房间位置', dataIndex: 'robotPatrolLoc', key: 'robotPatrolLoc', render: record=>record.desc},
    { title: '设备名称', dataIndex: 'object', key: 'object', render: record=>record.desc},
    { title: '抽屉', dataIndex: 'drawer', key: 'drawer', render: record=>record.drawerName },
    { title: '杂散', dataIndex: 'stray', key: 'stray', render: record=>record.descr },
    { title: '操作', key: 'operation',
      render: (record) => <span>
        <Button type="link" size={'small'}>编辑</Button>&nbsp;&nbsp;
        <Button type="link" size={'small'}>删除</Button>
        <Button type="link" size={'small'} onClick={()=>addPatrolItem(record)}>新增巡检项</Button>
      </span>
    },
  ]

  const expandedRowRender = (record) => {
    const columns = [
      { title: '属性', dataIndex: 'property', key: 'property', render: record=>record.desc },
      { title: '监测点类型', dataIndex: 'resultType', key: 'resultType' },
      { title: '报警上限', dataIndex: 'alarmMinValue', key: 'alarmMinValue'},
      { title: '报警下限', dataIndex: 'alarmMaxValue', key: 'alarmMaxValue'},
      { title: '正常值', dataIndex: 'normalValue', key: 'normalValue'},
      { title: '正常值描述', dataIndex: 'normalValueDesc', key: 'normalValueDesc'},
      { title: '操作',  key: 'operation',
        render: () => <span>
          <Button type="link" size={'small'}>编辑</Button>&nbsp;&nbsp;
          <Button type="link" size={'small'}>删除</Button>
        </span>
        }
    ];

    setPatrolItemData(record.robotPlanItems)
    return <Table rowKey="objMeter" columns={columns} dataSource={patrolItemData} pagination={false} />
  }

  const  robotObjTable = robotObjList.length>0 ? <Table
    rowKey="object"
    columns={objCols}
    expandedRowRender={expandedRowRender}
    dataSource={robotObjList}
    style={{marginTop: 20}}
    pagination={false}
  /> : null

  //下一步
  const handleNext = () => {
    form.validateFields()
    .then(()=> {
      setActiveKey("objectInfo")
    })
  }

  //新建巡检计划（确定）
  const handleAdd = () => {
    form.validateFields()
    .then(values=> {
      console.log(values)
      const patrolArr = values.patrolTime&&values.patrolTime.map(item=> item ? moment(item).format('HH:mm') : null)
      const params = {
        ...values,
        startTime: values.startTime ? moment(values.startTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        endTime: values.endTime ? moment(values.endTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        runTime: values.runTime ? moment(values.runTime).format('HH:mm:ss') : null,
        dom: values.dom ? values.dom.toString() : null,
        dow: values.dow ? values.dow.toString() : null,
        patrolTime: patrolArr ? patrolArr : null
      }
      console.log(params)
      robotPlan.robotPlanAdd(params)
      .then(res=>{
        message.success("巡检计划新建成功")
      })
      .catch(err=>{
        console.log("新建巡检计划失败")
      })
    })
    .catch(()=>console.log("新建巡检计划失败"))
  }

  return (
    <div>
      <Button><Link to="/patrol-plan">返回</Link></Button>
      <Tabs tabPosition="left"
        activeKey={activeKey}
        style={{margin:30}}
        onChange={(key)=>{
          if(key==="objectInfo") {
            form.validateFields()
            .then(()=>{
              setActiveKey(key)
            })
          } else {
            setActiveKey(key)
          }
        }}
      >
        <TabPane tab="基本信息" key="bascInfo">
          <Form form={form} {...formItemLayout}>
            <Row gutter={24}>
              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>基本信息</label>
              </Col>
              <Col span={12}>
                <Form.Item label="计划名称" name="patrolName" rules={[{required: true, message: '请输入计划名称'}]}>
                  <Input placeholder="请输入计划名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="线路" name="line">
                  <Select placeholder="请选择线路"
                    onChange={
                      (value) => {
                        locationTree.lineSite && locationTree.lineSite.forEach(item=>{
                          if(item.value === value) {
                            setSiteOption(item.children)
                            form.setFieldsValue({"site":null})
                            setSiteValue(null)
                          }
                        })
                      }
                    }
                  >
                    {locationTree.line && locationTree.line.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点" name="site">
                  <Select placeholder="请选择站点" onChange={value=>setSiteValue(value)}>
                    {
                      siteOption.length>0 && siteOption.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="负责人" name="people">
                  <Input placeholder="请输入负责人姓名" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>计划周期</label>
              </Col>
              <Col span={12}>
                <Form.Item label="周期" name="recurrence">
                  <Select placeholder="请选择周期"
                    onChange={selectRec}
                  >
                    {
                      recurrenceData.map(item =>
                        <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              {formItem}
            </Row>
            <Row type="flex" justify="end">
              <Col span={2}><Button><Link to="/patrol-plan">取消</Link></Button></Col>
              <Col span={2}>
                <Button type="danger" onClick={handleNext}>下一步</Button>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="设备信息" key="objectInfo">
          <Row>
            <Col span={3}><label style={{fontSize:18, marginRight:20}}>设备信息</label></Col>
            <Col span={2}><Button onClick={()=>setVisible({...visible, showAddObj:true})}>新增</Button></Col>
          </Row>
          {robotObjTable}
          <Row type="flex" justify="end">
            <Col span={2}><Button><Link to="/patrol-plan">取消</Link></Button></Col>
            <Col span={2}><Button type="danger" onClick={handleAdd}>确定</Button></Col>
          </Row>
        </TabPane>
      </Tabs>
      <AddObjModal visible={visible.showAddObj} site={siteValue} {...{setRobotObjList,handleCancel}}/>
      <AddPatrolItemModal visible={visible.showAddPatrolItem} {...{robotObjRecord, setPatrolItemData, setRobotObjList, handleCancel}} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location']),
  recurrenceData: state.getIn(['patrolPlan', 'recurrenceData']),
  weekData: state.getIn(['patrolPlan', 'weekData']),
  monthData: state.getIn(['patrolPlan', 'monthData'])
})

export default connect(mapStateToProps, null)(React.memo(NewPatrolPlan))
