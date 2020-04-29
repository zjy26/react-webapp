import React, {useState, useEffect} from 'react'
import { Form, Tabs, Input, Button, Select, Row, Col, Divider, Radio, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import DetailModal from './detailModal'
import {setTable, commonTable } from '../../common/table'
import { configEntity } from '../../../api'

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
  const [initValues, setInitValues] = useState({})
  const [edit, setEdit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})
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
  const [data, setData] = useState([]) //业务数据详情列表

  const handleCancel = () => {
    setVisible(false)
  }

  const columns = [
    {
      title: '代码',
      dataIndex: 'code'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '描述',
      dataIndex: 'descr'
    },
    {
      title: '优先级',
      dataIndex: 'priority'
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      render: (text) => {
        if(text=== false) {
          return "启用"
        } else {
          return "停用"
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'comment'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={()=>{checkList("check", record.id)}}>查看详情</Button>
            <Divider type="vertical" />
            <Button type="link" size={'small'} onClick={()=>{checkList("edit", record.id)}}>编辑</Button>
            <Divider type="vertical" />
            <Button type="link" size={'small'} onClick={()=>{deleteList(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  useEffect(()=>{
    document.title = "业务基础数据"

    configEntity.configEntityDetail(props.match.params.id)
    .then(res=> {
      setInitValues(res)
      form.resetFields()
    })
    .catch(()=>{
      console.log("业务基础数据详情获取失败")
    })
  }, [form, props.match.params.code, props.match.params.id])

  //业务基础数据详情列表
  useEffect(()=>{
    setTable(configEntity.configEntityCodeList, setData, setLoading, pager, setPager, null, null, props.match.params.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //基本信息编辑保存
  const save = () => {
    form.validateFields()
    .then(values=> {
      const params = {...values, code:props.match.params.id, _method:'PUT'}
      configEntity.configEntityUpdate(props.match.params.id, params)
      .then(()=>{
        setInitValues(values)
        message.success("保存成功")
        setEdit(false)
      })
    })
  }
  //取消编辑
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }


  //业务数据新增编辑查看
  const checkList = (type, id) => {
    switch(type) {
      case "add":
        setModalProperty({title: "新建", type: "add", childId:null})
        break;
      case "edit":
        setModalProperty({title: "编辑", type: "edit", childId:id})
        break;
      default:
        setModalProperty({title: "查看详情", type: "check", childId:id})
    }
    setVisible(true)
  }

  //业务列表数据删除
  const deleteList = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        configEntity.configEntityCodeDelete(id)
        .then(()=>{
          message.success("删除成功")
          setDirty((dirty)=> dirty+1)
        })
      },
      onCancel() {
      },
    })
  }

  return (
    <div>
      <Button><Link to="/config/config-info">返回</Link></Button>

      <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}} style={{margin:30}}>
        <Tabs.TabPane tab="基础信息" key="bascInfo">
          <Row>
            <Col span={2}><h3>基础信息</h3></Col>
            {
              edit ?
              <React.Fragment>
                <Col span={2}><Button type="primary" ghost onClick={save}>保存</Button></Col>
                <Col span={2}><Button type="primary" ghost onClick={cancel}>取消</Button></Col>
              </React.Fragment> :
              <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(true)}}>编辑</Button></Col>
            }
          </Row>

          <Form {...formItemLayout} form={form} initialValues={initValues}>
          {
            edit ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="业务数据名称" name="name" rules={[{required: true, message: '请输入业务数据名称'}]}>
                  <Input placeholder="请输入业务数据名称" />
                </Form.Item>
              </Col>
              <Col span={12} style={{display:'none'}}>
                <Form.Item label="类型" name="type" rules={[{required: true, message: '请选择类型'}]}>
                  <Radio.Group>
                    <Radio value={2}>代码</Radio>
                    <Radio value={1}>分类</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12} style={{display:'none'}}>
                <Form.Item label="代码类型" name="codeType">
                <Select placeholder="请选择代码类型">
                  <Select.Option value={3}>3</Select.Option>
                  <Select.Option value={2}>数字及文本</Select.Option>
                  <Select.Option value={1}>数字</Select.Option>
                </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="应用类型" name="applyType">
                  <Radio.Group>
                    <Radio value={2}>业务</Radio>
                    <Radio value={1}>系统</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="描述" name="descr">
                  <Input.TextArea placeholder="请输入描述" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="备注" name="comment">
                  <Input.TextArea placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
            :
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="业务数据名称">
                  {initValues.name}
                </Form.Item>
              </Col>
              <Col span={12} style={{display:'none'}}>
                <Form.Item label="类型">
                  {initValues.type}
                </Form.Item>
              </Col>
              <Col span={12} style={{display:'none'}}>
                <Form.Item label="代码类型">
                  {initValues.codeType}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="应用类型">
                  {initValues.applyType}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="描述">
                  {initValues.descr}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="备注">
                  {initValues.comment}
                </Form.Item>
              </Col>
            </Row>
          }
          </Form>

        </Tabs.TabPane>

        <Tabs.TabPane tab="业务数据详情" key="dataInfo">
          <Row type="flex" justify="end">
            <Col><Button type="danger" onClick={()=>checkList("add", null)}>添加</Button></Col>
          </Row>
          { commonTable(columns, data, "code", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>
      </Tabs>

      <DetailModal {...{visible, handleCancel, modalProperty, entity:props.match.params.id, setDirty}}/>
    </div>
  )
}

export default React.memo(Detail)
