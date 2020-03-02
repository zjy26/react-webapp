import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Row, Col, Button, Cascader, Table } from 'antd';
import ConfigModal from './configModal';

const PatrolConfig = props => {
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);  //
  const [itemValues, setItemValues] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增配置");

  const childRef = useRef();

  const newModal = ()=> {
    console.log(childRef)
    childRef.current.resetForm(); //重置表单
    setModalTitle("新增配置");
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  const load = () => {
    setLoading(true);
  }

  //删除
  const deleteItem = (id)=>{
    Axios.delete('/api/patrolConfigList/'+id)
    .then((res) =>{
      setLoading(true);
    })
  }

  //编辑
  const editItem = (id)=>{
    Axios.get('/api/patrolConfigList/'+id)
    .then((res) =>{
      if(res.status === 200){
        setItemValues(res.data);
        setModalTitle("编辑配置");
        setVisible(true);
        childRef.current.editModal();
      }
    })
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
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={()=>{editItem(record.id)}}>编辑</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{deleteItem(record.id)}}>删除</Button>
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
      <Row style={{margin:30}}>
        <Col span={12}>
          <Cascader options={lineSite} placeholder="请选择线路/站点" />,
          <Button type="primary">搜索</Button>
        </Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button type="danger" onClick={newModal}>新建</Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} style={{marginTop:30}}/>
      <ConfigModal visible={visible} title={modalTitle} {...{handleCancel, itemValues, load}} wrappedComponentRef={childRef}/>
    </div>
  )
}

export default PatrolConfig;