import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Axios from 'axios';
import { Modal, Form, Button, Input, Row, Col, Table, Collapse } from 'antd';
import styles from './PatrolSheet.module.scss';

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


const DetailModal = (props, ref) => {
  const { getFieldDecorator } = props.form;
  const [data, setData] = useState({
    contentData: [],
    detailData: []
  });
  const [loading, setLoading] = useState(true);
  const [obj, setObj] = useState({});
  const modalRef = useRef();
  
  useImperativeHandle(ref, () => {
    //暴露给父组件的方法
    return {
      check() {
        setObj(props.itemValues);
      }
    }
  });

  //获取列表数据
  useEffect(() => {
    Axios.get('/api/patrolDetailList').then(res =>{
      if(res.status === 200){
        setData({
          contentData: res.data.content,
          detailData: res.data.detail
        });
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  return (
    <Modal
      closable={false}
      footer={null}
      width={document.body.clientWidth-100}
      visible={props.visible}
      onCancel={props.handleCancel}
      itemValues = {props.itemValues}
      ref = { modalRef }
    >
      <div>
        <h2 style={{textAlign: 'center', marginTop:30}}>虹桥火车站巡检单</h2>
        <Form {...formItemLayout} type="flex" justify="space-between" className={styles.detailForm}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="巡检单号">
                {getFieldDecorator("patrolName", {
                  initialValue: obj.patrolName,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="负责人">
                {getFieldDecorator("patrolPeople", {
                  initialValue: obj.patrolPeople,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检线路">
                {getFieldDecorator("line", {
                  initialValue: obj.line,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检站点">
                {getFieldDecorator("site", {
                  initialValue: obj.site,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检房间">
                {getFieldDecorator("room", {
                  initialValue: obj.room,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检设备">
                {getFieldDecorator("object", {
                  initialValue: obj.object,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="巡检时间">
                {getFieldDecorator("patrolTime", {
                  initialValue: obj.patrolTime,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <h3 style={{marginLeft:"10%"}}>巡检内容</h3>
        <Table
          rowKey="code"
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
              rowKey="code"
              columns={detailColumns}
              dataSource={data.detailData}
              size="small"
              pagination={false} />
          </Panel>
        </Collapse>
        <Row style={{margin:30}}>
          <Col span={2} offset={10}><Button type="danger" ghost onClick={props.handleCancel}>返回</Button></Col>
          <Col span={2}><Button type="danger" ghost>下载</Button></Col>
        </Row>
      </div>
    </Modal>
  )
}

export default Form.create()(forwardRef(DetailModal));