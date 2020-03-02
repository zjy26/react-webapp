import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, Switch, Table, Menu, Dropdown, Icon, Pagination } from 'antd';
import CycleModal from './cycleModal';

const {Option} = Select;
const PatrolPlan = props => {
  const { getFieldDecorator } = props.form;
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({  //弹窗
    showCycle: false
  });

  const handleCancel = () => {
    setVisible({
      showCycle: false
    });
  }

  //表格内单行记录操作按钮
  const recordOption = (
    <Menu>
      <Menu.Item key="1"><Link to="/detail">查看详情</Link></Menu.Item>
      <Menu.Item key="2" onClick={ ()=>{setVisible({showCycle:true})} }>编辑周期</Menu.Item>
    </Menu>
  );
  //列表条目
  const columns = [
    {
      title: '巡检名称',
      dataIndex: 'patrolName',
      render: (text, record) => {
        return (
          <Button type="link" size={'small'}><Link to="/patrolPlanDetail">{text}</Link></Button>
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
            {record.cycle === "手动" ? <Button type="link" size={'small'}>手动启动</Button> : <span style={{color:"#cfcfcf"}}>手动启动</span>}
            <Dropdown overlay={recordOption}>
              <Button>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </span>
        )
      }
    }
  ];

  //获取线路站点
  useEffect(() => {
    Axios.get('/api/lineSite').then(res =>{
      if(res.status === 200){
        setLineSite(res.data);
      }
    }).catch((err) =>{
        console.log("线路站点数据加载失败")
    });
  }, []);

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
              {getFieldDecorator('lineSite')(<Cascader options={lineSite} placeholder="请选择线路/站点" />)}
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
          <Button type="danger">新建</Button>
          </Col>
          <Col span={3}>
          <Dropdown>
            <Button type="danger">更多功能<Icon type="down" /></Button>
          </Dropdown>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="end"><Pagination total={20} showSizeChanger showQuickJumper style={{margin:30}}/></Row>

      <CycleModal visible={visible.showCycle} {...{handleCancel}}/>
    </div>
  )
}

export default Form.create()(PatrolPlan);