import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Row, Col, Table, Collapse, Breadcrumb } from 'antd';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { patrolSheet, locationTree } from '../../../api'
import moment from 'moment'
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
  { title: '设备', dataIndex: 'objectDesc', key: 'objectDesc' },
  { title: '巡检项总数', dataIndex: 'itemTotal', key: 'itemTotal' },
  { title: '未检出数量', dataIndex: 'noResult', key: 'noResult' },
  { title: '异常数量', dataIndex: 'isError', key: 'isError' },
  { title: '未检出率', dataIndex: 'noResultPre', key: 'noResultPre' },
  { title: '异常率', dataIndex: 'isErrorPre', key: 'isErrorPre' }
]

//巡检明细
const detailColumns = [
  { title: '巡检项目', dataIndex: 'itemName', key: 'itemName' },
  { title: '巡检标准', dataIndex: 'standard', key: 'standard' },
  { title: '巡检值', dataIndex: 'patrolResult', key: 'patrolResult' },
  { title: 'CIOS对应值', dataIndex: 'cios', key: 'cios' },
  { title: '判定结果', dataIndex: 'isError', key: 'isError', render: (text, record) => {return (record.isError ? "正常":"异常")}},
  { title: '数据采集时间', dataIndex: 'dataTime', key: 'dataTime', render: (text, record) => moment(record.dataTime).format('YYYY-MM-DD HH:mm')}
];

const Detail = (props) => {
  const [form] = Form.useForm()
  const [data, setData] = useState({
    contentData: [],
    detailData: []
  })
  const [loading, setLoading] = useState(true)
  const [desc, setDesc] = useState()

  useEffect(() => {
    document.title = "查看详情"
    setLoading(true)
    //查看详情
    patrolSheet.patrolSheetDetail(props.match.params.id).then((res) =>{
      let site = res.site
      locationTree({line:site.slice(0,4)})
      .then(res =>{
        if(res){
          form.setFieldsValue({
            siteLine:res.lineSite[0].label,
            siteStation:(res.lineSite[0].children.filter(item => item.value === site))[0].label
          })
        }
      }).catch((err) =>{
        console.log("线路站点数据加载失败")
      })
      if(res && res.robotOrderLocObjItems[0] && res.robotOrderLocObjItems[0].objectItems){
        setDesc(res.desc)
        form.setFieldsValue({
          ...res,
          peopleName: res.people.name,
          patrolDate: moment(res.patrolDate).format('YYYY-MM-DD HH:mm')
        })
        setData({
          contentData: res.robotOrderLocObjItems[0],
          detailData: res.robotOrderLocObjItems[0].objectItems
        })
        setLoading(false)
      }
    })
  }, [props.match.params.id,form])

  return (
    <div>
      <Breadcrumb style={{margin: 30, fontSize: 20}}>
        <Breadcrumb.Item><Link to="/patrol-sheet">巡检单</Link></Breadcrumb.Item>
        <Breadcrumb.Item>查看详情</Breadcrumb.Item>
      </Breadcrumb>
      <h2 style={{textAlign: 'center', marginTop:30}}>{desc}</h2>
      <Form {...formItemLayout} type="flex" justify="space-between" className={styles.detailForm} form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="巡检单号" name="code">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="负责人" name="peopleName">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检线路" name="siteLine">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检站点" name="siteStation">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检房间" name="patrolLocNum">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检设备" name="objectNum">
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检时间" name="patrolDate">
              <Input disabled/>
            </Form.Item>
        </Col>
        </Row>
      </Form>

      <h3 style={{marginLeft:"10%"}}>巡检内容</h3>
      <Table
        loading={loading}
        rowKey="objectCode"
        columns={contentColumns}
        dataSource={data.contentData.objectItems}
        pagination={false}
        size="small"
        style={{width:"80%", margin:"0 auto"}}
        title={() => {
          return(
            <Row style={{fontWeight:"bold"}}>
              <Col span={10} offset={2}>房间：{data.contentData.robotPatrolLocDesc}</Col>
              <Col span={4} offset={8}>设备数量：{data.contentData.objectNum}</Col>
            </Row>
          )
        }}
      />

      <h3 style={{marginLeft:"10%", marginTop:30}}>巡检明细</h3>

      <Collapse defaultActiveKey={['0']} style={{width:"80%", margin:"0 auto"}}>
        {data.detailData.map((item,index)=>{
          return(
            <Panel key={index}
              header={
                <Row style={{fontWeight:"bold"}}>
                  <Col span={7} offset={1}>房间：{data.contentData.robotPatrolLocDesc}</Col>
                  <Col span={8}>巡检设备数：{data.contentData.objectNum} </Col>
                  <Col span={8}>设备：{item.objectDesc}</Col>
                  <Col span={5} offset={1}>巡检项总数：{item.itemTotal}</Col>
                  <Col span={6}>未检出数量：{item.noResult}</Col>
                  <Col span={6}>巡检出数量：{item.result}</Col>
                  <Col span={6}>巡检异常率：{item.isErrorPre}</Col>
                </Row>
              }
            >
              <Table
                loading={loading}
                rowKey='key'
                columns={detailColumns}
                dataSource={item.robotItem}
                size="small"
                pagination={false} />
            </Panel>
          )
        })}
      </Collapse>
      <Row style={{margin:30}}>
      <Col span={3} offset={10}><Button type="danger" ghost onClick={props.handleCancel}><Link to={props.match.params.site !== 'patrolSheet'?"/robot-patrol-order-site-detail/"+props.match.params.site+"/"+props.match.params.day :"/patrol-sheet"}>返回</Link></Button></Col>
          <Button type="link" size={'small'}></Button>
          <Col span={3}><Button type="danger" ghost>下载</Button></Col>
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree,
  }
}

export default connect(mapStateToProps, null)(React.memo(Detail))
