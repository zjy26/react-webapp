import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'
import { Modal, Button, Steps, Row, Col, Form, Input, Select, Radio, Tabs, Dropdown, Menu } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {commonTable } from '../../common/table'
import CheckPartsModal, { PartsParametersModal, ParametersStandardModal } from './partsModal'
import CheckPropertyModal, { AssociatedPartsModal } from './propertyModal'
import CheckSettingModal from './settingModal'
import CheckTestModal from './testModal'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
}

const Detail = props => {
  const [form] = Form.useForm()
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [activeKey, setActiveKey] = useState({
    parts: "static"
  })
  const [visible, setVisible] = useState({
    showParts: false,
    showParametersStandard: false,
    showPartsParameters: false,
    showProperty: false,
    showAssociatedParts: false,
    showSetting: false,
    showTest: false
  })
  const [modalTitle, setModalTitle] = useState({
    parts: null,
    property: null,
    setting: null,
    test: null
  })

  useEffect(()=>{
    document.title = "模板定义"

    setLoading(false)
  }, [dirty])

  const handleCancel = ()=>{
    setVisible({
      showParts: false,
      showParametersStandard: false,
      showPartsParameters: false,
      showProperty: false,
      showAssociatedParts: false,
      showSetting: false,
      showTest: false
    })
  }

  //列表删除
  const deleteItem = (type, id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: ()=> {

      },
      onCancel() {
      },
    })
  }

  //新建编辑
  const check = (cls, type, id) => {
    switch(cls) {
      case "parts":
        console.log(activeKey.parts)
        setVisible({...visible, showParts: true})
        setModalTitle({...modalTitle, parts: type==="add"?"新建":"编辑"})
      break;
      case "property":
        setVisible({...visible, showProperty: true})
        setModalTitle({...modalTitle, property: type==="add"?"新建":"编辑"})
        break;
      case "setting":
        setVisible({...visible, showSetting: true})
        setModalTitle({...modalTitle, setting: type==="add"?"新建":"编辑"})
        break;
      case "test":
        setVisible({...visible, showTest: true})
        setModalTitle({...modalTitle, test: type==="add"?"新建":"编辑"})
        break;
      default:

    }
  }

  //部件参数
  const partsParameters = (id) => {
    setVisible({
      ...visible,
      showPartsParameters: true
    })
  }

  const columns = {
    object: [
      {
        title: '代码',
        dataIndex: 'code'
      },
      {
        title: '分类',
        dataIndex: 'cls'
      },
      {
        title: '描述',
        dataIndex: 'descr'
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
        title: '元器件编号',
        dataIndex: 'componentNumber'
      },
      {
        title: '设计寿命',
        dataIndex: 'designLife'
      },
      {
        title: '更换年限',
        dataIndex: 'replaceLife'
      },
      {
        title: '关键部件',
        dataIndex: 'criticality'
      },
      {
        title: '变比一次参数',
        dataIndex: 'transRatio1'
      },
      {
        title: '变比两次参数',
        dataIndex: 'transRatio2'
      },
      {
        title: '制造商',
        dataIndex: 'manufact'
      },
      {
        title: 'E码/订货编号',
        dataIndex: 'ecode'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={()=>setVisible({...visible, showParametersStandard:true})}>参数标准</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="check" onClick={()=>{partsParameters(record.id)}}>部件参数</Menu.Item>
                    <Menu.Item key="edit" onClick={()=>{check("parts", "edit", record.id)}}>编辑</Menu.Item>
                    <Menu.Item key="delete" onClick={()=>{deleteItem("parts", record.id)}}>删除</Menu.Item>
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
    attribute: [
      {
        title: '属性代码',
        dataIndex: 'code'
      },
      {
        title: '属性名称',
        dataIndex: 'descr'
      },
      {
        title: '属性说明',
        dataIndex: 'alias'
      },
      {
        title: '故障原因',
        dataIndex: 'reason'
      },
      {
        title: '处理方法',
        dataIndex: 'action'
      },
      {
        title: '属性类型',
        dataIndex: 'source'
      },
      {
        title: '属性值',
        dataIndex: 'value'
      },
      {
        title: '属性标准值',
        dataIndex: 'stdValue'
      },
      {
        title: '计量单位',
        dataIndex: 'uom'
      },
      {
        title: '来源类型',
        dataIndex: 'sourceType'
      },
      {
        title: '备注',
        dataIndex: 'remarks'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={()=>{setVisible({...visible, showAssociatedParts: true})}}>关联部件</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={()=>{check("property", "edit", record.id)}}>编辑</Menu.Item>
                    <Menu.Item key="delete" onClick={()=>{deleteItem("property", record.id)}}>删除</Menu.Item>
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
    telemetry: [
      {
        title: '属性代码',
        dataIndex: 'code'
      },
      {
        title: '属性名称',
        dataIndex: 'descr'
      },
      {
        title: '属性说明',
        dataIndex: 'alias'
      },
      {
        title: '计量单位',
        dataIndex: 'uom'
      },
      {
        title: '阈值上限',
        dataIndex: 'maxValue'
      },
      {
        title: '阈值下限',
        dataIndex: 'minValue'
      },
      {
        title: '故障原因',
        dataIndex: 'reason'
      },
      {
        title: '处理方法',
        dataIndex: 'action'
      },
      {
        title: '备注',
        dataIndex: 'remarks'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={()=>{setVisible({...visible, showAssociatedParts: true})}}>关联部件</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={(e)=>{}}>编辑</Menu.Item>
                    <Menu.Item key="deleteSite" onClick={(e)=>{}}>删除</Menu.Item>
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
    remoteSignal: [
      {
        title: '属性代码',
        dataIndex: 'code'
      },
      {
        title: '属性名称',
        dataIndex: 'descr'
      },
      {
        title: '属性说明',
        dataIndex: 'alias'
      },
      {
        title: '开关属性',
        dataIndex: 'switch'
      },
      {
        title: '故障原因',
        dataIndex: 'reason'
      },
      {
        title: '处理方法',
        dataIndex: 'action'
      },
      {
        title: '备注',
        dataIndex: 'remarks'
      },
      {
        title: '属性值',
        dataIndex: 'value'
      },
      {
        title: '计量单位',
        dataIndex: 'uom'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="detail" type="link" size={'small'} onClick={()=>{setVisible({...visible, showAssociatedParts: true})}}>关联部件</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={(e)=>{}}>编辑</Menu.Item>
                    <Menu.Item key="deleteSite" onClick={(e)=>{}}>删除</Menu.Item>
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
    setting: [
      {
        title: '组别',
        dataIndex: 'group'
      },
      {
        title: '名称',
        dataIndex: 'descr'
      },
      {
        title: '属性代码',
        dataIndex: 'property'
      },
      {
        title: '属性说明',
        dataIndex: 'alias'
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue'
      },
      {
        title: '计量单位',
        dataIndex: 'uom'
      },
      {
        title: '动作时限',
        dataIndex: 'actTimeLimit'
      },
      {
        title: '动作计量单位',
        dataIndex: 'actUom'
      },
      {
        title: '备注',
        dataIndex: 'remarks'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="edit" type="link" size={'small'} onClick={()=>{check("setting", "edit", record.id)}}>编辑</Button>
              <Button key="delete" type="link" size={'small'} onClick={()=>{deleteItem("setting", record.id)}}>删除</Button>
            </span>
          )
        }
      }
    ],
    test: [
      {
        title: '序号',
        dataIndex: 'sn'
      },
      {
        title: '属性名称',
        dataIndex: 'descr'
      },
      {
        title: '属性代码',
        dataIndex: 'property'
      },
      {
        title: '属性说明',
        dataIndex: 'alias'
      },
      {
        title: '标准值',
        dataIndex: 'stdValue'
      },
      {
        title: '计量单位',
        dataIndex: 'uom'
      },
      {
        title: '动作时限',
        dataIndex: 'actTimeLimit'
      },
      {
        title: '动作计量单位',
        dataIndex: 'actUom'
      },
      {
        title: '备注',
        dataIndex: 'remarks'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <span>
              <Button key="edit" type="link" size={'small'} onClick={()=>{check("test", "edit", record.id)}}>编辑</Button>
              <Button key="delete" type="link" size={'small'} onClick={()=>{deleteItem("test", record.id)}}>删除</Button>
            </span>
          )
        }
      }
    ]
  }

  let content = null
  switch(current) {
    case 1:
      content = <>
        <Tabs
          activeKey={activeKey.parts}
          onChange={(key )=>{setActiveKey({...activeKey, parts:key})}}
          tabBarExtraContent={<Button type="danger" onClick={()=>{check("parts", "add", null)}}>新建</Button>}
          style={{margin: '0 30px'}}
        >
          <Tabs.TabPane tab="静态部件" key="static">
            { commonTable(columns.object, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="动态部件" key="dynamic">
            { commonTable(columns.object, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
        </Tabs>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button onClick={()=>{setCurrent(0)}}>上一步</Button></Col>
          <Col span={2}><Button type="danger" onClick={()=>{setCurrent(2)}}>下一步</Button></Col>
        </Row>
      </>
      break;
    case 2:
      content = <>
        <div style={{margin: '0 30px'}}>
          <Row type="flex" justify="space-between">
            <Col><h3>属性信息</h3></Col>
            <Col><Button type="danger" onClick={()=>{check("property", "add", null)}}>新建</Button></Col>
          </Row>
          { commonTable(columns.attribute, [{code:11}], "code", loading, setDirty, pager, setPager, {}) }
        </div>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button onClick={()=>{setCurrent(1)}}>上一步</Button></Col>
          <Col span={2}><Button type="danger" onClick={()=>{setCurrent(3)}}>下一步</Button></Col>
        </Row>
      </>
      break;
    case 3:
      content = <>
        <Tabs tabBarExtraContent={<Button type="danger">新建</Button>} style={{margin: '0 30px'}}>
          <Tabs.TabPane tab="遥测信息" key="telemetry">
            { commonTable(columns.telemetry, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="遥信信息" key="remoteSignal">
            { commonTable(columns.remoteSignal, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="遥测累计信息" key="cumulative">
            { commonTable(columns.telemetry, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="遥视模拟" key="simulation">
            { commonTable(columns.telemetry, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="遥视数字" key="digital">
            { commonTable(columns.remoteSignal, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
          <Tabs.TabPane tab="遥视累计" key="viewCumulative">
            { commonTable(columns.telemetry, [{code:11}], "code", loading, setDirty, pager, setPager, {x: 1600}) }
          </Tabs.TabPane>
        </Tabs>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button onClick={()=>{setCurrent(2)}}>上一步</Button></Col>
          <Col span={2}><Button type="danger" onClick={()=>{setCurrent(4)}}>下一步</Button></Col>
        </Row>
      </>
      break;
    case 4:
      content = <>
        <div style={{margin: '0 30px'}}>
          <Row type="flex" justify="space-between">
            <Col><h3>整定值</h3></Col>
            <Col><Button type="danger" onClick={()=>{check("setting", "add", null)}}>新建</Button></Col>
          </Row>
          { commonTable(columns.setting, [{group:11}], "group", loading, setDirty, pager, setPager, {}) }
        </div>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button onClick={()=>{setCurrent(3)}}>上一步</Button></Col>
          <Col span={2}><Button type="danger" onClick={()=>{setCurrent(5)}}>下一步</Button></Col>
        </Row>
      </>
      break;
    case 5:
      content = <>
        <div style={{margin: '0 30px'}}>
          <Row type="flex" justify="space-between">
            <Col><h3>试验数据</h3></Col>
            <Col><Button type="danger" onClick={()=>{check("test", "add", null)}}>新建</Button></Col>
          </Row>
          { commonTable(columns.test, [{sn:11}], "sn", loading, setDirty, pager, setPager, {}) }
        </div>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button onClick={()=>{setCurrent(4)}}>上一步</Button></Col>
          <Col span={2}><Button type="danger">确定</Button></Col>
        </Row>
      </>
      break;
    default:
      content = <>
        <Form form={form} {...formItemLayout}>
          <Row>
            <Col offset={4} span={16}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="模板名称" name="template" rules={[{required: true, message: '请输入模板名称'}]}>
                    <Input placeholder="请输入计划名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备" name="object">
                    <Select placeholder="请选择设备" />
                  </Form.Item>
                </Col>
                <Col span={24}><h3 style={{marginLeft:'10%'}}>基础信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="版本/镜像" name="version">
                    <Input placeholder="请输入版本/镜像" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="编码" name="code">
                    <Input placeholder="请输入编码" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="描述" name="descr">
                    <Input placeholder="请输入描述" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="enable">
                  <Radio.Group>
                    <Radio value={2}>启用</Radio>
                    <Radio value={1}>未启用</Radio>
                  </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
                    <Select placeholder="请选择设备分类" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
                    <Select placeholder="请选择品牌" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
                    <Input placeholder="请输入型号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="规格" name="spec">
                    <Input placeholder="请输入规格" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="备注" name="comment">
                    <Input.TextArea placeholder="请输入备注" />
                  </Form.Item>
                </Col>
                <Col span={24}><h3 style={{marginLeft:'10%'}}>设备信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="设计寿命" name="designLife">
                    <Input placeholder="请输入设计寿命" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="大修年限" name="repairLife">
                    <Input placeholder="请输入大修年限" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="更换年限" name="replaceLife">
                    <Input placeholder="请输入更换年限" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="建议维护周期" name="maintenanceCycle">
                    <Input placeholder="请输入建议维护周期" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="制造商" name="manufact">
                    <Select placeholder="请选择制造商" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="一次变比参数" name="transRatio1">
                    <Input placeholder="请输入一次变比参数" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="二次变比参数" name="transRatio2">
                    <Input placeholder="请输入二次变比参数" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="遵循标准" name="standard">
                    <Input placeholder="请输入遵循标准" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备图片">

                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="BIM结构图">

                  </Form.Item>
                </Col>
                <Col span={24}><h3 style={{marginLeft:'10%'}}>企业信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="重要程度" name="importance">
                    <Select placeholder="请选择重要程度" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="ABC分类" name="classification">
                    <Select placeholder="请选择ABC分类" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="固定资产分类" name="objectCls">
                    <Select placeholder="请选择固定资产分类" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="电压等级" name="voltageLevel">
                    <Select placeholder="请选择电压等级" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="设备大类" name="mainCls">
                    <Select placeholder="请选择设备大类" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="制E码/订货编号" name="ecode">
                    <Input placeholder="请输入E码/订货编号" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <Row type="flex" justify="end" style={{margin:30}}>
          <Col span={2}><Button><Link to="/config/object-template">取消</Link></Button></Col>
          <Col span={2}><Button type="danger" onClick={()=>{setCurrent(1)}}>下一步</Button></Col>
        </Row>
      </>
  }

  return (
    <>
      <Button><Link to="/config/object-template">返回</Link></Button>
      <div style={{margin:30}}>
        <Steps current={current}>
          <Steps.Step title="基本信息" />
          <Steps.Step title="部件信息" />
          <Steps.Step title="属性信息" />
          <Steps.Step title="监测信息" />
          <Steps.Step title="整定值" />
          <Steps.Step title="试验信息" />
        </Steps>
      </div>
      {content}
      <CheckPartsModal {...{visible: visible.showParts, handleCancel, title: modalTitle.parts}} />
      <ParametersStandardModal {...{visible: visible.showParametersStandard, handleCancel}} />
      <PartsParametersModal {...{visible: visible.showPartsParameters, handleCancel}} />
      <CheckPropertyModal {...{visible: visible.showProperty, handleCancel, title: modalTitle.property}} />
      <AssociatedPartsModal {...{visible: visible.showAssociatedParts, handleCancel}}/>
      <CheckSettingModal {...{visible: visible.showSetting, handleCancel, title: modalTitle.setting}} />
      <CheckTestModal {...{visible: visible.showTest, handleCancel, title: modalTitle.test}} />
    </>
  )
}

export default React.memo(Detail)
