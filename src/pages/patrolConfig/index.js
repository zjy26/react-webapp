import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Button, Cascader, Table, Modal, message } from 'antd'
import ConfigModal from './configModal'
import { robotConfig } from '../../api'
import { connect } from "react-redux"

const PatrolConfig = props => {
  const locationJS = props.location.toJS()
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(true)
  const [modalProperty, setModalProperty] = useState({})
  const [dirty, setDirty] = useState(0)
  const siteRef = useRef()

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
  }, [dirty])

  //弹窗关闭
  const handleCancel = () => {
    setModalProperty({visible: false})
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

  //新增、编辑
  const checkItem = (type, id) => {
    type === "add" ?
    setModalProperty({
      visible: true,
      title: '新增',
      currentId: null
    })
    :
    setModalProperty({
      visible: true,
      title: '编辑',
      currentId: id
    })
  }

  //搜索
  const search = ()=> {
    console.log(siteRef.current.state.value)
  }

  //列表条目
  const columns = [
    {
      title: '线路',
      dataIndex: 'siteLine',
      render:(text, record) => {
        if(locationJS && locationJS.line) {
          const item = locationJS.line.find(obj=>obj.value===record.site.slice(0,4))
          return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render:(text) => {
        if(locationJS&&locationJS.site) {
          const item = locationJS.site.find(obj=>obj.value===text)
          return item.label
        }
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
            <Button type="link" size={'small'} onClick={()=>{checkItem("edit", record.id)}}>编辑</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{deleteItem(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  return (
    <div>
      <Row style={{margin:30}}>
        <Col span={12}>
          <Cascader options={locationJS.lineSite} placeholder="请选择线路/站点" ref={siteRef} />,
          <Button type="primary" onClick={search}>搜索</Button>
        </Col>
        <Col span={12} style={{textAlign: "right"}}>
          <Button type="danger" onClick={()=>{checkItem("add", null)}}>新建</Button>
        </Col>
      </Row>
      <Table loading={loading} rowKey="id" columns={columns} dataSource={data} style={{marginTop:30}}/>
      <ConfigModal  locationTree={locationJS} {...{modalProperty, handleCancel, setDirty}} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}

export default connect(mapStateToProps, null)(React.memo(PatrolConfig))
