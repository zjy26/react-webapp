import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Input, Select, Row, Col, Tabs } from 'antd';
import { connect } from 'react-redux'
import { robotPlan } from '../../../api'

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
  const locationTree = props.location

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [edit, setEdit] = useState(false)
  const [activeKey, setActiveKey] = useState("bascInfo")  //设置显示tab

  useEffect(() => {
    document.title = "查看详情"
    const locationTreeFlg = locationTree.toJS()

    if(locationTreeFlg.site) {
      robotPlan.robotPlanDetail(props.match.params.id)
      .then(res=> {
        const site = locationTreeFlg.site
        const item = site.find(item=> item.value === res.site)
        setInitValues({
          ...res,
          siteDesc: item.label,
          line: res.site.slice(0,4)
        })
        form.resetFields()
      })
      .catch(()=>{
        console.log("巡检计划详情获取失败")
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationTree, edit])

  return (
    <div>
      <Button><Link to="/patrol-plan">返回</Link></Button>
      <Tabs tabPosition="left" activeKey={activeKey} onChange={(key)=>{setActiveKey(key)}} style={{margin:30}}>
        <TabPane tab="基本信息" key="bascInfo">
          <Form form={form} {...formItemLayout} initialValues={initValues}>
              <Row>
                <Col span={2}><label style={{fontSize:18}}>基本信息</label></Col>
                <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(true)}}>编辑</Button></Col>
              </Row>
              <Row gutter={24}>
                {
                  edit ?
                  <React.Fragment>
                    <Col span={12}>
                      <Form.Item label="计划名称" name="desc" rules={[{required: true}]}>
                        <Input placeholder="请输入计划名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="线路" name="line">
                        <Select placeholder="请选择线路">
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
                        <Select placeholder="请选择站点" >
                          {locationTree.toJS().site && locationTree.toJS().site.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="负责人" name="patrolPeople">
                        <Input placeholder="请输入负责人姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <label style={{fontSize:18, marginRight:20}}>计划周期</label>
                    </Col>
                  </React.Fragment> :
                  <React.Fragment>
                    <Col span={12}>
                      <Form.Item label="计划名称">
                        {initValues.desc}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="线路">
                        {initValues.lineDesc}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="站点">
                        {initValues.siteDesc}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="负责人">
                        {initValues.patrolPeople}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <label style={{fontSize:18, marginRight:20}}>计划周期</label>
                    </Col>
                  </React.Fragment>
                }
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

const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location'])
})

export default connect(mapStateToProps, null)(React.memo(PatrolPlanDetail))
