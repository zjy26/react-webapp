import React, { useState, useEffect} from 'react';
import Axios from 'axios';
import { Row, Col, Button, Cascader, Table, Modal } from 'antd';
import ConfigModal from './configModal';

const PatrolConfig = props => {
  const [lineSite, setLineSite] =  useState([]);  //线路站点
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("新增配置");
  const [currentId, setCurrentId] = useState(0);
  const [dirty, setDirty] = useState(0);

  const newModal = ()=> {
    setModalTitle("新增配置");
    setCurrentId(0);
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
    Modal.confirm({
      title: '确认提示',
      content: '是否确认修改？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        Axios.delete('/api/patrolConfigList/'+id)
        .then((res) =>{
          setDirty(dirty=>dirty+1);
        })
      },
      onCancel() {
      },
    });
  }

  //编辑
  const editItem = (id)=>{
    setCurrentId(()=>id);
    console.log(currentId)
    setModalTitle("编辑配置");
    setVisible(true);

    // Axios.get('/api/patrolConfigList/'+id)
    // .then((res) =>{
    //   if(res.status === 200){
    //     setItemValues(res.data);
    //     setModalTitle("编辑配置");
    //     setVisible(true);
    //     childRef.current.editModal();
    //   }
    // })
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
    setLoading(true);
    Axios.get('/api/patrolConfigList').then(res =>{
      if(res.status === 200){
        setLoading(false);
        setData(res.data);
      }
    }).catch((err) =>{
        console.log("列表数据加载失败")
    });
  }, [dirty]);

  return (
    <div>
      <Row style={{margin:30}}>
        <Col span={12}>
          <Cascader options={lineSite} placeholder="请选择线路/站点" />,
          <Button type="primary">搜索</Button>
        </Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button type="danger" onClick={()=>{newModal()}}>新建</Button>
        </Col>
      </Row>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={data} style={{marginTop:30}}/>
      <ConfigModal visible={visible} title={modalTitle} {...{handleCancel, currentId, setDirty}}/>
    </div>
  )
}

export default PatrolConfig;