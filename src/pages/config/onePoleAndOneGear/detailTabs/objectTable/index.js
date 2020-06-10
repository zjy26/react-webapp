import React, { useState, useEffect,useContext,useRef } from 'react'
import { MenuOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Button, Table, Pagination, Menu, Input, Row, Dropdown, Col, Tabs, message } from 'antd'
import moment from 'moment'
import ObjectDetilModal from './objectDetilModal'
import NewUnit from './newUnit'
import ObjectModal from './objectModal'
import PropStdModal from './propStdModal'
import CheckModal from './checkModal'
import commonStyles from '../../../../Common.module.scss'
import ChangeObjectModal from './changeObjectModal'
import MaintainModal from './maintainModal'


import { overheadLine } from '../../../../../api'

const ObjectTable = props  => {
  const {MyContext,user} = props
  const {code,id,peopleOption} = useContext(MyContext)
  const [objId, setObjId] = useState(null)
  const [template, setTemplate] = useState(null)
  const [filter, setFilter] = useState([])
  const [state, setState] = useState({
    paneKey: '1'
  })
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [paging2, setPaging2] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [paging3, setPaging3] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [modalTitle, setModalTitle] = useState("新增设备")
  const [loading, setLoading] = useState(true)
  const [objData, setObjData] = useState([])
  const [objChangeData, setObjChangeData] = useState([])
  const [objRepairData, setObjRepairData] = useState([])


  const [dirty, setDirty] = useState(0)
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})
  const [child, setChild] = useState({})
  const templateRef = useRef(null)
  useEffect(()=>{
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    let currentPage = paging.currentPage
    overheadLine.overheadLineObjectList({page:currentPage,start:start,limit:pageSize,code:code,filter:JSON.stringify(filter)})
    .then(res => {
      if(res.models){
        setPaging(paging => {
          const aa={
            ...paging,
            total:res.total
          }
          return aa
        })
        setObjData(res.models)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })

    let pageSize2 = paging2.pageSize;
    let start2 = (paging2.currentPage - 1) * pageSize
    let currentPage2 = paging2.currentPage

    overheadLine.objectChangeList({page:currentPage2,start:start2,limit:pageSize2,overheadline:code})
    .then(res => {
      if(res.models){
        setPaging2(paging2 => {
          const aa={
            ...paging2,
            total:res.total
          }
          return aa
        })
        setObjChangeData(res.models)
        setLoading(false)
      }

    })
    .catch(() => {
      console.log("列表数据加载失败")
    })

    let pageSize3 = paging3.pageSize;
    let start3 = (paging3.currentPage - 1) * pageSize
    let currentPage3 = paging3.currentPage
    overheadLine.objectRepairList({page:currentPage3,start:start3,limit:pageSize3,overheadline:code})
    .then(res => {
      if(res.models){
        setPaging3(paging3 => {
          const aa={
            ...paging3,
            total:res.total
          }
          return aa
        })
        setObjRepairData(res.models)
        setLoading(false)
      }

    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const objColumns = [
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '设备描述',
      dataIndex: 'descr'
    },
    {
      title: '设备分类',
      dataIndex: 'clsName'
    },
    {
      title: '品牌',
      dataIndex: 'brdName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '长度',
      dataIndex: 'length'
    },
    {
      title: '启用日期',
      dataIndex: 'commissDate',
      render: (text, record) => text?moment(record.commissDate).format('YYYY-MM-DD'):null
    },
    {
      title: '设备标识',
      dataIndex: 'objectMark'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small' } onClick={()=>{partsParameters(record)}}>新增部件</Button>&nbsp;&nbsp;
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="check" onClick={()=>{objDetil(record.id)}}>查看详情</Menu.Item>
                  <Menu.Item key="edit" onClick={()=>{objEdit( record.id)}}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={()=>{deleteObject(record.id)}}>删除</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{cursor:'pointer'}} />
            </Dropdown>
          </span>
        )
      }
    }
  ]

  const changeColumns = [
    {
      dataIndex: 'type',
      render:(text => {
        return (
          text === '01' ?
          <span style={{color:'#ff0000'}}>设备</span>:<span style={{color:'green'}}>部件</span>
        )
      })
    },
    {
      title: '设备/部件描述',
      render:(text,record)=>{
        return record.objectDesc?record.objectDesc:record.unitDesc
      }
    },
    {
      title: '设备/部件分类',
      dataIndex: 'clsName'
    },
    {
      title: '原设备/部件品牌',
      dataIndex: 'orgBrand'
    },
    {
      title: '新设备/部件品牌',
      dataIndex: 'preBrand'
    },
    {
      title: '新设备/部件型号',
      dataIndex: 'preModelNumber'
    },
    {
      title: '更换原因',
      dataIndex: 'reason'
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      render: (text, record) => {
        if(peopleOption) {
          const item = peopleOption.find(obj => obj.id.toString() === text)
          if(item)
          return item.name
        }
      }
    },
    {
      title: '更换时间',
      dataIndex: 'replaceTime',
      render: (text, record) => text?moment(record.replaceTime).format('YYYY-MM-DD'):null
    }
  ]

  const partsParameters = (record)=>{
    setObjId(record.id)
    setTemplate(record.template)
    setVisible({...visible, showUnit: true})
  }

  const objDetil = (id)=>{
    setObjId(id)
    setVisible({...visible, showDetil: true})
  }

  const objEdit = (id)=>{
    setModalTitle("编辑")
    setObjId(id)
    setVisible({...visible, showObject: true})
  }

  const handleCancel = ()=>{
    setVisible(false)
  }

  const deleteObject = (id)=>{
    overheadLine.overHeadLineObjectDelete(id,{_method:'delete'})
    .then(res =>{
      if(res){
        message.success("删除成功")
        setDirty(dirty+1)
      }

    })
  }

  const onChangePane = (key) => {
    setState({
      paneKey: key,
    });
  };

  const maintainColumns = [
    {
      dataIndex: 'type',
      render:(text => {
        return (
          text === '01' ?
          <span style={{color:'#ff0000'}}>维修</span>:<span style={{color:'green'}}>维护</span>
        )
      })
    },
    {
      title: '设备描述',
      dataIndex: 'overheadLineObject'
    },
    {
      title: '维护/维修信息',
      dataIndex: 'descr'
    },
    {
      title: '处理信息',
      dataIndex: 'explanation'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text, record) =>{
        return (
          text ? moment(text).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text, record) =>{
        return (
          text ? moment(text).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      render: (text, record) => {
        if(peopleOption) {
          const item = peopleOption.find(obj => obj.id.toString() === text)
          if(item)
          return item.name
        }
      }
    }
  ]

  const unitColumns = [
    {
      title: '序号',
      dataIndex: 'unitSn',
      render:(text )=>{
        return text?text:undefined
      }
    },
    {
      title: '描述',
      dataIndex: 'desc'
    },
    {
      title: '分类',
      dataIndex: 'firstLevelCls'
    },
    {
      title: '品牌',
      dataIndex: 'brand'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '规格',
      dataIndex: 'spec'
    },
    {
      title: '元器件编号',
      dataIndex: 'componentNumber'
    },
    {
      title: '设计寿命',
      dataIndex: 'designLife'
    },
    {
      title: '更换年限',
      dataIndex: 'replaceLife'
    },
    {
      title: '关键部件',
      dataIndex: 'criticality'
    },
    {
      title: '变比一次参数',
      dataIndex: 'transRatio1'
    },
    {
      title: '变比两次参数',
      dataIndex: 'transRatio2'
    },
    {
      title: '制造商',
      dataIndex: 'manufact'
    },
    {
      title: 'E码/订货编号',
      dataIndex: 'fcCode'
    },
    {
      title: '操作',
      render: (text, record) => {

        return (
          record.isStatic === false?
          <span>
            <Button key="detail" type="link" size={'small'} onClick={()=>propStd( record.code)}>参数标准</Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="detail" onClick={()=>{showDetil("dynamic",record)}}>查看详情</Menu.Item>
                  <Menu.Item key="edit" onClick={()=>{check("edit", record.id)}}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={()=>{deleteItem(record.id,record.d9OverheadLineObjectId,record.templateCode)}}>删除</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{cursor:'pointer'}} />
            </Dropdown>
          </span>:
          <span>
            <Button key="propStdStatic" type="link" size={'small'} onClick={()=>propStdStatic(record.code)}>参数标准</Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={()=>{edit(record)}}>编辑</Menu.Item>
                  <Menu.Item key="detail" onClick={()=>{showDetil("static",record)}}>查看详情</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{cursor:'pointer'}} />
            </Dropdown>
          </span>
        )
      }
    }
  ]

  //参数标准
  const propStd = ( code) => {
    setModalProperty({
      unitTemplate: code
    })
    setVisible({showParametersStandard:true})
  }

  //参数标准
  const propStdStatic = ( code) => {
    setModalProperty({
      unitSn:1,
      unitTemplate: code
    })
    setVisible({showParametersStandard:true})
  }

  const pageSizeChange = (current,pageSize) => {
    setPaging({
        ...paging,
        pageSize:pageSize
    })
    setDirty(dirty+1)
  }

  const pageSizeChange2 = (current,pageSize) => {
    setPaging2({
        ...paging2,
        pageSize:pageSize
    })
    setDirty(dirty+1)
  }

  const pageSizeChange3 = (current,pageSize) => {
    setPaging3({
        ...paging3,
        pageSize:pageSize
    })
    setDirty(dirty+1)
  }

  //设备部件删除
  const deleteItem = (id,d9OverheadLineObjectId,templateCode) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: ()=> {
        overheadLine.objectUnitDelete(id,{_method:'DELETE'})
        .then(() =>{
          renderChildData(true, d9OverheadLineObjectId,templateCode)
          message.success("删除成功")

        })
      },
      onCancel() {
      },
    })
  }

  const createBarExtraContent = () => {
    if(state.paneKey === '1'){
    return (
      <div>
        <Button type="primary" onClick={addObject}>新建</Button>
      </div>)} else if(state.paneKey === '2'){
        return(
          <div>
            <Button type="primary" onClick={addChangeObject}>新建</Button>
          </div>
        )
      } else if(state.paneKey === '3'){
        return(
          <div>
            <Button type="primary" onClick={addMaintenance}>新建</Button>
          </div>
        )
      }
  }

  //新建
  const addObject = () => {
    setModalTitle("新增设备")
    setObjId(null)
    setVisible(true)
    setVisible({...visible, showObject: true})
  }

  //新建部件更换记录
  const addChangeObject = () => {
    setVisible({...visible, showChangeObject: true})
  }

    //新建维护记录
    const addMaintenance = () => {
      setVisible({...visible, showAddMaintenance: true})
    }

  //预设值列表(点击展开时请求)
  const renderChildData = (expanded, id,template) => {
    if(expanded) {
        overheadLine.unitTemplateList({id:id,template:template})
        .then(res => {
          if(res.objectUnitList){
            const obj = {}
            for(var i=0;i<res.objectUnitList.length;i++){
              res.objectUnitList[i].d9OverheadLineObjectId=id
              res.objectUnitList[i].templateCode=template
            }
          obj[id] = res.objectUnitList
          setChild((child)=>{
          return {
            ...child,
            ...obj
          }
        })
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    }
    )
    }
  }

  //新建编辑
  const check = (type, id) => {
    setModalProperty({title: type==="detail" ? "查看详情" : "编辑", type: type, id: id,edit:type==="detail" ? true:false})
    setVisible({...visible, showCheckModal: true})
  }

    //编辑
    const edit = (record) => {
      setModalProperty({title: "编辑",mainId:record.d9OverheadLineObjectId, id: record.unitTemplateId,objectId:record.id,edit:true,cls:record.firstLevelCls,brand:record.brand,modelNumber:record.modelNumber,spec:record.spec,commissDate:record.commissDate})
      setVisible({...visible, showCheckModal: true})
    }

    //查看详情
    const showDetil = (type,record) => {
      setModalProperty({title:  "查看详情",type:type,commissDate:record.commissDate, id:type==="static"? record.unitTemplateId:record.id,edit:false,detil:true})
      setVisible({...visible, showCheckModal: true})
    }

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage:page
    })
    setDirty(dirty+1)
  }

  const pageNumberOnChange2 = (page) => {
    setPaging2({
      ...paging2,
      currentPage:page
    })
    setDirty(dirty+1)
  }

  const pageNumberOnChange3 = (page) => {
    setPaging3({
      ...paging3,
      currentPage:page
    })
    setDirty(dirty+1)
  }

  const unitListexpanded = (record) => {
    return (
      <Table
        rowKey="id"
        columns={unitColumns}
        dataSource={child[record.id]}
        pagination={false}
      />
    );
  }

    //搜索
  const search = ()=> {
    if(templateRef.current.state.value) {
      setFilter([{"property":"clsName","value": templateRef.current.state.value}])
    } else {
      setFilter([])
    }

    setDirty(dirty=>dirty+1)
  }

  return (
    <React.Fragment>
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Input placeholder="请输入设备分类" ref={templateRef} onPressEnter={search} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>
      <div style={{margin: '0 30px'}}>
      <Tabs defaultActiveKey="1" onChange={onChangePane} tabBarExtraContent={createBarExtraContent()}>
        <Tabs.TabPane tab="设备管理" key="1">
          <Table columns={objColumns} dataSource={objData} loading={loading}
          expandedRowRender={(record) => unitListexpanded(record)}
          onExpand={(expanded, record) => renderChildData(expanded, record.id,record.template)
        }
          rowKey="id" pagination={false}/>
          <Row type="flex" justify="end" style={{margin:30}}>
            <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="更换设备" key="2">
          <Table columns={changeColumns} dataSource={objChangeData} loading={loading}
          rowKey="id" pagination={false}/>
          <Row type="flex" justify="end" style={{margin:30}}>
            <Col><Pagination onShowSizeChange={pageSizeChange2} pageSize={paging2.pageSize} onChange={pageNumberOnChange2} total={paging2.total} current={paging2.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
            {/* {objData.map((item, index) => {
            if(item.item === '11'){
              return(
            <Card hoverable key={index} bordered={false} rowKey={index} bodyStyle={{width:"100%"}}>
                <Row align="middle">
                <Col span={1}>
                    <p style={{color:"red"}}>{item.item}</p>
                  </Col>
                  <Col span={4}>
                    <p>原设备品牌西门子</p>
                    <p>原设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>新设备品牌西门子</p>
                    <p>新设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>更换原因默认15个字</p>
                    <p>关联工单1211321221121</p>
                  </Col>
                  <Col span={4}>
                    <p>更换时间2020-12-12</p>
                    <p>负责人李丽丽</p>
                  </Col>
                </Row>
              </Card>
              )
        } else if(item.item === '22'){
          return(
            <Card key={index} hoverable bordered={false} bodyStyle={{width:"100%"}}>
                <Row align="middle">
                <Col span={1}>
                    <p style={{color:"green"}}>{item.item}</p>
                </Col>
                <Col span={4}>
                    <p>设备分类</p>
                    <p>柔性触网</p>
                  </Col>
                  <Col span={4}>
                    <p>原设备品牌西门子</p>
                    <p>原设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>新设备品牌西门子</p>
                    <p>新设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>更换原因默认15个字</p>
                    <p>关联工单1211321221121</p>
                  </Col>
                  <Col span={4}>
                    <p>更换时间2020-12-12</p>
                    <p>负责人李丽丽</p>
                  </Col>
                </Row>
              </Card>
              )
            } else {
              return ''
            }
          })
          }
          <Row type="flex" justify="space-between" style={{margin:30}}>
            <Col><Pagination showSizeChanger showQuickJumper /></Col>
          </Row> */}
        </Tabs.TabPane>
        <Tabs.TabPane tab="维护信息" key="3">
          <Table  rowKey="id" columns={maintainColumns} dataSource={objRepairData} pagination={false}/>
          <Row type="flex" justify="end" style={{margin:30}}>
            <Col><Pagination onShowSizeChange={pageSizeChange3} pageSize={paging3.pageSize} onChange={pageNumberOnChange3} total={paging3.total} current={paging3.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
      <NewUnit {...{handleCancel,objId,id:id,MyContext,template,setDirty, visible: visible.showUnit,renderChildData}} />
      <ObjectDetilModal {...{handleCancel,objId,user,MyContext, visible: visible.showDetil}} />
      <ObjectModal {...{handleCancel,line:props.line,MyContext,objId,setDirty,modalTitle, visible: visible.showObject}} />
      <PropStdModal {...{visible: visible.showParametersStandard, modalProperty, handleCancel}} />
      <CheckModal {...{visible: visible.showCheckModal, setDirty,modalProperty, MyContext, handleCancel}} />
      <ChangeObjectModal {...{handleCancel,MyContext,objData,line:props.line,setDirty, visible: visible.showChangeObject}} />
      <MaintainModal {...{handleCancel,MyContext,setDirty, visible: visible.showAddMaintenance}} />

      </div>

    </React.Fragment>
  )
}

export default React.memo(ObjectTable)
