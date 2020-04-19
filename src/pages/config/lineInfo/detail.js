import React, {useState, useEffect} from 'react'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Form,
  Input,
  Button,
  Select,
  Tabs,
  Row,
  Col,
  Dropdown,
  Menu,
  DatePicker,
  Upload,
  TimePicker,
  Card,
  Modal,
  message,
} from 'antd'
import { Link } from 'react-router-dom'
import SiteModal from './siteModal'
import NetModal from './netModal'
import AnchorModal, { AssociatedPlace } from './anchorModal'
import ShiftModal from './shiftModal'
import ObjectModal from './objectModal'
import UploadModal from './uploadModal'
import {commonTable } from '../../common/table'
import './Line.module.scss'

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

const Detail = props => {
  const [form] = Form.useForm()
  const [edit, setEdit] = useState(false)
  const [visible, setVisible] = useState({
    showSite:false,
    showNet: false,
    showAnchor: false,
    showShift: false,
    showObject: false,
    showAssociatedPlace: false,
    showUpload: false
  })
  const [modalTitle, setModalTitle] = useState({
    siteTitle: null,
    netTitle: null,
    anchorTitle: null,
    shiftTitle: null,
    objectTitle: null
  })
  const [uploadTitle, setupLoadTitle] = useState("上传附件")
  const [activeKey, setActiveKey] = useState("bascInfo")  //设置显示tab
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })

  const handleCancel = () => {
    setVisible(false)
  }

  const columns = {
    siteColumns: [
      {
        title: '站点',
        dataIndex: 'desc'
      },
      {
        title: '车站类型',
        dataIndex: 'siteFunction'
      },
      {
        title: '变电所类型',
        dataIndex: 'style'
      },
      {
        title: '车站位置类型',
        dataIndex: 'locationType'
      },
      {
        title: '房间数量',
        dataIndex: 'num'
      },
      {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={(e)=>{checkSiteList(e.key, record.id)}}>查看详情</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={(e)=>{checkSiteList(e.key, record.id)}}>编辑</Menu.Item>
                    <Menu.Item key="deleteSite" onClick={(e)=>{deleteItem(e.key, record.id)}}>删除</Menu.Item>
                    <Menu.Item key="upload" onClick={(e)=>{upload(e.key, record.id)}}>上传平面图</Menu.Item>
                    <Menu.Item key="graph" onClick={(e)=>{upload(e.key, record.id)}}>上传HT图形</Menu.Item>
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
    ],

    netColumns: [
      {
        title: '区间名称',
        dataIndex: 'descr'
      },
      {
        title: '触网类型',
        dataIndex: 'catenaryType'
      },
      {
        title: '站点1',
        dataIndex: 'site1'
      },
      {
        title: '站点2',
        dataIndex: 'site2'
      },
      {
        title: '行车路线',
        dataIndex: 'vehicleRoute'
      },
      {
        title: '是否长/大区间',
        dataIndex: 'isLarge'
      },
      {
        title: '有无区间所',
        dataIndex: 'hasIntervalPlace'
      },
      {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={(e)=>{checkNetList(e.key, record.id)}}>查看详情</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={(e)=>{checkNetList(e.key, record.id)}}>编辑</Menu.Item>
                    <Menu.Item key="deleteNet" onClick={(e)=>{deleteItem(e.key, record.id)}}>删除</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <DownOutlined />
                </Button>
              </Dropdown>
            </span>
          )
        }
      }
    ],

    anchorColumns: [
      {
        title: '序号',
        dataIndex: 'sn'
      },
      {
        title: '锚段名称',
        dataIndex: 'descr'
      },
      {
        title: '锚段号',
        dataIndex: 'code'
      },
      {
        title: '锚段长度',
        dataIndex: 'length'
      },
      {
        title: '行车路线',
        dataIndex: 'vehicleRoute'
      },
      {
        title: '关联区间',
        dataIndex: 'interval'
      },
      {
        title: '关联定位点',
        dataIndex: 'num2'
      },
      {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={(e)=>{checkAnchorList(e.key, record.id)}}>查看详情</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="deleteAnchor" onClick={(e)=>{deleteItem(e.key, record.id)}}>删除</Menu.Item>
                    <Menu.Item key="place" onClick={()=>{associatedPlace(record.id)}}>关联区间</Menu.Item>
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
    ],

    shiftColumns: [
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '手机',
        dataIndex: 'phone'
      },
      {
        title: '组织',
        dataIndex: 'org'
      },
      {
        title: '线路',
        dataIndex: 'line'
      },
      {
        title: '角色',
        dataIndex: 'role'
      },
      {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => {
          return (
            <span>
              <Button type="link" size={'small'}>取消/设为线长</Button>
              <Button type="link" size={'small'}>取消/设为线员</Button>
            </span>
          )
        }
      }
    ],

    objectColumns: [
      {
        title: '设备分类',
        dataIndex: 'cls'
      },
      {
        title: '品牌',
        dataIndex: 'brand'
      },
      {
        title: '型号',
        dataIndex: 'modelNumber'
      },
      {
        title: '规格',
        dataIndex: 'spec'
      },
      {
        title: '操作',
        dataIndex: 'option',
        render: (text, record) => {
          return (
            <span>
              <Button type="link" size={'small'} onClick={()=>checkObjectList("edit", record.id)}>编辑</Button>
              <Button type="link" size={'small'} onClick={()=>deleteItem("deleteObject", record.id)}>删除</Button>
            </span>
          )
        }
      }
    ]
  }

  useEffect(()=>{
    document.title = "线路信息详情"

    setLoading(false)
  }, [dirty])

  //删除
  const deleteItem = (type, id) => {
    Modal.confirm({
      title: '确认提示',
      content: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        message.success("删除成功")
        setDirty((dirty)=> dirty+1)
      },
      onCancel() {
      },
    })
  }

  //站点新建编辑查看
  const checkSiteList = (type, id) => {
    switch (type) {
      case "add":
        setModalTitle({...modalTitle, siteTitle:'新建站点'})
        break;
      case "edit":
        setModalTitle({...modalTitle, siteTitle:'编辑站点'})
        break;
      default:
        setModalTitle({...modalTitle, siteTitle:'查看详情'})
    }
    setVisible({
      ...visible,
      showSite: true
    })
  }
  //上传平面图、HT图形
  const upload = (type, id)=> {
    if(type === "graph") {
      setupLoadTitle("上传图形")
    } else {
      setupLoadTitle("上传附件")
    }
    setVisible({...visible, showUpload: true})
  }

  //触网区间新建编辑查看
  const checkNetList = (type, id) => {
    switch (type) {
      case "add":
        setModalTitle({...modalTitle, netTitle:'新建触网区间'})
        break;
      case "edit":
        setModalTitle({...modalTitle, netTitle:'编辑触网区间'})
        break;
      default:
        setModalTitle({...modalTitle, netTitle:'查看详情'})
    }
    setVisible({
      ...visible,
      showNet: true
    })
  }

  //锚段新建查看
  const checkAnchorList = (type, id) => {
    if(type === "add") {
      setModalTitle({...modalTitle, anchorTitle:"新建锚段"})
    } else {
      setModalTitle({...modalTitle, anchorTitle:"查看详情"})
    }
    setVisible({
      ...visible,
      showAnchor: true
    })
  }
  //关联区间
  const associatedPlace = (id) => {
    setVisible({
      ...visible,
      showAssociatedPlace: true
    })
  }

  //班次新增编辑
  const checkShiftList = (type) => {
    if(type === "add") {
      setModalTitle({...modalTitle, shiftTitle:"新增班次"})
    } else {
      setModalTitle({...modalTitle, shiftTitle:"编辑班次"})
    }
    setVisible({
      ...visible,
      showShift: true
    })
  }
  //删除班次
  const deleteShiftList = (id) => {
    Modal.confirm({
      title: '确认提示',
      content: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        message.success("删除成功")
        setDirty((dirty)=> dirty+1)
      },
      onCancel() {
      },
    })
  }

  //编辑设备信息
  const checkObjectList = (type, id) => {
    if(type === "edit") {
      setModalTitle({...modalTitle, objectTitle:"编辑设备信息"})
    } else {
      setModalTitle({...modalTitle, objectTitle:"新建设备信息"})
    }
    setVisible({
      ...visible,
      showObject: true
    })
  }

  //基本信息编辑保存
  const save = () => {

  }

  return (
    <>
      <Button><Link to="/config/line-info">返回</Link></Button>

      <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}} style={{margin:30}}>
        <Tabs.TabPane tab="基础信息" key="bascInfo">
          <Row>
            <Col span={2}><h3>基础信息</h3></Col>
            {
              edit === false ?
              <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(true)}}>编辑</Button></Col> :
              <>
                <Col span={2}><Button type="primary" ghost onClick={save}>保存</Button></Col>
                <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(false)}}>取消</Button></Col>
              </>
            }
          </Row>
          <Row>
            {
              edit === false ?
              <Form {...formItemLayout} form={form}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="线路代码" name="code">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="线路描述" name="desc">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="开始运营时间" name="commissionDate">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="日运营开始时间" name="runStartTime">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="日运营结束时间" name="runEndTime">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="线长" name="lineLeader">
                      <Input disabled/>
                      </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="班次" name="class">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="线路人员" name="people">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="触网类型" name="catenaryType">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注" name="comment">
                      <Input disabled/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="图形">
                      <Upload listType="picture-card">
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="附件">
                      <Upload>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Form> :
              <Form {...formItemLayout} form={form}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="线路描述" name="desc">
                      <Select placeholder="请选择线路描述" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="开始运营时间" name="commissionDate">
                      <DatePicker placeholder="请选择日期"/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="日运营开始时间" name="runStartTime">
                      <TimePicker placeholder="请选择日运营开始时间" format={"HH:mm"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="日运营结束时间" name="runEndTime">
                      <TimePicker placeholder="请选择日运营结束时间" format={"HH:mm"} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="触网类型" name="catenaryType">
                      <Select placeholder="请选择触网类型" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注" name="comment">
                      <Input.TextArea placeholder="请输入备注" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="图形">
                      <Upload listType="picture-card">
                        <PlusOutlined />
                      </Upload>
                      <div>不超过20M,格式为jpg，png</div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="附件">
                      <Upload>
                        <Button>上传附件</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            }
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="站点信息" key="siteInfo">
          <Row type="flex" justify="space-between">
            <Col><h3>站点信息</h3></Col>
            <Col><Button type="danger" onClick={()=>checkSiteList("add", null)}>新建站点</Button></Col>
          </Row>
          { commonTable(columns.siteColumns, [{site:11}], "site", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>

        <Tabs.TabPane tab="区间信息" key="netInfo">
          <Row type="flex" justify="space-between">
            <Col><h3>区间信息</h3></Col>
            <Col><Button type="danger" onClick={()=>checkNetList("add", null)}>新建触网区间</Button></Col>
          </Row>
          { commonTable(columns.netColumns, [{name:11}], "name", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>

        <Tabs.TabPane tab="锚段信息" key="anchorInfo">
          <Row type="flex" justify="space-between">
            <Col><h3>锚段信息</h3></Col>
            <Col><Button type="danger" onClick={()=>checkAnchorList("add", null)}>新建锚段</Button></Col>
          </Row>
          { commonTable(columns.anchorColumns, [{name:11}], "name", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>

        <Tabs.TabPane tab="线长/班次信息" key="shiftInfo">
          <Row type="flex" justify="space-between">
            <Col><h3>线长/班次信息</h3></Col>
            <Col><Button type="danger" onClick={()=>{checkShiftList("add")}}>新增班次</Button></Col>
          </Row>
          <Row>
            <Col span={12}>
              <Card>
                <Row>
                  <Col span={10}>名称：白班</Col>
                  <Col span={10}>线路：17号线</Col>
                  <Col span={4}><Button onClick={()=>{checkShiftList("edit")}}>编辑</Button></Col>
                  <Col span={10}>开始时间：6：00</Col>
                  <Col span={10}>结束时间：18：00</Col>
                  <Col span={4}><Button onClick={()=>{deleteShiftList()}}>删除</Button></Col>
                </Row>
              </Card>
            </Col>
          </Row>
          { commonTable(columns.shiftColumns, [{name:11}], "name", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>

        <Tabs.TabPane tab="设备信息" key="objectInfo">
          <Row type="flex" justify="space-between">
            <Col><h3>设备信息</h3></Col>
            <Col><Button type="danger" onClick={(e)=>{checkObjectList("add", null)}}>新建设备</Button></Col>
          </Row>
          { commonTable(columns.objectColumns, [{name:11}], "name", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>

      </Tabs>

      <SiteModal {...{visible:visible.showSite, title:modalTitle.siteTitle, handleCancel}} />
      <NetModal {...{visible:visible.showNet, title:modalTitle.netTitle, handleCancel}} />
      <AnchorModal {...{visible:visible.showAnchor, title:modalTitle.anchorTitle, handleCancel}} />
      <ShiftModal {...{visible:visible.showShift, title:modalTitle.shiftTitle, handleCancel}} />
      <ObjectModal {...{visible:visible.showObject, title:modalTitle.objectTitle, handleCancel}} />
      <AssociatedPlace {...{visible:visible.showAssociatedPlace, handleCancel}} />
      <UploadModal {...{visible: visible.showUpload, title:uploadTitle, handleCancel}} />
    </>
  )
}

export default React.memo(Detail)
