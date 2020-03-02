import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Select, Row, Col, Tabs, Card, Table } from 'antd';
import Axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Detail = props => {
  const [edit, setEdit] = useState({
    basicEdit: false,
    attributeEdit: false,
    paramEdit: false,
    originalEdit: false
  });
  const { getFieldDecorator } = props.form;
  const [data, setData] = useState({
    wait: [],
    already: []
  });

  const columns = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '线路',
      dataIndex: 'line',
      key: 'line',
    },
    {
      title: '站点',
      dataIndex: 'site',
      key: 'site',
    },
    {
      title: '开始时间',
      key: 'startTime',
      dataIndex: 'startTime'
    },
    {
      title: '完成时间',
      key: 'completeTime',
      dataIndex: 'completeTime'
    },
    {
      title: '停机时长',
      key: 'outageTime',
      dataIndex: 'outageTime'
    },
    {
      title: '处理人员',
      key: 'dealPeople',
      dataIndex: 'dealPeople'
    },
    {
      title: '维护描述',
      key: 'maintenanceDescr',
      dataIndex: 'maintenanceDescr'
    },
    {
      title: '处理方案',
      key: 'dealPlan',
      dataIndex: 'dealPlan'
    }
  ];

  const waitCols = [];
  waitCols.push(...columns, {
    title: '操作',
    key: 'option',
    render: () => <span>
      <Button type="link" size={'small'}>维护完成</Button>&nbsp;&nbsp;
      <Button type="link" size={'small'}>编辑</Button>
    </span>
  })

  useEffect(() => {
    Axios.get('/api/maintenance').then(res =>{
      if(res.status === 200){
        setData(res.data);
      }
    }).catch((err) =>{
        console.log("列表数据加载失败")
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs tabPosition="left" defaultActiveKey="1">
      <TabPane tab="Tab1" key="1">
        <Form {...formItemLayout} >
          <Row gutter={24}>
            <Col span={24}>
              <label style={{fontSize:18, marginRight:20}}>基本信息</label>
              {
                edit.basicEdit === false ?
                <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:true}) }}>编辑</Button> :
                <span>
                  <Button type="primary" ghost>保存</Button>
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, basicEdit:false}) }}>取消</Button>
                </span>
              }
            </Col>
            <Col span={12}>
              <Form.Item label="设备名称">
                {getFieldDecorator("objName", {
                  rules: [{required: true}],
                })(<Input placeholder="请输入设备名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="线路">
                {getFieldDecorator("line", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择线路" >
                    <Option value="1117">17号线</Option>
                    <Option value="1111">11号线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点">
                {getFieldDecorator("site", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择站点" >
                    <Option value="1">诸光路</Option>
                    <Option value="2">控制中心</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="物理位置">
                {getFieldDecorator("location", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择物理位置" >
                    <Option value="1">35kv开关柜</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型">
                {getFieldDecorator("type", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择类型" >
                    <Option value="1">机器人</Option>
                    <Option value="2">摄像机(可识别)</Option>
                    <Option value="3">摄像机(不可识别)</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌">
                {getFieldDecorator("brand", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择品牌" >
                    <Option value="1">西门子</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商">
                {getFieldDecorator("supplier")(
                  <Input placeholder="请输入供应商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商">
                {getFieldDecorator("manufacturers")(
                  <Input placeholder="请输入制造商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号">
                {getFieldDecorator("model")(
                  <Input placeholder="请输入型号" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备描述">
                {getFieldDecorator("objDescr")(
                  <Input.TextArea placeholder="请输入设备描述" />
                )}
              </Form.Item>
            </Col>
            {
              edit.basicEdit === false ?
              <div>
                <Col span={12}>
                  <Form.Item label="故障描述">
                    {getFieldDecorator("faultDescr")(
                      <Input.TextArea placeholder="请输入故障描述" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="启用时间">
                    {getFieldDecorator("startTime")(
                      <Input placeholder="请输入启用时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="停用时间">
                    {getFieldDecorator("endTime")(
                      <Input placeholder="请输入停用时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="创建时间">
                    {getFieldDecorator("createTime")(
                      <Input placeholder="请输入启用时间" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="更新时间">
                    {getFieldDecorator("updateTime")(
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
                  <Button type="primary" ghost>保存</Button>
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, paramEdit:false}) }}>取消</Button>
                </span>
              }
            </Col>
            <Col span={12}>
              <Form.Item label="体积(宽*深*高)">
                {getFieldDecorator("volume")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入尺寸" /></Col>
                    <Col span={4}>mm</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总重">
                {getFieldDecorator("weight")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总重" /></Col>
                    <Col span={4}>kg</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <label style={{fontSize:18, marginRight:20}}>属性信息</label>
              {
                edit.attributeEdit === false ?
                <Button type="primary" ghost onClick={()=>{ setEdit({...edit, attributeEdit:true}) }}>编辑</Button> :
                <span>
                  <Button type="primary" ghost>保存</Button>
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, attributeEdit:false}) }}>取消</Button>
                </span>
              }
            </Col>
            <Col span={12}>
              <Form.Item label="属性名称">
                {getFieldDecorator("attributeName")(
                  <Input placeholder="请输入属性名称" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行时长">
                {getFieldDecorator("runningTime")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总运行时长" /></Col>
                    <Col span={4}>小时</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行里程">
                {getFieldDecorator("runningMiles")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总运行里程" /></Col>
                    <Col span={4}>米</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              <label style={{fontSize:18, marginRight:20}}>固定信息</label>
              {
                edit.originalEdit === false ?
                <Button type="primary" ghost onClick={()=>{ setEdit({...edit, originalEdit:true}) }}>编辑</Button> :
                <span>
                  <Button type="primary" ghost>保存</Button>
                  <Button type="primary" ghost onClick={()=>{ setEdit({...edit, originalEdit:false}) }}>取消</Button>
                </span>
              }
            </Col>
            <Col span={12}>
              <Form.Item label="通信标识">
                {getFieldDecorator("connectLogo", {
                  rules: [{required: true}],
                })(
                  <Input placeholder="请输入通信标识" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="视频流程协议">
                {getFieldDecorator("video", {
                  initialValue: "1",
                  rules: [{required: true}],
                })(
                  <Select>
                    <Option value="HLS">HLS</Option>
                    <Option value="RTSP">RTSP</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Tab2" key="2">
        <Tabs type="card">
          <TabPane tab={`待维护`+ data.wait.length} key="wait">
            {
              data.wait.map((item, i)=>{
                return (
                  <Card key={item.code}>
                    <Table rowKey="code" columns={waitCols} dataSource={data.wait[i]} pagination={false}/>
                    <Row type="flex" justify="end">
                      <Col span={3}>
                        <label>负责人：</label>
                        <label>{item[0].responsibility}</label>
                      </Col>
                      <Col span={5}>
                        <label>创建时间：</label>
                        <label>{item[0].createTime}</label>
                      </Col>
                      <Col span={5}>
                        <label>更新时间：</label>
                        <label>{item[0].updateTime}</label>
                      </Col>
                    </Row>
                  </Card>
                )
              })
            }
          </TabPane>
          <TabPane tab={`已维护`+ data.already.length} key="already">
            {
              data.already.map((item, i)=>{
                return (
                  <Card key={item.code}>
                    <Table rowKey="code" columns={columns} dataSource={data.already[i]} pagination={false} />
                    <Row type="flex" justify="end">
                      <Col span={3}>
                        <label>负责人：</label>
                        <label>{item[0].responsibility}</label>
                      </Col>
                      <Col span={5}>
                        <label>创建时间：</label>
                        <label>{item[0].createTime}</label>
                      </Col>
                      <Col span={5}>
                        <label>更新时间：</label>
                        <label>{item[0].updateTime}</label>
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
  )
}

export default Form.create()(Detail);