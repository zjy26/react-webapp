import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Input, Row, Col, Table, Collapse } from 'antd';

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
const { Panel } = Collapse;

//巡检内容
const contentColumns = [
  { title: '设备', dataIndex: 'object', key: 'object' },
  { title: '巡检项总数', dataIndex: 'totalNum', key: 'totalNum' },
  { title: '未检出数量', dataIndex: 'normalNum', key: 'normalNum' },
  { title: '异常数量', dataIndex: 'abnormalNum', key: 'abnormalNum' },
  { title: '未检出率', dataIndex: 'normalRate', key: 'normalRate' },
  { title: '异常率', dataIndex: 'abnormalRate', key: 'abnormalRate' }
]

//巡检明细
const detailColumns = [
  { title: '巡检项目', dataIndex: 'project', key: 'project' },
  { title: '巡检标准', dataIndex: 'standard', key: 'standard' },
  { title: '巡检值', dataIndex: 'value', key: 'value' },
  { title: 'CIOS对应值', dataIndex: 'cios', key: 'cios' },
  { title: '判定结果', dataIndex: 'result', key: 'result' },
  { title: '数据采集时间', dataIndex: 'time', key: 'time' }
];

const PatrolSheetDetail = props => {
  const { getFieldDecorator } = props.form;
  const [data, setData] = useState({
    contentData: [],
    detailData: []
  });
  const [loading, setLoading] = useState(true);
  
  //获取巡检内容列表数据
  useEffect(() => {
    Axios.get('/api/patrolContentList').then(res =>{
      if(res.status === 200){
        setData({...data, contentData:res.data});
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  //获取巡检明细列表数据
  useEffect(() => {
    Axios.get('/api/patrolDetailList').then(res =>{
      if(res.status === 200){
        setData({...data, detailData:res.data});
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  Axios.get('/api/patrolSheetList').then(res =>{
    if(res.status === 200){
      props.form.setFieldsValue(res.data[0]);
    }
  });
  
  return (
    <div>
      <h2 style={{textAlign: 'center', marginTop:30}}>虹桥火车站巡检单</h2>
      <Form {...formItemLayout} type="flex" justify="space-between"  style={{width:"80%", marginLeft:"5%"}}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="巡检单号">
              {getFieldDecorator("patrolName")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="负责人">
              {getFieldDecorator("patrolPeople")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检线路">
              {getFieldDecorator("line")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检站点">
              {getFieldDecorator("site")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检房间">
              {getFieldDecorator("room")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检设备">
              {getFieldDecorator("object")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检时间">
              {getFieldDecorator("patrolTime")(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <h3 style={{marginLeft:"10%"}}>巡检内容</h3>
      <Table
        columns={contentColumns}
        dataSource={data.contentData}
        pagination={false}
        size="small"
        style={{width:"80%", margin:"0 auto"}}
        title={() => {
          return(
            <Row style={{fontWeight:"bold"}}>
              <Col span={10} offset={2}>房间：直流开关柜</Col>
              <Col span={4} offset={8}>设备数：111</Col>
            </Row>
          )
        }}
      />

      <h3 style={{marginLeft:"10%", marginTop:30}}>巡检明细</h3>
    
      <Collapse defaultActiveKey={['1']} style={{width:"80%", margin:"0 auto"}}>
        <Panel key="1" 
          header={
            <Row style={{fontWeight:"bold"}}>
              <Col span={7} offset={1}>房间：直流开关柜</Col>
              <Col span={8}>巡检设备数：111 </Col>
              <Col span={8}>设备：直流开关柜</Col>
              <Col span={5} offset={1}>巡检项总数：12</Col>
              <Col span={6}>未检出数量：3</Col>
              <Col span={6}>巡检出数量：8</Col>
              <Col span={6}>巡检异常率：75%</Col>
            </Row>
          }
        >
          <Table
            columns={detailColumns}
            dataSource={data.detailData}
            size="small"
            pagination={false} />
        </Panel>
      </Collapse>
      <Row style={{margin:30}}>
        <Col span={2} offset={10}><Button type="danger" ghost><Link to="/patrolSheet">返回</Link></Button></Col>
        <Col span={2}><Button type="danger" ghost>下载</Button></Col>
      </Row>
    </div>
  )
}

export default Form.create()(PatrolSheetDetail);