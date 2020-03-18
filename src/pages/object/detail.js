import React, { useState, useEffect } from 'react'
import {Breadcrumb, Form, Button, Input, Select, Row, Col, Tabs, Card, Table, message } from 'antd'
import { Link } from 'react-router-dom'
import { robotObject, robotMaintain } from '../../api'
import moment from "moment"
import store from '../../store'
import AddRecordModal from './addRecordModal'

const { TabPane } = Tabs
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const ObjectDetail = (props) => {

  const [edit, setEdit] = useState({
    basicEdit: false,
    attributeEdit: false,
    paramEdit: false,
    originalEdit: false
  })
  const { getFieldDecorator, validateFields, resetFields } = props.form
  const [robotMaintainList, setRobotMaintainList] = useState({
    isCompleteFalse: [],
    isCompleteTrue: []
  })
  const [maintainKey, setMaintainKey] = useState("isCompleteFalse")

  const [obj, setObj] = useState({})
  const [addSingle, setAddSingle] = useState(false)
  const [currentId, setCurrentId] = useState(0)
  const [dirty, setDirty] = useState(0)
  const [title, setTitle] = useState("新建维护记录")

  const [visible, setVisible] = useState({
    showAddRecord: false
  })

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '线路',
      dataIndex: 'siteLine',
      key: 'siteLine',
    },
    {
      title: '站点',
      dataIndex: 'siteStation',
      key: 'siteStation',
    },
    {
      title: '开始时间',
      key: 'startDate',
      dataIndex: 'startDate',
      render: (text, record) => moment(record.startDate).format('YYYY-MM-DD')
    },
    {
      title: '完成时间',
      key: 'endDate',
      dataIndex: 'endDate',
      render: (text, record) => moment(record.endDate).format('YYYY-MM-DD')
    },
    {
      title: '停机时长',
      key: 'stopTIme',
      dataIndex: 'stopTIme'
    },
    {
      title: '处理人员',
      key: 'executor',
      dataIndex: 'executor'
    },
    {
      title: '维护描述',
      key: 'maintenance',
      dataIndex: 'maintenance'
    },
    {
      title: '处理方案',
      key: 'dispose',
      dataIndex: 'dispose'
    }
  ]

  const waitCols = []
  waitCols.push(...columns, {
    title: '操作',
    key: 'option',
    render: (text, record) => <span>
      <Button type="link" size={'small'} onClick={()=>{maintainCompleted(record.id)}}>维护完成</Button>&nbsp;&nbsp;
      <Button type="link" size={'small'} onClick={()=>{editMaintain(record.id)}}>编辑</Button>
    </span>
  })

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showAddRecord: false
    });
  }

  useEffect(() => {
    document.title = "查看详情"

    //查看详情
    robotObject.robotObjectDetail(props.match.params.id).then((res) =>{
      if(res){
        setCurrentId(res.id)
        setObj({
          ...res,
          brand: res.brand.id,
          siteLine: res.site.slice(0, 4)
        })
      }
    })

    //待维护记录
    robotMaintain.robotMaintainList("false", props.match.params.id)
    .then((res)=>{
      setRobotMaintainList({
        ...robotMaintainList,
        isCompleteFalse: res.models
      })
    }).catch((err) =>{
        console.log("待维护记录获取失败")
    })

    //已维护记录
    robotMaintain.robotMaintainList("true", props.match.params.id)
    .then((res)=>{
      setRobotMaintainList({
        ...robotMaintainList,
        isCompleteTrue: res.models
      })
    }).catch((err) =>{
        console.log("已维护记录获取失败")
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.id, dirty]);

  //基本信息编辑保存
  const save = ()=> {
    validateFields((err, values) => {
      if (!err) {
        let {siteLine, ...data} = values
        let params = {
          ...data,
          ...obj,
          volume:values.volume.substring(0, values.volume.length - 2),
          weight:values.weight.substring(0, values.weight.length - 2),
          runningTime:values.runningTime.substring(0, values.runningTime.length - 2),
          runningMileage:values.runningMileage.substring(0, values.runningMileage.length - 2),
        }
        robotObject.robotObjectEdit(props.match.params.id, params)
        .then((res)=>{
          message.success("保存成功")
          setEdit({...edit, basicEdit:false})
        }).catch((err) =>{
          message.error("保存失败")
        })
      }
    })
  }

  //取消编辑
  const cancel = () => {
    setEdit({...edit, basicEdit:false})
    resetFields()
  }

  //新增
  const addMaintain = () => {
    setAddSingle(true)
    setTitle("新建维护记录")
    setVisible({...visible, showAddRecord:true})
  }

  //编辑维护记录
  const editMaintain = (id)=> {
    setCurrentId(id)
    setAddSingle(true)
    setTitle("编辑维护记录")
    setVisible({...visible, showAddRecord:true})
  }

  //维护完成
  const maintainCompleted = (id) => {
    robotMaintain.robotMaintainComplete({id: id})
    .then((res)=>{
      message.success("维护完成")
      setDirty((dirty)=>dirty+1)
    })
    .catch(()=>{
      message.error("维护失败")
    })
  }

  const tabChange = (key) => {
    if(key === "isCompleteTrue") {
      setMaintainKey("isCompleteTrue")
    } else {
      setMaintainKey("isCompleteFalse")
    }
  }
  return (
    <div>
      <Breadcrumb style={{margin: 30, fontSize: 20}}>
        <Breadcrumb.Item><Link to="/patrol-object">设备管理</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs tabPosition="left" defaultActiveKey="bascInfo">
        <TabPane tab="基本信息" key="bascInfo">
          <Form {...formItemLayout} >
            <Row gutter={24}>
              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>基本信息</label>
                {
                  edit.basicEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost onClick={save}>保存</Button>
                    <Button type="primary" ghost onClick={cancel}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="设备名称">
                  {getFieldDecorator("name", {
                    initialValue: obj.name,
                    rules: [{required: true}],
                  })(<Input placeholder="请输入设备名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="线路">
                  {getFieldDecorator("siteLine", {
                    initialValue: obj.siteLine,
                    rules: [{required: true}],
                  })(
                    <Select placeholder="请选择线路">
                      {store.getState().locationTree.line && store.getState().locationTree.line.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                  </Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点">
                  {getFieldDecorator("site", {
                    initialValue: obj.site,
                    rules: [{required: true}],
                  })(
                    <Select placeholder="请选择站点">
                      {store.getState().locationTree.site && store.getState().locationTree.site.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="物理位置">
                  {getFieldDecorator("robotPatrolLoc", {
                    initialValue: obj.robotPatrolLoc,
                    rules: [{required: true}],
                  })(
                    <Input placeholder="请输入物理位置" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型">
                  {getFieldDecorator("type", {
                    initialValue: obj.type,
                    rules: [{required: true}],
                  })(
                    <Select placeholder="请选择类型">
                      {store.getState().robotObjectType &&store.getState().robotObjectType.map(item => (
                        <Select.Option key={item.code} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌">
                  {getFieldDecorator("brand", {
                    initialValue: obj.brand,
                    rules: [{required: true}],
                  })(
                    <Select placeholder="请选择品牌">
                      {store.getState().brands && store.getState().brands.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="供应商">
                  {getFieldDecorator("supplier", {
                    initialValue: obj.supplier,
                  })(
                    <Input placeholder="请输入供应商" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制造商">
                  {getFieldDecorator("manufacturer", {
                    initialValue: obj.manufacturer,
                  })(
                    <Input placeholder="请输入制造商" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="型号">
                  {getFieldDecorator("modelNumber", {
                    initialValue: obj.modelNumber,
                  })(
                    <Input placeholder="请输入型号" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备描述">
                  {getFieldDecorator("desc", {
                    initialValue: obj.desc,
                  })(
                    <Input.TextArea placeholder="请输入设备描述" />
                  )}
                </Form.Item>
              </Col>
              {
                edit.basicEdit === false ?
                <div>
                  <Col span={12}>
                    <Form.Item label="故障描述">
                      {getFieldDecorator("faultDesc", {
                        initialValue: obj.faultDesc,
                      })(
                        <Input.TextArea placeholder="请输入故障描述" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="启用时间">
                      {getFieldDecorator("startDate", {
                        initialValue: moment(obj.startDate).format('YYYY-MM-DD'),
                      })(
                        <Input placeholder="请输入启用时间" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="停用时间">
                      {getFieldDecorator("endDate", {
                        initialValue: moment(obj.endDate).format('YYYY-MM-DD'),
                      })(
                        <Input placeholder="请输入停用时间" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="创建时间">
                      {getFieldDecorator("created", {
                        initialValue: moment(obj.created).format('YYYY-MM-DD'),
                      })(
                        <Input placeholder="请输入启用时间" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="更新时间">
                      {getFieldDecorator("updated", {
                        initialValue: moment(obj.updated).format('YYYY-MM-DD'),
                      })(
                        <Input placeholder="请输入停用时间" />
                      )}
                    </Form.Item>
                  </Col>
                </div> : null
              }

              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>参数信息</label>
                {
                  edit.paramEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, paramEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost onClick={save}>保存</Button>
                    <Button type="primary" ghost onClick={cancel}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="体积(宽*深*高)">
                  {getFieldDecorator("volume", {
                    initialValue: `${obj.volume}mm`,
                  })(
                    <Input placeholder="请输入尺寸" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总重">
                  {getFieldDecorator("weight", {
                    initialValue: `${obj.weight}kg`,
                  })(
                    <Input placeholder="请输入总重" />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>属性信息</label>
                {
                  edit.attributeEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, attributeEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost onClick={save}>保存</Button>
                    <Button type="primary" ghost onClick={cancel}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="属性名称">
                  {getFieldDecorator("propertyName", {
                    initialValue: obj.propertyName,
                  })(
                    <Input placeholder="请输入属性名称" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总运行时长">
                  {getFieldDecorator("runningTime", {
                    initialValue: `${obj.runningTime} 小时`,
                  })(
                    <Input placeholder="请输入总运行时长" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总运行里程">
                  {getFieldDecorator("runningMileage", {
                    initialValue: `${obj.runningMileage} 千米`,
                  })(
                    <Input placeholder="请输入总运行里程" />
                  )}
                </Form.Item>
              </Col>

              <Col span={24}>
                <label style={{fontSize:18, marginRight:20}}>固定信息</label>
                {
                  edit.originalEdit === false ?
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, originalEdit:true}) }}>编辑</Button> :
                  <span>
                    <Button type="primary" ghost onClick={save}>保存</Button>
                    <Button type="primary" ghost onClick={cancel}>取消</Button>
                  </span>
                }
              </Col>
              <Col span={12}>
                <Form.Item label="通信标识">
                  {getFieldDecorator("communication", {
                    initialValue: obj.communication,
                    rules: [{required: true}],
                  })(
                    <Input placeholder="请输入通信标识" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="视频流程协议">
                  {getFieldDecorator("videoStream", {
                    initialValue: obj.videoStream,
                    rules: [{required: true}],
                  })(
                    <Select placeholder="请选择视频流程协议">
                      {store.getState().videoStream && store.getState().videoStream.map(item => (
                        <Select.Option key={item.code} value={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </TabPane>
        <TabPane tab="维护信息" key="maintainInfo">
          <Tabs type="card" defaultActiveKey="isCompleteFalse"  onChange={tabChange} tabBarExtraContent={maintainKey==="isCompleteFalse" ? <Button onClick={addMaintain}>新增</Button> : ''}>
            <TabPane tab={`待维护`+ robotMaintainList.isCompleteFalse.length} key="isCompleteFalse">
              {
                robotMaintainList.isCompleteFalse.map((item, i) => {
                  return (
                    <Card key={i}>
                      <Table rowKey="id" columns={waitCols} dataSource={[item]} pagination={false}/>
                      <Row type="flex" justify="end">
                        <Col span={3}>
                          <label>负责人：</label>
                          <label>{item.principal}</label>
                        </Col>
                        <Col span={5}>
                          <label>创建时间：</label>
                          <label>{moment(item.created).format('YYYY-MM-DD')}</label>
                        </Col>
                        <Col span={5}>
                          <label>更新时间：</label>
                          <label>{moment(item.updated).format('YYYY-MM-DD')}</label>
                        </Col>
                      </Row>
                    </Card>
                  )
                })
              }
            </TabPane>
            <TabPane tab={`已维护`+ robotMaintainList.isCompleteTrue.length} key="isCompleteTrue">
              {
                robotMaintainList.isCompleteTrue.map((item, i) => {
                  return (
                    <Card key={i}>
                      <Table rowKey="id" columns={columns} dataSource={[item]} pagination={false}/>
                      <Row type="flex" justify="end">
                        <Col span={3}>
                          <label>负责人：</label>
                          <label>{item.principal}</label>
                        </Col>
                        <Col span={5}>
                          <label>创建时间：</label>
                          <label>{moment(item.created).format('YYYY-MM-DD')}</label>
                        </Col>
                        <Col span={5}>
                          <label>更新时间：</label>
                          <label>{moment(item.updated).format('YYYY-MM-DD')}</label>
                        </Col>
                      </Row>
                    </Card>
                  )
                })
              }
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
      <AddRecordModal visible={visible.showAddRecord} {...{currentId, title, addSingle, handleCancel, setDirty}}/>
    </div>
  )
}

export default Form.create()(ObjectDetail);
