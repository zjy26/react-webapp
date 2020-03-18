import React, { useState, useEffect } from 'react'
import moment from "moment"
import { Link } from 'react-router-dom'
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, InputNumber, Table, Checkbox, Tag, Menu, Dropdown, Icon, Pagination, message } from 'antd'
import { robotObject, robotMaintain } from '../../api'
import AddModal from './addModal'
import ImportModal from '../common/importModal'
import AuditModal from '../common/auditModal'
import AddRecordModal from './addRecordModal'
import ChangeStatusModal from './changeStatusModal'
import EditModal from './editModal'
import { connect } from "react-redux"

const { CheckableTag } = Tag;
const ObjectModule = props => {
  const { getFieldDecorator } = props.form;
  const [objectIds, setObjectIds] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const [data, setData] = useState([])  //列表数据
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

  //列表逐条数据选择
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      let ids = new Set()
      ids.add(selectedRowKeys)
      setObjectIds(...ids)
    }
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
    if(objectIds.length>0) {
      robotMaintain.robotObjectMaintainComplete({id: objectIds.toString()})
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
    if(objectIds.length>0) {
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
        if(props.locationTree && props.locationTree.line) {
          const item = props.locationTree.line.find(obj=>obj.value===record.site.slice(0,4))
          return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (text, record) => {
        if(props.locationTree&&props.locationTree.site) {
          const item = props.locationTree.site.find(obj=>obj.value===record.site)
          return item.label
        }
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record) => {
        if(props.robotObjectType&&props.robotObjectType.length>0) {
          const item = props.robotObjectType.find(obj=>obj.code===record.type)
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
      dataIndex: 'brand',
      render: (text, record) => {
        if(props.brands&&props.brands.length>0) {
          const item = props.brands.find(obj=>obj.id===record.brand)
          return item.name
        }
      }
    },
    {
      title: '维护/故障数',
      dataIndex: 'countMaintain',
    },
    {
      title: '启用日期',
      dataIndex: 'startDate',
      render: (text, record) => moment(record.startDate).format('YYYY-MM-DD')
    },
    {
      title: '停用日期',
      dataIndex: 'endDate',
      render: (text, record) => moment(record.endDate).format('YYYY-MM-DD')
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
        if(props.robotObjectStatus&&props.robotObjectStatus.length>0) {
          const item = props.robotObjectStatus.find(obj=>obj.code===record.robotStatus)
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
                <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        )
      }
    }
  ];

  //获取列表数据
  useEffect(() => {
    document.title = "设备管理"
    setLoading(true)
    //列表数据
    robotObject.robotObjectList()
    .then(res => {
      if(res){
        setData(res)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  }, [dirty]);

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <div>
      <Form layout="inline" style={{margin: 30}} onSubmit={handleSubmit}>
        <Row gutter={16}>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [],
              })(
                <Input placeholder="请输入设备名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('brand', {
                rules: [],
              })(
                <Select placeholder="请输入设备品牌" style={{ width: 200 }} showSearch>
                  {props.brands && props.brands.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('lineSite', {
                rules: [],
              })(
                <Cascader options={props.locationTree.lineSite} placeholder="请选择线路/站点" />,
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('startDate', {
                rules: [],
              })(
                <DatePicker placeholder="请选择启用日期" />
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('stopDate', {
                rules: [],
              })(
                <DatePicker placeholder="请选择停用日期" />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('mileage', {
                rules: [],
              })(
                <Select placeholder="维护里程间隔" style={{ width: 160 }} onChange={(value)=>{setMile(value)}}>
                  <Select.Option value="1">维护里程间隔大于</Select.Option>
                  <Select.Option value="2">维护里程间隔小于</Select.Option>
                  <Select.Option value="3">维护里程间隔介于</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('mileNum')(
                mile === "3" ? <span><InputNumber />~<InputNumber /></span> : <InputNumber />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('timeRange', {
                rules: [],
              })(
                <Select placeholder="维护时间间隔" style={{ width: 160 }} onChange={(value)=>{setTime(value);}}>
                  <Select.Option value="1">维护时间间隔大于</Select.Option>
                  <Select.Option value="2">维护时间间隔小于</Select.Option>
                  <Select.Option value="3">维护时间间隔介于</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('timeNum')(
                time ==="3" ? <span><InputNumber />~<InputNumber /></span> : <InputNumber />,
              )}
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Row>
      </Form>

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
              <Button type="danger">更多功能<Icon type="down" /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <Table loading={loading} rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
          <Checkbox>全选</Checkbox>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showChangeStatus:true})} }>批量变更</Button>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showEdit:true})} }>批量修改</Button>
          <Button type="danger" ghost onClick={addBatchMaintain}>添加维护记录</Button>
          <Button type="danger" ghost onClick={maintainCompleted}>维护完成</Button>
        </Col>
        <Col><Pagination total={20} showSizeChanger showQuickJumper /></Col>
      </Row>

      <AddModal visible={visible.showAdd} title="添加维护记录" {...{setDirty, handleCancel}} />
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
      <AddRecordModal visible={visible.showAddRecord} {...{currentId, objectIds, setDirty, addSingle, handleCancel}}/>
      <ChangeStatusModal visible={visible.showChangeStatus} {...{handleCancel, setDirty}}/>
      <EditModal visible={visible.showEdit} {...{objectIds, handleCancel, setDirty}}/>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree,
    brands: state.brands,
    robotObjectType: state.robotObjectType,
    robotObjectStatus: state.robotObjectStatus,
    videoStream: state.videoStream
  }
}

export default connect(mapStateToProps, null)(React.memo(Form.create()(ObjectModule)))
