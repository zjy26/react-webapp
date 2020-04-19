import React, {useState, useEffect} from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tabs, Input, Button, Select, Row, Col, Divider, Radio, Modal, message } from 'antd';
import { Link } from 'react-router-dom'
import DetailModal from './detailModal'
import {commonTable } from '../../common/table'

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
  const {getFieldDecorator} = props.form
  const [obj, setObj] = useState({})
  const [edit, setEdit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("添加")
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

  //列表编辑
  const editList = (id) => {
    setModalTitle("编辑")
    setVisible(true)
  }

  //查看详情
  const checkList = (id) => {
    setModalTitle("查看详情")
    setVisible(true)
  }

  //删除
  const deleteList = (id) => {
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

  const columns = [
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
      dataIndex: 'status'
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
            <Button type="link" size={'small'} onClick={()=>{checkList(record.id)}}>查看详情</Button>
            <Divider type="vertical" />
            <Button type="link" size={'small'} onClick={()=>{editList(record.id)}}>编辑</Button>
            <Divider type="vertical" />
            <Button type="link" size={'small'} onClick={()=>{deleteList(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  useEffect(()=>{
    document.title = "系统配置详情"
    setObj({})
    setLoading(false)
  }, [dirty])

  //添加
  const addItem = () => {
    setModalTitle("添加")
    setVisible(true)
  }

  //基本信息编辑保存
  const save = () => {

  }

  return (
    <div>
      <Button><Link to="/config/config-info">返回</Link></Button>

      <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}}>
        <Tabs.TabPane tab="基础信息" key="bascInfo">
          <Row>
            <Col span={2}><label style={{fontSize:18}}>基本信息</label></Col>
            {
              edit === false ?
              <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(true)}}>编辑</Button></Col> :
              <span>
                <Col span={2}><Button type="primary" ghost onClick={save}>保存</Button></Col>
                <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(false)}}>取消</Button></Col>
              </span>
            }
          </Row>
          <Row>
            {
              edit === false ?
              <Form {...formItemLayout} >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="实体名称">
                      {getFieldDecorator("name", {
                        initialValue: obj.name,
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="描述">
                      {getFieldDecorator("descr", {
                        initialValue: obj.descr,
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="类型">
                      {getFieldDecorator("type", {
                        initialValue: obj.type,
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="代码类型">
                      {getFieldDecorator("codeType", {
                        initialValue: obj.codeType,
                      })(<Input disabled/>)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注">
                      {getFieldDecorator("comment", {
                        initialValue: obj.comment,
                      })(<Input.TextArea disabled/>)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form> :
              <Form {...formItemLayout} >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="实体名称">
                      {getFieldDecorator("name", {
                        initialValue: obj.name,
                      })(<Input placeholder="请输入实体名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="描述">
                      {getFieldDecorator("descr", {
                        initialValue: obj.descr,
                      })(<Input placeholder="请输入描述" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="类型">
                      {getFieldDecorator("type", {
                        initialValue: obj.type,
                      })(
                      <Radio.Group>
                        <Radio value={1}>代码</Radio>
                        <Radio value={2}>分类</Radio>
                      </Radio.Group>)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="代码类型">
                      {getFieldDecorator("codeType", {
                        initialValue: obj.codeType,
                      })(<Select placeholder="请选择代码类型" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="备注">
                      {getFieldDecorator("comment", {
                        initialValue: obj.comment,
                      })(<Input.TextArea placeholder="请输入备注" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            }
          </Row>
        </Tabs.TabPane>

        <Tabs.TabPane tab="业务数据详情" key="dataInfo">
          <Row type="flex" justify="end">
            <Col><Button type="danger" onClick={addItem}>添加</Button></Col>
          </Row>
          { commonTable(columns, [{name:11}], "name", loading, setDirty, pager, setPager, {}) }
        </Tabs.TabPane>
      </Tabs>

      <DetailModal {...{visible, handleCancel, modalTitle}}/>
    </div>
  )
}

export default React.memo(Form.create()(Detail))
