import React, { useState, useEffect } from 'react'
import moment from "moment"
import { Link } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';

import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Cascader,
  DatePicker,
  InputNumber,
  Table,
  Checkbox,
  Tag,
  Menu,
  Dropdown,
  Pagination,
  message,
} from 'antd';
import { robotObject, robotMaintain } from '../../../api'
import AddModal from './addModal'
import ImportModal from '../../common/importModal'
import AuditModal from '../../common/auditModal'
import { getProperties, getRobotPatrolLocs, getSuppliers,getVideoStream,getRobotObjectType,getObjectStatus } from './store/actionCreators'
import AddRecordModal from './addRecordModal'
import ChangeStatusModal from './changeStatusModal'
import EditModal from './editModal'
import { connect } from 'react-redux'
import commonStyles from '../../Common.module.scss'

const { CheckableTag } = Tag
const ObjectModule = props => {
  const locationTree = props.location.toJS()
  const brands = props.brands.toJS()
  const [form] = Form.useForm()
  const [isChecked, setChecked] = useState(false)//是否全选
  const [currentId, setCurrentId] = useState(0)
  const [selectedCodes, setSelectedCodes] = useState([]);//已选择的codes
  const [filter, setFilter] = useState(null)
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [data, setData] = useState([])  //列表数据
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [tagChecked, setTagChecked] = useState({  //筛选标签选择状态
    all: true,
    free: true,
    patrol: true,
    control: true,
    maintenance: true,
    fault: true,
    stop: true
  })
  const [time, setTime] = useState(null);  //维护时间间隔
  const [mile, setMile] = useState(null);  //维护里程间隔
  const [maintainTimeValue, setMaintainTimeValue] = useState({
    minTime: 0,
    maxTime: 0,
    middle: 0
  });
  const [actualMileage, setActualMileage] = useState({
    minMileage: 0,
    maxMileage: 0,
    middle: 0
  });
  const [visible, setVisible] = useState({  //弹窗
    showAdd: false,
    showImport: false,
    showAudit: false,
    showAddRecord: false,
    showChangeStatus: false,
    showEdit: false
  })
  const [dirty, setDirty] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addSingle, setAddSingle] = useState(false)
  const { getPropertiesDispatch, getRobotPatrolLocsDispatch, getRobotObjectTypeDispatch,getObjectStatusDispatch,getVideoStreamDispatch,getSuppliersDispatch } = props
  const properties = props.properties.toJS()
  const robotPatrolLocs = props.robotPatrolLocs.toJS()
  const robotObjectType = props.robotObjectType.toJS()
  const robotObjectStatus = props.robotObjectStatus.toJS()
  const videoStream = props.videoStream.toJS()
  const suppliers = props.suppliers.toJS()
  useEffect(() => {
    getPropertiesDispatch()
    getRobotPatrolLocsDispatch()
    getRobotObjectTypeDispatch()
    getObjectStatusDispatch()
    getVideoStreamDispatch()
    getSuppliersDispatch()
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPropertiesDispatch, getRobotObjectTypeDispatch, getRobotObjectTypeDispatch,getObjectStatusDispatch,getVideoStreamDispatch,getSuppliersDispatch])

 //列表逐条数据选择
 const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    setSelectedCodes(selectedRowKeys);
    if(selectedRowKeys && selectedRowKeys.length === allCodes.length){//全选了
      setChecked(true);
    }else{
      setChecked(false)
    }
  },
  selectedRowKeys:selectedCodes
}

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showAdd: false,
      showImport: false,
      showAudit: false,
      showAddRecord: false,
      showChangeStatus: false,
      showEdit: false
    });
  }

  //新建
  const newModal = () => {
    setCurrentId(0)
    setVisible({...visible, showAdd: true});
  }

  //维护完成
  const maintainCompleted = () => {
    if(selectedCodes.length>0) {
      robotMaintain.robotObjectMaintainComplete({id: selectedCodes.toString()})
      .then((res)=>{
        message.success("维护完成")
      })
      .catch(()=>{
        message.error("维护失败")
      })
    } else {
      message.warning("请选择维护设备")
    }
  }

  //添加维护记录
  const addMaintain = (id)=>{
    setCurrentId(id)
    setAddSingle(true)
    setVisible({...visible, showAddRecord:true})
  }

  //批量添加维护记录
  const addBatchMaintain = ()=>{
    if(selectedCodes.length>0) {
      setAddSingle(false)
      setVisible({...visible, showAddRecord:true})
    } else {
      message.warning("请选择维护设备记录")
    }
  }

  //更多功能按钮
  const menu = (
    <Menu>
      <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})} }>信息导入</Menu.Item>
      <Menu.Item key="download">下载</Menu.Item>
      <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})} }>审计</Menu.Item>
    </Menu>
  );

  //列表条目
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          record.robotStatus ==="维护中" ?
          <Link to={"/patrol-object-detail/"+record.id}><label style={{color:"#ff0000"}}>维护</label>&nbsp;&nbsp;{text}</Link> :
          <Link to={"/patrol-object-detail/"+record.id}>{text}</Link>
        )
      }
    },
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '线路',
      dataIndex: 'siteLine',
      render: (text, record) => {
        if(locationTree&&locationTree.line) {
          const item = locationTree.line.find(obj=>obj.value===record.site.slice(0,4))
          if(item)
          return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (text, record) => {
        if(locationTree&&locationTree.site) {
          const item = locationTree.site.find(obj=>obj.value===record.site)
          if(item)
          return item.label
        }
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record) => {
        if(robotObjectType.length>0) {
          const item = robotObjectType.find(obj=>obj.code===record.type)
          if(item)
          return item.name
        }
      }
    },
    {
      title: '型号',
      dataIndex: 'modelNumber',
    },
    {
      title: '品牌',
      dataIndex: 'brand'
    },
    {
      title: '维护/故障数',
      dataIndex: 'countMaintain',
    },
    {
      title: '启用日期',
      dataIndex: 'startDate',
      render: (text, record) =>{
        return (
          text ? moment(record.startDate).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '停用日期',
      dataIndex: 'endDate',
      render: (text, record) =>{
        return (
          text ? moment(record.endDate).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '维护时间间隔',
      dataIndex: 'maintainTime',
    },
    {
      title: '维护里程间隔',
      dataIndex: 'actualMileage',
    },
    {
      title: '状态',
      dataIndex: 'robotStatus',
      render: (text, record) => {
        if(robotObjectStatus.length>0) {
          const item = robotObjectStatus.find(obj=>obj.code===record.robotStatus)
          return item.name
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'}>查看视频</Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={()=>{setVisible({...visible, showChangeStatus:true})}}>变更状态</Menu.Item>
                  <Menu.Item key="2"><Link to={"/patrol-object-detail/"+record.id}>查看详情</Link></Menu.Item>
                  <Menu.Item key="3" onClick={()=>{addMaintain(record.id)}}>添加维护记录</Menu.Item>
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

  //搜索
  const search = async () => {
    try {
      const values = await form.validateFields()
      const filterArr = []
      for(var key of Object.keys(values)) {
        const filterObj = {}
        filterObj["property"] = key
        filterObj["value"] = values[key]?values[key]:""
        if(key==="site" && values[key]) {
          filterObj["value"] = values[key][1]
        }
        if(key === "startDate" && values[key]){
          filterObj["value"] =  moment(filterObj["value"]).format('YYYY-MM-DD')
        }
        if(key === "endDate" && values[key]){
          filterObj["value"] =  moment(filterObj["value"]).format('YYYY-MM-DD')
        }
        if(filterObj.value && filterObj.property !== "mileage" && filterObj.property !== "actualMileage" && filterObj.property !== "timeRange" && filterObj.property !== "maintainTime"){
          filterArr.push(filterObj)
        }
      }
      setFilter(filterArr)

      setPaging({
        ...paging,
        current: 1,
        page: 1,
        start: 0,
      })
      setDirty(dirty=>dirty+1)
    }
    catch {}
  }

  //获取列表数据
  useEffect(() => {
    document.title = "设备管理"
    setLoading(true)
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    let currentPage = paging.currentPage
    let timeFilter
    let mileFilter
    let sysFilterSql
    if(time){
      if(time === "1" && maintainTimeValue.middle){
        timeFilter = '> '+maintainTimeValue.middle
      }  else if(time === "2" && maintainTimeValue.middle){
        timeFilter = '<' + maintainTimeValue.middle
      } else if(time === "3" && maintainTimeValue.minTime && maintainTimeValue.maxTime){
        timeFilter = ' between ' + maintainTimeValue.minTime + ' and ' + maintainTimeValue.maxTime
      }
    }
    if(mile){
      if(mile === "1" && actualMileage.middle){
        mileFilter = '> '+actualMileage.middle
      }  else if(mile === "2" && actualMileage.middle){
        mileFilter = '<' + actualMileage.middle
      } else if(mile === "3" && actualMileage.minMileage && actualMileage.maxMileage){
        mileFilter = ' between ' + actualMileage.minMileage + ' and ' + actualMileage.maxMileage
      }
    }
    if(timeFilter && mileFilter){
      sysFilterSql = 'timestampdiff(MINUTE, ro_lastMaintain, NOW())/60 ' +timeFilter +' and ro_actualMileage' +mileFilter
    } else if(timeFilter && !mileFilter){
      sysFilterSql = 'timestampdiff(MINUTE, ro_lastMaintain, NOW())/60 ' +timeFilter
    } else if(!timeFilter && mileFilter){
      sysFilterSql = 'ro_actualMileage' +mileFilter
    }

    robotObject.robotObjectList({page:currentPage,start:start,sysFilterSql:sysFilterSql,limit:pageSize,filter:JSON.stringify(filter)})
    .then(res => {
      if(res){
        setSelectedCodes([])
        setChecked(false)
        setAllCodes(res.models.map(item => {return(item.id)}))
        setPaging(paging => {
          const aa={
            ...paging,
            total:res.total
          }
          return aa
        })
        setData(res.models)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty]);

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage:page
    })
    setDirty(dirty+1)
  }

  const onCheckBox = (event ) => {
    if(event.target.checked){
      setSelectedCodes(allCodes)
      setChecked(true)
    }else{
      setSelectedCodes([])
      setChecked(false)
    }
  }

  const pageSizeChange = (current,pageSize) => {
      setPaging({
          ...paging,
          pageSize:pageSize
      })
      setDirty(dirty+1)
  }
  return (
    <div>
      <div className={commonStyles.searchForm}>
        <Form form={form} name="searchFrom">
          <Row>
            <Col span={4}>
              <Form.Item name="name">
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="brand">
                <Select placeholder="请选择设备品牌" showSearch allowClear>
                  {brands && brands.map(item => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="site">
                <Cascader options={locationTree&&locationTree.lineSite} placeholder="请选择线路/站点" allowClear />
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="startDate">
                <DatePicker placeholder="请选择启用日期" />
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item name="endDate">
                <DatePicker placeholder="请选择停用日期" />
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item name="mileage">
                <Select placeholder="维护里程间隔" style={{ width: 155 }} onChange={(value)=>{setMile(value)}}>
                  <Select.Option value="1">维护里程间隔大于</Select.Option>
                  <Select.Option value="2">维护里程间隔小于</Select.Option>
                  <Select.Option value="3">维护里程间隔介于</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="actualMileage">
                {mile === "3" ? <span><InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setActualMileage({
                      ...actualMileage,
                      minMileage: value
                    });
                  }
                }
                min={0}/>~<InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setActualMileage({
                      ...actualMileage,
                      maxMileage: value
                    });
                  }
                }
                min={actualMileage.minMileage}/></span> : <InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setActualMileage({
                      ...actualMileage,
                      middle: value
                    });
                  }
                }
                min={0}/>}
              </Form.Item>
            </Col>
            <Col span={3} offset={1}>
              <Form.Item name="timeRange">
                <Select placeholder="维护时间间隔" style={{ width: 155 }} onChange={(value)=>{setTime(value);}}>
                  <Select.Option value="1">维护时间间隔大于</Select.Option>
                  <Select.Option value="2">维护时间间隔小于</Select.Option>
                  <Select.Option value="3">维护时间间隔介于</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="maintainTime">
                {time ==="3" ? <span><InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setMaintainTimeValue({
                      ...maintainTimeValue,
                      minTime: value
                    });
                  }
                }
                min={0}/>~<InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setMaintainTimeValue({
                      ...maintainTimeValue,
                      maxTime: value
                    });
                  }
                }
                min={maintainTimeValue.minTime}/></span> : <InputNumber
                  style={{ width: 110 }}
                  onChange={(value) =>{
                    setMaintainTimeValue({
                      ...maintainTimeValue,
                    middle : value
                    });
                  }
                }
                min={0}/>}
              </Form.Item>
            </Col>
            <Col offset={1}>
              <Form.Item>
                <Button type="primary" onClick={search} >筛选</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div>
        <Row>
          <Col span={2} style={{textAlign: "center"}}><label>标签:</label></Col>
          <Col span={17}>
            <CheckableTag checked={tagChecked.all} onChange={(checked)=>{setTagChecked({all: checked, free: checked, patrol: checked, control: checked, maintenance: checked, fault: checked, stop: checked})}}>全部</CheckableTag>
            <CheckableTag checked={tagChecked.free} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, free: checked})}}>空闲中</CheckableTag>
            <CheckableTag checked={tagChecked.patrol} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, patrol: checked})}}>巡检中</CheckableTag>
            <CheckableTag checked={tagChecked.control} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, control: checked})}}>控制中</CheckableTag>
            <CheckableTag checked={tagChecked.maintenance} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, maintenance: checked})}}>维护中</CheckableTag>
            <CheckableTag checked={tagChecked.fault} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, fault: checked})}}>故障中</CheckableTag>
            <CheckableTag checked={tagChecked.stop} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, stop: checked})}}>已停用</CheckableTag>
          </Col>
          <Col span={2}>
            <Button type="danger" onClick={newModal}>新建</Button>
            </Col>
            <Col span={3}>
            <Dropdown overlay={menu}>
              <Button type="danger">更多功能<DownOutlined /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <Table loading={loading} rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
        <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showChangeStatus:true})} }>批量变更</Button>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showEdit:true})} }>批量修改</Button>
          <Button type="danger" ghost onClick={addBatchMaintain}>添加维护记录</Button>
          <Button type="danger" ghost onClick={maintainCompleted}>维护完成</Button>
        </Col>
        <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
      </Row>

      <AddModal
        visible={visible.showAdd}
        locationTree={locationTree}
        entity={{brands: brands,suppliers: suppliers, robotPatrolLocs: robotPatrolLocs,properties: properties, robotObjectType:robotObjectType, robotObjectStatus: robotObjectStatus, videoStream: videoStream }}
        {...{setDirty, handleCancel}}
      />
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
      <AddRecordModal visible={visible.showAddRecord} title="添加维护记录" {...{currentId, selectedCodes, setDirty, addSingle, handleCancel}}/>
      <ChangeStatusModal visible={visible.showChangeStatus} robotObjectStatus={robotObjectStatus} {...{selectedCodes, handleCancel, setDirty}}/>
      <EditModal visible={visible.showEdit} brands={brands} {...{selectedCodes, handleCancel, setDirty}}/>
    </div>
  );
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
    },
    getSuppliersDispatch() {
      dispatch(getSuppliers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ObjectModule))
