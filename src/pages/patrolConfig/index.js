import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Cascader, Table, Modal, message } from 'antd'
import ConfigModal from './configModal'
import { robotConfig } from '../../api'
import { connect } from "react-redux"

const PatrolConfig = props => {
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("新增配置")
  const [dirty, setDirty] = useState(0)
  const [currentId, setCurrentId] = useState(0)

  const newModal = ()=> {
    setModalTitle("新增配置")
    setCurrentId(0)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false);
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
        robotConfig.robotConfigDelete(id)
        .then((res) =>{
          message.success("删除成功")
          setDirty((dirty)=> dirty+1)
        })
      },
      onCancel() {
      },
    });
  }

  //编辑
  const editItem = (id)=>{
    setCurrentId(id)
    setModalTitle("编辑配置")
    setVisible(true)
  }

  //列表条目
  const columns = [
    {
      title: '线路',
      dataIndex: 'siteLine',
      render:(text, record) => {
        // for(var item of props.locationTree.line) {
        //   if(record.site.slice(0,4) === item.value) {
        //     return item.label
        //   }
        // }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render:(text, record) => {
        console.log("*****", props.locationTree)
        // for(var item of props.locationTree.site) {
        //   if(record.site === item.value) {
        //     return item.label
        //   }
        // }
      }
    },
    {
      title: '服务器IP',
      dataIndex: 'ip'
    },
    {
      title: '服务器端口',
      dataIndex: 'port'
    },
    {
      title: '视频推流地址',
      dataIndex: 'cameraStreamUrl'
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

  useEffect(() => {
    document.title = "巡检配置"

    setLoading(true)
    //列表数据
    robotConfig.robotConfigList()
    .then(res => {
      if(res){
        setData(res)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  }, [dirty]);

  return (
    <div>
      <Row style={{margin:30}}>
        <Col span={12}>
          <Cascader options={props.locationTree.lineSite} placeholder="请选择线路/站点" />,
          <Button type="primary">搜索</Button>
        </Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button type="danger" onClick={newModal}>新建</Button>
        </Col>
      </Row>
      <Table loading={loading} rowKey="id" columns={columns} dataSource={data} style={{marginTop:30}}/>
      <ConfigModal visible={visible} title={modalTitle} locationTree={props.locationTree} {...{handleCancel, currentId, setDirty}} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    locationTree: state.locationTree
  }
}

export default connect(mapStateToProps, null)(React.memo(PatrolConfig))
