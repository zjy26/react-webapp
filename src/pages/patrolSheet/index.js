import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, Table, Tag, Menu, Dropdown, Icon } from 'antd';
import DetailModal from './detailModal';
import AddModal from './addModal';
import CancelModal from './cancelModal';
import AbnormalModal from './abnormalModal';
import ImportModal from '../common/importModal';
import AuditModal from '../common/auditModal';

const { Option } = Select;
const brands = [];
for (let i = 10; i < 36; i++) {
  brands.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const { CheckableTag } = Tag;
const PatrolSheet = props => {
  const { getFieldDecorator } = props.form;
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //列表数据
  const [itemValues, setItemValues] = useState([]);  //详情数据
  const [tagChecked, setTagChecked] = useState({  //筛选标签选择状态
    all: true,
    wait: true,
    patrol: true,
    finish: true,
    cancel: true,
    close: true
  });
  const [visible, setVisible] = useState({  //弹窗
    showDetail: false,
    showAdd: false,
    showCancel: false,
    showAbnormal: false,
    showImport: false,
    showAudit: false
  });
  const [loading, setLoading] = useState(true);
  const childRef = useRef();
  const editRef = useRef();

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showDetail: false,
      showAdd: false,
      showCancel: false,
      showAbnormal: false,
      showImport: false,
      showAudit: false
    });
  }

  //查看详情
  const checkDetail = (id)=>{
    Axios.get('/api/patrolSheetList/'+id)
    .then((res) =>{
      if(res.status === 200){
        setItemValues(res.data);
        setVisible({...visible, showDetail:true});
        childRef.current.check();
      }
    })
  }

  //新建
  const newModal = () => {
    setVisible({...visible, showAdd: true});
  }

  //编辑巡检
  const edit = (id)=> {
    Axios.get('/api/patrolSheetList/'+id)
    .then((res) =>{
      if(res.status === 200){
        setItemValues(res.data);
        setVisible({...visible, showAdd: true});
        editRef.current.edit();
      }
    })
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
      title: '名称',
      dataIndex: 'name',
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
      title: '负责人',
      dataIndex: 'patrolPeople',
    },
    {
      title: '巡检时间',
      dataIndex: 'patrolTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '巡检结果',
      dataIndex: 'result',
      render: (text, record) => {
        return (
        text==="异常" ?
        <Button type="link" size={'small'} onClick={()=>{setVisible({...visible, showAbnormal:true})}}>{text}</Button>:
        <span>{text}</span>
        )
      }
    },
    {
      title: '人工确定',
      dataIndex: 'handleConfirm',
    },
    {
      title: '取消原因',
      dataIndex: 'CancelReason',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={()=>{setVisible({...visible, showCancel:true})}}>取消巡检</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{edit(record.id)}}>编辑巡检</Button>
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
    Axios.get('/api/patrolSheetList').then(res =>{
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
              {getFieldDecorator('name')(
                <Input placeholder="请输入巡检单名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('patrolPeople')(
                <Input placeholder="请输入负责人姓名" />
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('patrolResult')(
                <Select placeholder="请选择巡检结果" style={{width:160}} >
                  <Option value="1">异常</Option>
                  <Option value="2">正常</Option>
                  <Option value="3">无结果</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('lineSite')(
                <Cascader options={lineSite} placeholder="请选择线路/站点" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('rangeData')(
                <DatePicker.RangePicker />
              )}
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Row>
      </Form>

      <div>
        <Row>
          <Col span={2} style={{textAlign: "center"}}><label>标签:</label></Col>
          <Col span={17}>
            <CheckableTag checked={tagChecked.all} onChange={(checked)=>{setTagChecked({all: checked, wait: checked, patrol: checked, finish: checked, cancel: checked, close: checked})}}>全部</CheckableTag>
            <CheckableTag checked={tagChecked.wait} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, wait: checked})}}>待巡检</CheckableTag>
            <CheckableTag checked={tagChecked.patrol} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, patrol: checked})}}>巡检中</CheckableTag>
            <CheckableTag checked={tagChecked.finish} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, finish: checked})}}>已完成</CheckableTag>
            <CheckableTag checked={tagChecked.cancel} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, cancel: checked})}}>已取消</CheckableTag>
            <CheckableTag checked={tagChecked.close} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, close: checked})}}>已关闭</CheckableTag>
          </Col>
          <Col span={2}>
            <Button type="danger" onClick={newModal}>新建</Button>
            </Col>
            <Col span={3}>
            <Dropdown overlay={menu}>
              <Button type="danger">更多功能<Icon type="down" /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <Table columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      
      <DetailModal visible={visible.showDetail} {...{itemValues, handleCancel}} wrappedComponentRef={childRef}/>
      <AddModal visible={visible.showAdd} {...{itemValues, handleCancel}} wrappedComponentRef={editRef}/>
      <CancelModal visible={visible.showCancel} {...{handleCancel}}/>
      <AbnormalModal visible={visible.showAbnormal} {...{handleCancel}}/>
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
    </div>
  )
}

export default Form.create()(PatrolSheet);