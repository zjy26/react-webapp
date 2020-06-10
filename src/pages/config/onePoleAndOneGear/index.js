import React, { useState, useEffect } from 'react'
import { Row, Col,Form, Button, message,Select, Divider, Dropdown, Input, Table, Checkbox, Pagination, Menu, Switch, Modal } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import { ExclamationCircleOutlined,DownOutlined,DeleteOutlined,FileSearchOutlined } from '@ant-design/icons'
import UploadModal from './uploadModal'
import NewModal from './newModal'
import EditModal from './editModal'
import { overheadLine,CATENARY_LOCATION_TYPE } from '../../../api'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import commonStyles from '../../Common.module.scss'
import {VEHICLE_ROUTE ,CATENARY_TYPE,stationTracks} from '../../../api/index'

const LineInfo = props => {
  const locationTree = props.location.toJS()
  const [form] = Form.useForm()
  const [catenaryLocationTyoe, setCatenaryLocationTyoe] = useState([])
  const [stationTrackList, setStationTrackList] = useState([])
  const [catenaryType, setCatenaryType] = useState([]) //触网类型
  const [vahicleRoute, setVahicleRoute] = useState([]) //行车路线
  const [data, setData] = useState([])  //列表数据
  const [siteOption, setSiteOption] = useState([])
  const [loading, setLoading] = useState(false)
  const [isChecked, setChecked] = useState(false)//是否全选
  const [selectedCodes, setSelectedCodes] = useState([]);//已选择的codes
  const [filter, setFilter] = useState([])
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [visible, setVisible] = useState({
    showAudit: false,
    showImport: false,
    showUpload: false
  })
  const [dirty, setDirty] = useState(0)

  const handleCancel = () => {
    setVisible({
      showAudit: false,
      showImport: false,
      showUpload: false,
      showNew: false
    })
  }


  //更多功能按钮
  //新建
  const addItem = () => {
    setVisible({...visible, showNew: true})
  }

  //列表条目
  const columns = [
    {
      title: '定位点编号',
      dataIndex: 'id'
    },
    {
      title: '定位点号',
      dataIndex: 'anchorPoint'
    },
    {
      title: '定位点描述',
      dataIndex: 'descr'
    },
    {
      title: '状态',
      dataIndex: 'enable',
      render: (text, record)=> (
        <Switch key={record.id} checkedChildren="启用" unCheckedChildren="停用"
          checked={text? true : false}
          onChange={()=>showConfirm(record.id, text)}
        />
      )
    },
    {
      title: '线路',
      dataIndex: 'line',
      render: (text, record) => {
        if(locationTree&&locationTree.line) {
          const item = locationTree.line.find(obj=>obj.value===record.line)
          if(item)
          return item.label
        }
      }
    },
    {
      title: '站点1',
      dataIndex: 'site1',
      render: (text, record) => {
        if(locationTree&&locationTree.site) {
          const item = locationTree.site.find(obj=>obj.value===record.site1)
          if(item)
          return item.label
        }
      }
    },
    {
      title: '站点2',
      dataIndex: 'site2',
      render: (text, record) => {
        if(locationTree&&locationTree.site) {
          const item = locationTree.site.find(obj=>obj.value===record.site2)
          if(item)
          return item.label
        }
      }
    },
    {
      title: '行车路线',
      dataIndex: 'vehicleRoute',
      render: (text, record) => {
        if(vahicleRoute) {
          const item = vahicleRoute.find(obj=>obj.code===text)
          if(item)
          return item.name
        }
      }
    },
    {
      title: '触网类型',
      dataIndex: 'catenaryType',
      render: (text, record) => {
        if(catenaryType) {
          const item = catenaryType.find(obj=>obj.code===text)
          if(item)
          return item.name
        }
      }
    },
    {
      title: '悬挂形式',
      dataIndex: 'hangingForm'
    },
    {
      title: '布置位置',
      dataIndex: 'locationType',
      render: (text,record) => {
        if(catenaryLocationTyoe){
          const item = catenaryLocationTyoe.find(obj => obj.code = text)
          if(item)
          return item.name
        }
      }
    },
    {
      title: '公里表',
      dataIndex: 'kmTable'
    },
    {
      title: '股道号',
      dataIndex: 'stationTrackDesc',
      render: (text,record) =>{
        if(catenaryType) {
          const item = stationTrackList.find(obj=>obj.code===text)
          if(item)
          return item.descr
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <Link to={"/overhead-line-detail/"+record.code+"/"+record.id}><FileSearchOutlined /></Link>
            <Divider type="vertical" />
            <DeleteOutlined onClick={()=>{deleteOverhead(record.id)}} />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "一杆一档"
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    let currentPage = paging.currentPage
    setLoading(true)
    overheadLine.overHeadLineList({page:currentPage,start:start,limit:pageSize,filter:JSON.stringify(filter)})
    .then(res => {
      if(res){
        setSelectedCodes([])
        setChecked(false)
        setAllCodes(res.models.map(item => {return(item.code)}))
        setPaging(paging => {
          const aa={
            ...paging,
            total:res.total
          }
          return aa
        })
        setData(res.models)
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })

    VEHICLE_ROUTE()
    .then(res => {
      if(res){
        setVahicleRoute(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    CATENARY_TYPE()
    .then(res => {
      if(res.models){
        setCatenaryType(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })

    stationTracks()
    .then(res => {
      if(res){
        setStationTrackList(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  useEffect (() => {
    CATENARY_LOCATION_TYPE()
    .then(res => {
      if(res.models){
        setCatenaryLocationTyoe(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  },[])

  //变更状态
  const showConfirm = (id, checked) => {
    overheadLine.overHeadLineUpdate(id,{enable:checked? false:true,_method: 'PUT'})
    .then(res=>{
      message.success("状态变更成功")
    })
    .catch(err=>{
      console.log("状态变更失败")
    })
    setDirty(dirty=>dirty+1)
  }
  //删除
  const deleteOverhead = (id)=>{
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        let params ={_method:'delete'}
        overheadLine.overHeadLineDelete(id,params)
        .then(() =>{
          message.success("删除成功")
          setDirty((dirty)=> dirty+1)
        })
      },
      onCancel() {
      },
    })
  }

  //列表逐条数据选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCodes(selectedRowKeys);
      if(selectedRowKeys && selectedRowKeys.length === allCodes.length){//全选了
        setChecked(true);
      }else{
        setChecked(false)
      }
    },
    selectedRowKeys:selectedCodes
  }

  const onCheckBox = (event ) => {
    if(event.target.checked){
      setSelectedCodes(allCodes)
      setChecked(true)
    }else{
      setSelectedCodes([])
      setChecked(false)
    }
  }


  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage:page
    })
    setDirty(dirty+1)
  }
  const pageSizeChange = (current,pageSize) => {
      setPaging({
          ...paging,
          pageSize:pageSize
      })
      setDirty(dirty+1)
  }

  //搜索
  const search = async () => {
    try {
      const values = await form.validateFields()
      const filterArr = []
      for(var key of Object.keys(values)) {
        const filterObj = {}
        filterObj["property"] = key
        filterObj["value"] = values[key]?values[key]:""

        if(key ==="pointDesc" && values[key]) {
          filterObj["property"] = "descr"
        }
        if(key ==="selectSite1" && values[key]) {
          filterObj["property"] = "site1"
        }
        if(key ==="selectSite2" && values[key]) {
          filterObj["property"] = "site2"
        }
        if(key ==="pointCode" && values[key]) {
          filterObj["property"] = "anchorPoint"
        }
        if(key ==="locationTypeDesc" && values[key]) {
          filterObj["property"] = "vehicleRoute"
        }
        if(filterObj.value && key!=="siteLine"){
          filterArr.push(filterObj)
        }
      }
      setFilter(filterArr)

      setPaging({
        ...paging,
        current: 1,
        page: 1,
        start: 0,
      })
      setDirty(dirty=>dirty+1)
    }
    catch {}
  }


  return (
    <div>
      <div className={commonStyles.searchForm}>
        <Form form={form}>
          <Row>
            <Col span={5}>
              <Form.Item name ="pointCode">
                <Input placeholder="请输入定位点号" />
              </Form.Item>
            </Col>
            <Col span={5}  offset={1}>
              <Form.Item name ="pointDesc">
                <Input placeholder="请输入定位点描述" />
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Form.Item name="selectSite1">
                <Select placeholder="请选择站点1" allowClear>
                {
                  siteOption.length>0 && siteOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))
                }
                </Select>
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Form.Item name="selectSite2">
                <Select placeholder="请选择站点2" allowClear>
                {
                  siteOption.length>0 && siteOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))
                }
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name ="locationTypeDesc">
                <Select placeholder="请选择行车路线">
                {
                  vahicleRoute && vahicleRoute.length>0 && vahicleRoute.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))
                }
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1} ><Button type="primary" onClick={search}>搜索</Button></Col>
          </Row>
        </Form>
      </div>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
      <Col><h3>一杆一档列表</h3></Col>
        <Col >
          <Button type="primary" onClick={addItem}>新建</Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})}}>信息导入</Menu.Item>
                <Menu.Item key="download">下载</Menu.Item>
                <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})}}>审计</Menu.Item>
              </Menu>
            }
          >
            <Button>更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col>
      </Row>

      <Table loading={loading} rowKey="code" rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false}/>
      <Row type="flex" justify="space-between" style={{padding: '16px', background: '#fff'}}>
        <Col>
        <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
          <Button type="danger" ghost onClick={ ()=>{setVisible({...visible, showEdit:true})} }>批量修改</Button>
        </Col>
        <Col>
          <Pagination
            onShowSizeChange={pageSizeChange}
            pageSize={paging.pageSize}
            onChange={pageNumberOnChange}
            total={paging.total}
            current={paging.currentPage}
            showSizeChanger
            showQuickJumper
            showTotal={() => `共 ${paging.total} 条`}
          />
          </Col>
        </Row>

      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
      <ImportModal {...{handleCancel, visible: visible.showImport}} />
      <UploadModal {...{handleCancel, visible: visible.showUpload}}/>
      <NewModal {...{handleCancel,setDirty, visible: visible.showNew}} />
      <EditModal visible={visible.showEdit} brands={props.brands} {...{selectedCodes, handleCancel, setDirty}}/>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}

export default connect(mapStateToProps, null)(React.memo((LineInfo)))
