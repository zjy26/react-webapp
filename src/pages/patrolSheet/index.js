import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Input, Select, Button, Cascader, DatePicker, InputNumber, Table, Checkbox, Tag, Menu, Dropdown, Icon, Pagination } from 'antd';

const PatrolSheet = props => {
  const { getFieldDecorator } = props.form;
  const [lineSite, setLineSite] =  useState([]);  //线路站点

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
          <Form.Item>
            <Button type="primary" htmlType="submit">筛选</Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  )
}

export default Form.create()(PatrolSheet);