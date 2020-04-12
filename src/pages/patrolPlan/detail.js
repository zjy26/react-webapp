import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Breadcrumb, Form, Button, Input, Select, Row, Col, Tabs } from 'antd'
import { connect } from 'react-redux'

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

const PatrolPlanDetail = (props) => {
  const { getFieldDecorator } = props.form
  const [activeKey, setActiveKey] = useState("bascInfo")  //设置显示tab
  const [obj, setObj] = useState({})
  useEffect(() => {
    document.title = "查看详情"
    setObj({})
  }, [])

  return (
    <div>
      <Breadcrumb style={{margin: 30, fontSize: 20}}>
        <Breadcrumb.Item><Link to="/patrol-plan">巡检计划</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
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

                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="负责人">
                    {getFieldDecorator("patrolPeople", {
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
                    {getFieldDecorator('cycle', {
                      initialValue: obj.cycle,
                      rules: [{required: true}],
                    })(
                      <Select placeholder="请选选周期">

                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row type="flex" justify="end">
              <Col span={2}><Button onClick={props.handleCancel}>取消</Button></Col>
              <Col span={2}><Button type="danger" onClick={()=>{setActiveKey("objectInfo")}}>下一步</Button></Col>
            </Row>
        </TabPane>
        <TabPane tab="设备信息" key="objectInfo">

        </TabPane>
      </Tabs>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree
  }
}

export default connect(mapStateToProps, null)(React.memo(Form.create()(PatrolPlanDetail)))
