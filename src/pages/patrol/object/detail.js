import React, { useState, useEffect } from 'react'
import '@ant-design/compatible/assets/index.css';
import {
  Breadcrumb,
  Button,
  Input,
  Select,
  Form,
  Row,
  Modal,
  Col,
  Tabs,
  Card,
  Table,
  message,
  InputNumber,
} from 'antd';
import { Link } from 'react-router-dom'
import { getProperties, getRobotPatrolLocs, getSuppliers,getVideoStream,getRobotObjectType,getObjectStatus } from './store/actionCreators'
import { robotObject, robotMaintain } from '../../../api'
import moment from "moment"
import { connect } from 'react-redux'
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

  const locationTree = props.location.toJS()
  const brands = props.brands.toJS()
  const { getPropertiesDispatch, getRobotPatrolLocsDispatch, getRobotObjectTypeDispatch,getObjectStatusDispatch,getVideoStreamDispatch,getSuppliersDispatch } = props
  const [form] = Form.useForm()
  const [obj,setObj] = useState([])
  const [robotMaintainList, setRobotMaintainList] = useState({
    isCompleteFalse: [],
    isCompleteTrue: []
  })
  const [maintainKey, setMaintainKey] = useState("isCompleteFalse")

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
        form.setFieldsValue({
          ...res,
          brand:res.brand?res.brand.id:res.brand,
          supplier:res.supplier?res.supplier.id:res.supplier,
          propertyName:res.propertyName?res.propertyName.id:res.propertyName,
          manufacturer:res.manufacturer?res.manufacturer.id:res.manufacturer,
          startDate:moment(res.startDate).format('YYYY-MM-DD'),
          endDate:moment(res.endDate).format('YYYY-MM-DD'),
          created:moment(res.created).format('YYYY-MM-DD'),
          updated:moment(res.updated).format('YYYY-MM-DD'),
          siteLine: res.site.slice(0, 4)
        })
        setObj({
          ...res,
          brand:res.brand?res.brand.id:res.brand,
          supplier:res.supplier?res.supplier.id:res.supplier,
          propertyName:res.propertyName?res.propertyName.id:res.propertyName,
          manufacturer:res.manufacturer?res.manufacturer.id:res.manufacturer,
          startDate:res.startDate?moment(res.startDate).format('YYYY-MM-DD'):res.startDate,
          endDate:res.endDate?moment(res.endDate).format('YYYY-MM-DD'):res.endDate,
          created:moment(res.created).format('YYYY-MM-DD'),
          updated:moment(res.updated).format('YYYY-MM-DD'),
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

  const properties = props.properties.toJS()
  const robotPatrolLocs = props.robotPatrolLocs.toJS()
  const robotObjectType = props.robotObjectType.toJS()
  const videoStream = props.videoStream.toJS()
  const suppliers = props.suppliers.toJS()
  useEffect(() => {
    getSuppliersDispatch()
    getPropertiesDispatch()
    getRobotPatrolLocsDispatch()
    getRobotObjectTypeDispatch()
    getObjectStatusDispatch()
    getVideoStreamDispatch()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //基本信息编辑保存
  const save = () => {
    form.validateFields()
    .then(values=>{
      if(props.match.params.id) {//编辑
        Modal.confirm({
          title: '确认提示',
          content: '是否确认修改？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: ()=> {
            let {siteLine,startDate,endDate,created,updated, ...data} = values
            let params = {
              ...data,
              _method:'PUT',
              org:'11'
          }
        robotObject.robotObjectEdit(props.match.params.id, params)
        .then((res)=>{
          message.success("保存成功")
          setObj({
            ...res, brand:res.brand.id,
            supplier:res.supplier?res.supplier.id:res.supplier,
            propertyName:res.propertyName?res.propertyName.id:res.propertyName,
            manufacturer:res.manufacturer?res.manufacturer.id:res.manufacturer,
            startDate:moment(res.startDate).format('YYYY-MM-DD'),
            endDate:res.endDate?moment(res.endDate).format('YYYY-MM-DD'):res.endDate,
            created:moment(res.created).format('YYYY-MM-DD'),
            updated:moment(res.updated).format('YYYY-MM-DD'),
            siteLine: res.site.slice(0, 4)
          })
          setEdit({...edit, basicEdit:false,attributeEdit:false,paramEdit:false,originalEdit:false})
        }).catch((err) =>{
          message.error("保存失败")
        })

          },
          onCancel() {
          },
        })
      }
    })
    .catch (errorInfo=>{
      return
    })
  }

  //取消编辑
  const basicCancel = () => {
    setEdit({...edit, basicEdit:false})
    form.setFieldsValue(obj)
  }

  //取消编辑
  const paramCancel = () => {
    setEdit({...edit, paramEdit:false})
    form.setFieldsValue(obj)
  }

    //取消编辑
    const attributeCancel = () => {
      setEdit({...edit, attributeEdit:false})
      form.setFieldsValue(obj)
    }

      //取消编辑
  const originalCancel = () => {
    setEdit({...edit, originalEdit:false})
    form.setFieldsValue(obj)
  }

  //新增
  const addMaintain = () => {
    setAddSingle(true)
    setTitle("添加维护记录")
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
          <Form form={form} {...formItemLayout}>
            <Row gutter={24}>
              <Col span={20}><h3>基础信息</h3></Col>
              {
                edit.basicEdit === false ?
                <Col span={4} align="right">
                  <Button type="link" onClick={()=>{ setEdit({...edit, basicEdit:true}) }}>编辑</Button>
                </Col>:
                <Col span={4} align="right">
                  <Button type="link" onClick={save}>保存</Button>
                  <Button type="link" onClick={basicCancel}>取消</Button>
                </Col>
              }
              <Col span={12}>
                <Form.Item label="设备名称" name="name">
                  <Input placeholder="请输入设备名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="线路" name="siteLine" rules={[{required: true, message: '请选择线路'}]}>
                  <Select placeholder="请选择线路" allowClear>
                    {locationTree.line && locationTree.line.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点" name="site" rules={[{required: true, message: '请选择站点'}]}>
                  <Select placeholder="请选择站点" allowClear>
                    {locationTree.site && locationTree.site.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="物理位置" name="robotPatrolLoc" rules={[{required: true, message: '请选择物理位置'}]}>
                  <Select placeholder="请选择物理位置" allowClear>
                    {robotPatrolLocs && robotPatrolLocs.length>0 && robotPatrolLocs.map(item => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.desc}
                    </Select.Option>
                  ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型" name="type" rules={[{required: true, message: '请选择类型'}]}>
                  <Select placeholder="请选择类型" allowClear>
                    {robotObjectType && robotObjectType.length>0 && robotObjectType.map(item => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
                  <Select placeholder="请选择品牌" allowClear>
                    {brands && brands.length > 0 && brands.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="供应商" name="supplier">
                  <Select placeholder="请选择供应商" allowClear>
                    {suppliers && suppliers.length>0 && suppliers.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))
                    }
                    </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制造商" name="manufacturer">
                  <Select placeholder="请选择制造商" allowClear>
                    {suppliers && suppliers.length>0 && suppliers.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                        )
                      )
                    }
                   </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="型号" name="modelNumber">
                    <Input placeholder="请输入型号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备描述" name="desc">
                  <Input.TextArea placeholder="请输入设备描述" />
                </Form.Item>
              </Col>
              {
                edit.basicEdit === false ?
                <>
                  <Col span={12}>
                    <Form.Item label="故障描述" name="faultDesc">
                      <Input disabled placeholder="请输入故障描述" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="启用时间" name="startDate">
                      <Input disabled placeholder="请输入启用时间" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="停用时间" name="endDate">
                      <Input disabled placeholder="请输入停用时间" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="创建时间" name="created">
                      <Input disabled placeholder="请输入启用时间" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="更新时间" name="updated">
                      <Input disabled placeholder="请输入停用时间" />
                    </Form.Item>
                  </Col>
                </> : null
              }

              <Col span={20}><h3>参数信息</h3></Col>
              {
                edit.paramEdit === false ?
                <Col span={4} align="right">
                  <Button type="link" onClick={()=>{ setEdit({...edit, paramEdit:true}) }}>编辑</Button>
                </Col>
                :
                <Col span={4} align="right">
                  <Button type="link" onClick={save}>保存</Button>
                  <Button type="link" onClick={paramCancel}>取消</Button>
                </Col>
              }
              <Col span={12}>
                <Form.Item label="体积(宽*深*高)(mm)" name="volume">
                    <InputNumber min={0} placeholder="请输入尺寸" style={{width:"85%"}}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总重(kg)" name="weight">
                  <InputNumber min={0} placeholder="请输入总重" style={{width:"85%"}}/>
                </Form.Item>
              </Col>
              <Col span={20}><h3>属性信息</h3></Col>
              {
                edit.attributeEdit === false ?
                <Col span={4} align="right">
                  <Button type="link" onClick={()=>{ setEdit({...edit, attributeEdit:true}) }}>编辑</Button>
                </Col>
                  :
                <Col span={4} align="right">
                  <Button type="link" onClick={save}>保存</Button>
                  <Button type="link" onClick={attributeCancel}>取消</Button>
                </Col>
              }
              <Col span={12}>
                <Form.Item label="属性名称" name="propertyName">
                  <Select
                  showSearch
                  filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请选择属性名称" allowClear>
                    {properties && properties.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.desc}
                        </Select.Option>
                        )
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总运行时长(小时)" name="runningTime">
                    <InputNumber min={0} placeholder="请输入总运行时长" style={{width:"85%"}}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="总运行里程(千米)" name="runningMileage">
                    <InputNumber min={0} placeholder="请输入总运行里程" style={{width:"85%"}}/>
                </Form.Item>
              </Col>
              <Col span={20}><h3>固定信息</h3></Col>
                {
                  edit.originalEdit === false ?
                  <Col span={4} align="right">
                    <Button type="link" onClick={()=>{ setEdit({...edit, originalEdit:true}) }}>编辑</Button>
                  </Col>
                   :
                  <Col span={4} align="right">
                    <Button type="link" onClick={save}>保存</Button>
                    <Button type="link" onClick={originalCancel}>取消</Button>
                 </Col>
                }
              <Col span={12}>
                <Form.Item label="通信标识" name="communication" rules={[{required: true, message: '请输入通信标识'}]}>
                  <Input placeholder="请输入通信标识" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="视频流程协议" name="videoStream" rules={[{required: true, message: '请选择视频流程协议'}]}>
                  <Select placeholder="请选择视频流程协议" allowClear>
                    {videoStream && videoStream.length>0 && videoStream.map(item => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
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

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location']),
    brands: state.getIn(['common', 'brands']),
    properties: state.getIn(['object', 'properties']),
    robotPatrolLocs: state.getIn(['object', 'robotPatrolLocs']),
    robotObjectType: state.getIn(['object', 'robotObjectType']),
    robotObjectStatus: state.getIn(['object', 'robotObjectStatus']),
    videoStream: state.getIn(['object', 'videoStream']),
    suppliers: state.getIn(['object', 'suppliers'])
  }
}

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getPropertiesDispatch() {
      dispatch(getProperties())
    },
    getSuppliersDispatch() {
      dispatch(getSuppliers())
    },
    getRobotPatrolLocsDispatch() {
      dispatch(getRobotPatrolLocs())
    },
    getRobotObjectTypeDispatch() {
      dispatch(getRobotObjectType())
    },
    getObjectStatusDispatch() {
      dispatch(getObjectStatus())
    },
    getVideoStreamDispatch() {
      dispatch(getVideoStream())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo((ObjectDetail)))
