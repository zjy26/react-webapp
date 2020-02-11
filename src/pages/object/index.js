import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, InputNumber, Table, Checkbox, Tag  } from 'antd';
const columns = [
  {
    title: '设备名称',
    dataIndex: 'objName',
    render: text => <a>{text}</a>,
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
  }
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};
const lineSiteOptions = [
  {
    value: '1117',
    label: '17号线',
    children: [
      {
        value: '111701',
        label: '控制中心'
      }, {
        value: '111702',
        label: '虹桥火车站'
      }, {
        value: '111703',
        label: '诸光路'
      }
    ]
  },
  {
    value: '1102',
    label: '2号线',
    children: [
      {
        value: '110201',
        label: '中山公园'
      }, {
        value: '110202',
        label: '人民广场'
      }
    ]
  }
];
const { Option } = Select;
const brands = [];
for (let i = 10; i < 36; i++) {
  brands.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
const { RangePicker } = DatePicker;
const ObjectModule = props => {
  const { getFieldDecorator } = props.form;
  const [data, setData] = useState([]);
  useEffect(() => {
    Axios.get('/api/objectList').then(res =>{
      if(res.status === 200){
        setData(res.data);
      }
    }).catch((err) =>{
        console.log("数据加载失败")
    });
  }, []);

  return (
    <div>
      <Form layout="inline">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item>
              {getFieldDecorator('objectName', {
                rules: [],
              })(
                <Input placeholder="请输入设备名称" />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item>
              {getFieldDecorator('lineSite', {
                rules: [],
              })(
                <Cascader options={lineSiteOptions} placeholder="请选择线路/站点" />,
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              {getFieldDecorator('rangeDate', {
                rules: [],
              })(
                <RangePicker
                  dateFormat ="YYYY-MM-DD"
                  placeholder={['启用日期', '停用日期']}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item>
              {getFieldDecorator('mileage', {
                rules: [],
              })(
                <Select placeholder="维护里程间隔" style={{ width: 130 }}>
                  <Option value="1">大于</Option>
                  <Option value="2">小于</Option>
                  <Option value="3">介于</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('minMileage')(
                <InputNumber />,
              )}
            </Form.Item>
            <Form.Item><label>~</label></Form.Item>
            <Form.Item>
              {getFieldDecorator('maxMileage')(
                <InputNumber />,
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item>
              {getFieldDecorator('timeRange', {
                rules: [],
              })(
                <Select placeholder="维护时间间隔" style={{ width: 130 }}>
                  <Option value="1">大于</Option>
                  <Option value="2">小于</Option>
                  <Option value="3">介于</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('minTime')(
                <InputNumber />,
              )}
            </Form.Item>
            <Form.Item><label>~</label></Form.Item>
            <Form.Item>
              {getFieldDecorator('maxTime')(
                <InputNumber />,
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
          <Col span={1}><label>标签:</label></Col>
          <Col span={23}>
            <Tag color="#f50">全部</Tag>
            <Tag color="#2db7f5">空闲中</Tag>
            <Tag color="#87d068">巡检中</Tag>
            <Tag color="#108ee9">控制中</Tag>
            <Tag color="#2db7f5">维护中</Tag>
            <Tag color="#87d068">故障中</Tag>
            <Tag color="#108ee9">已停用</Tag>
          </Col>
        </Row>
      </div>

      <Table rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }}/>

      <Checkbox>全选</Checkbox>
      <Button type="danger" ghost>批量变更</Button>
      <Button type="danger" ghost>批量修改</Button>
      <Button type="danger" ghost>添加维护记录</Button>
      <Button type="danger" ghost>维护完成</Button>
    </div>
  )
}

export default Form.create()(ObjectModule);


