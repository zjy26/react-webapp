import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, Switch, Table, Menu, Dropdown, Icon, Pagination } from 'antd';
import CycleModal from './cycleModal';
import DetailModal from './detailModal';
import ImportModal from '../common/importModal';
import AuditModal from '../common/auditModal';
import { connect } from "react-redux"

const {Option} = Select;
const PatrolPlan = props => {
  const { getFieldDecorator } = props.form;
  const [data, setData] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  const [itemValues, setItemValues] = useState([]);  //详情数据
  const [visible, setVisible] = useState({  //弹窗
    showCycle: false,
    showDetail: false,
    showImport: false,
    showAudit: false
  });
  const childRef = useRef();
  const [modalStatus, setModalStatus] = useState("check");  //弹窗状态（查看/新建）

  const handleCancel = () => {
    setVisible({
      showCycle: false,
      showDetail: false,
      showImport: false,
      showAudit: false
    });
  }

  //更多功能按钮
  const menu = (
    <Menu>
      <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})} }>信息导入</Menu.Item>
      <Menu.Item key="download">下载</Menu.Item>
      <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})} }>审计</Menu.Item>
    </Menu>
  );

  //列表条目
  const columns = [
    {
      title: '巡检名称',
      dataIndex: 'patrolName',
      render: (text, record) => {
        return (
          <Button type="link" size={'small'} onClick={()=>{checkDetail(record.id)}}>{text}</Button>
        )
      }
    },
    {
      title: '线路',
      dataIndex: 'line',
    },
    {
      title: '站点',
      dataIndex: 'site',
    },
    {
      title: '巡检人',
      dataIndex: 'patrolPeople',
    },
    {
      title: '周期',
      dataIndex: 'cycle',
    },
    {
      title: '计划状态',
      dataIndex: 'status',
      render: (text)=> {
        return (
          <Switch checkedChildren="使用" unCheckedChildren="停用" checked={text}/>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Dropdown 
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={()=>{checkDetail(record.id)}}>查看详情</Menu.Item>
                  <Menu.Item key="2" onClick={()=>{setVisible({showCycle:true})}}>编辑周期</Menu.Item>
                  <Menu.Item key="3">手动启动</Menu.Item>
                </Menu>
              }
            >
              <Button>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        )
      }
    }
  ];

  //获取列表数据
  useEffect(() => {
    Axios.get('/api/patrolPlanList').then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  //查看详情
  const checkDetail = (id)=>{
    setModalStatus("check");
    Axios.get('/api/patrolPlanList/'+id)
    .then((res) =>{
      if(res.status === 200){
        setItemValues(res.data);
        setVisible({...visible, showDetail:true});
        childRef.current.check();
      }
    })
  }

  //新建巡检单
  const newPatrolPlan = ()=> {
    setModalStatus("add");
    childRef.current.resetForm();
    setVisible({...visible, showDetail:true});
  }

  return (
    <div>
      <Form layout="inline" style={{margin: 30}}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('planName')(<Input placeholder="请输入计划名称" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('creator')(<Input placeholder="请输入计划创建人姓名" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('patrolpeople')(<Input placeholder="请输入计划巡检人姓名" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('lineSite')(<Cascader options={props.locationTree.lineSite} placeholder="请选择线路/站点" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('cycle')(
                <Select placeholder="请选择周期" style={{ width: 160 }}>
                  <Option value="1">手动</Option>
                  <Option value="2">日</Option>
                  <Option value="3">月</Option>
                  <Option value="4">周</Option>
                  <Option value="5">年月</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Row>
      </Form>

      <Row type="flex" justify="end">
        <Col span={2}>
          <Button type="danger" onClick={newPatrolPlan}>新建</Button>
          </Col>
          <Col span={3}>
          <Dropdown overlay={menu}>
            <Button type="danger">更多功能<Icon type="down" /></Button>
          </Dropdown>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="end"><Pagination total={20} showSizeChanger showQuickJumper style={{margin:30}}/></Row>

      <DetailModal visible={visible.showDetail} {...{itemValues, modalStatus, handleCancel}} wrappedComponentRef={childRef}/>
      <CycleModal visible={visible.showCycle} {...{handleCancel}}/>
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
    </div>
  )
}

const stateToProp = state => ({
  locationTree: state.locationTree
})

export default connect(stateToProp)(Form.create()(PatrolPlan))