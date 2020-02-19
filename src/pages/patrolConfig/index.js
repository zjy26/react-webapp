import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Button, Cascader, Table } from 'antd';
import ConfigModal from './configModal';

const PatrolConfig = props => {
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增配置");

  const newModal = ()=> {
    setModalTitle("新增配置");
    setVisible(true);
  }
  const editModal = ()=> {
    setModalTitle("编辑配置");
    setVisible(true);
  }
  const handleCancel = () => {
    setVisible(false);
  }

  //列表条目
  const columns = [
    {
      title: '线路',
      dataIndex: 'line',
    },
    {
      title: '站点',
      dataIndex: 'site',
    },
    {
      title: '服务器IP',
      dataIndex: 'serverIP',
    },
    {
      title: '服务器端口',
      dataIndex: 'serverPort',
    },
    {
      title: '视频推流地址',
      dataIndex: 'videoUrl',
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: () => {
        return (
          <span><a onClick={editModal}>编辑</a>&nbsp;&nbsp;<a>删除</a></span>
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
    Axios.get('/api/patrolConfigList').then(res =>{
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
      <Row>
        <Col span={12}>
          <Cascader options={lineSite} placeholder="请选择线路/站点" />,
          <Button type="danger">搜索</Button>
        </Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button type="danger" onClick={newModal}>新建</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} style={{marginTop:30}}/>
      <ConfigModal visible={visible} title={modalTitle} {...{handleCancel}}/>
    </div>
  )
}

export default PatrolConfig;