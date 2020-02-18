import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, InputNumber, Table, Checkbox, Tag, Menu, Dropdown, Icon, Pagination } from 'antd';
import AddModal from './addModal';
import ImportModal from './importModal';
import AuditModal from './auditModal';
import AddRecordModal from './addRecordModal';
import ChangeStatusModal from './changeStatusModal';
import EditModal from './editModal'

//列表逐条数据选择
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};

const { Option } = Select;
const brands = [];
for (let i = 10; i < 36; i++) {
  brands.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const { CheckableTag } = Tag;
const ObjectModule = props => {
  const { getFieldDecorator } = props.form;
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //列表数据
  const [tagChecked, setTagChecked] = useState({  //筛选标签选择状态
    all: true,
    free: true,
    patrol: true,
    control: true,
    maintenance: true,
    fault: true,
    stop: true
  });
  const [time, setTime] = useState("3");  //维护时间间隔
  const [mile, setMile] = useState("3");  //维护里程间隔
  const [visible, setVisible] = useState({  //弹窗
    showAdd: false,
    showImport: false,
    showAudit: false,
    showAddRecord: false,
    showChangeStatus: false,
    showEdit: false
  });
  const [loading, setLoading] = useState(true);

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showAdd: false,
      showImport: false,
      showAudit: false,
      showAddRecord: false,
      showChangeStatus: false,
      showEdit: false
    });
  }
  const handleOk = (values) => {
    //新增数据
    const newListValues = {...values, status:"空闲中", id:data.length+1, key: data.length+1};
    Axios.post('/api/objectList', newListValues
    ).then((res)=>{
      setVisible({...visible, showAdd:false});
      setLoading(true);
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

  //表格内单行记录操作按钮
  const recordOption = (
    <Menu>
      <Menu.Item key="1" onClick={ ()=>{setVisible({...visible, showChangeStatus:true})} }>变更状态</Menu.Item>
      <Menu.Item key="2"><Link to="/detail">查看详情</Link></Menu.Item>
      <Menu.Item key="3" onClick={ ()=>{setVisible({...visible, showAddRecord:true})} }>添加维护记录</Menu.Item>
    </Menu>
  );

  //列表条目
const columns = [
  {
    title: '设备名称',
    dataIndex: 'objName',
    render: (text, record) => {
      return (
        record.status ==="维护中" ? <span><label style={{color:"#ff0000"}}>维护</label>&nbsp;&nbsp;<a><Link to="/detail">{text}</Link></a></span> : <a>{text}</a>
      )
    }
  },
  {
    title: '编号',
    dataIndex: 'number',
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
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '型号',
    dataIndex: 'model',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '维护/故障数',
    dataIndex: 'fault',
  },
  {
    title: '启用日期',
    dataIndex: 'startTime',
  },
  {
    title: '停用日期',
    dataIndex: 'endTime',
  },
  {
    title: '维护时间间隔',
    dataIndex: 'timeRange',
  },
  {
    title: '维护里程间隔',
    dataIndex: 'milesRange',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'option',
    render: () => {
      return (
        <span>
          <a>查看视频</a>
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
    Axios.get('/api/objectList').then(res =>{
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
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('objectName', {
                rules: [],
              })(
                <Input placeholder="请输入设备名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('brand', {
                rules: [],
              })(
                <Select placeholder="请输入设备品牌" style={{ width: 200 }} showSearch>
                  {brands}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('lineSite', {
                rules: [],
              })(
                <Cascader options={lineSite} placeholder="请选择线路/站点" />,
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {getFieldDecorator('startDate', {
                rules: [],
              })(
                <DatePicker placeholder="请选择启用日期" />
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item>
              {getFieldDecorator('stopDate', {
                rules: [],
              })(
                <DatePicker placeholder="请选择停用日期" />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('mileage', {
                rules: [],
              })(
                <Select placeholder="维护里程间隔" style={{ width: 160 }} onChange={(value)=>{setMile(value)}}>
                  <Option value="1">维护里程间隔大于</Option>
                  <Option value="2">维护里程间隔小于</Option>
                  <Option value="3">维护里程间隔介于</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('mileNum')(
                mile ==="3" ? <InputNumber /> : <span><InputNumber />~<InputNumber /></span>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              {getFieldDecorator('timeRange', {
                rules: [],
              })(
                <Select placeholder="维护时间间隔" style={{ width: 160 }} onChange={(value)=>{setTime(value);}}>
                  <Option value="1">维护时间间隔大于</Option>
                  <Option value="2">维护时间间隔小于</Option>
                  <Option value="3">维护时间间隔介于</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('timeNum')(
                time ==="3" ? <InputNumber /> : <span><InputNumber />~<InputNumber /></span>,
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
            <CheckableTag checked={tagChecked.all} onChange={(checked)=>{setTagChecked({all: checked, free: checked, patrol: checked, control: checked, maintenance: checked, fault: checked, stop: checked})}}>全部</CheckableTag>
            <CheckableTag checked={tagChecked.free} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, free: checked})}}>空闲中</CheckableTag>
            <CheckableTag checked={tagChecked.patrol} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, patrol: checked})}}>巡检中</CheckableTag>
            <CheckableTag checked={tagChecked.control} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, control: checked})}}>控制中</CheckableTag>
            <CheckableTag checked={tagChecked.maintenance} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, maintenance: checked})}}>维护中</CheckableTag>
            <CheckableTag checked={tagChecked.fault} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, fault: checked})}}>故障中</CheckableTag>
            <CheckableTag checked={tagChecked.stop} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, stop: checked})}}>已停用</CheckableTag>
          </Col>
          <Col span={2}>
            <Button type="danger" onClick={ () => {setVisible({showAdd: true})} }>新建</Button>
            </Col>
            <Col span={3}>
            <Dropdown overlay={menu}>
              <Button type="danger">更多功能<Icon type="down" /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
          <Checkbox>全选</Checkbox>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showChangeStatus:true})} }>批量变更</Button>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showEdit:true})} }>批量修改</Button>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showAddRecord:true})} }>添加维护记录</Button>
          <Button type="danger" ghost>维护完成</Button>
        </Col>
        <Col><Pagination total={20} showSizeChanger showQuickJumper /></Col>
      </Row>

      <AddModal visible={visible.showAdd} {...{handleOk, handleCancel}} />
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
      <AddRecordModal visible={visible.showAddRecord} {...{handleCancel}}/>
      <ChangeStatusModal visible={visible.showChangeStatus} {...{handleCancel}}/>
      <EditModal visible={visible.showEdit} {...{handleCancel}}/>
    </div>
  )
}

export default Form.create()(ObjectModule);