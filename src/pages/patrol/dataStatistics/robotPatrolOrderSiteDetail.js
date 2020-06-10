/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Tabs, Form, Input, Tooltip, Pagination, message, Checkbox, Table, Row, Col, Card, Button } from 'antd';
import moment from "moment"
import { Link } from 'react-router-dom'
import { dataStatistics } from '../../../api'


const { TabPane } = Tabs;
const PatrolDetailModal = props => {
  const [robotPatrolIds, setRobotPatrolIds] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  const [selectedRowKeys2, setSelectedRowKeys2] = useState()
  const [selectedRowKeys3, setSelectedRowKeys3] = useState()
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
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
  const [formValue, setFormValue] = useState({
    objectDesc: '',
    propertyDesc: ''
  })
  const [search, setSearch] = useState(0)
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [table, setTable] = useState({
    unnormalData: [],
    normalData: [],
    notCheckData: []
  });

  const columns = [
    {
      title: '房间',
      dataIndex: 'robotPatrolLocDesc',
      key: 'robotPatrolLocDesc',
      width:240
    },
    {
      title: '巡检设备',
      dataIndex: 'objDesc',
      key: 'objDesc',
      width:240
    },
    {
      title: '巡检项',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 240
    },
    {
      title: '巡检标准',
      dataIndex: 'standard',
      key: 'standard',
      width:120
    },
    {
      title: '巡检值',
      dataIndex: 'settingValue',
      key: 'settingValue',
      width:120,
      render: (text) => {
        return(
          text?text:'--'
        )
      }
    },
    {
      title: 'CIOS对应值',
      dataIndex: 'cios',
      key: 'cios',
      width:120,
      render: (text) => {
        return(
          text?text:'--'
        )
      }
    },
    {
      title: '判定结果',
      dataIndex: 'isError',
      key: 'isError',
      width:120,
      render: (text, record) => {
        return (
          text ? '正常' : String(text) === 'false' ? '异常': '--'
        )
      }
    },
    {
      title: '人工确定',
      dataIndex: 'isSure',
      key: 'isSure',
      width:120,
      render: (text, record) => {
        return (
          text ? '正常' : String(text) === 'false' ? '异常': '--'
        )
      }
    },
    {
      title: '数据采集时间',
      dataIndex: 'dataTime',
      key: 'dataTime',
      width:120,
      render: (text, record) =>{
        return (
          text?moment(text).format('YYYY-MM-DD'):text
        )
      }
    },
    {
      title: '问题描述',
      dataIndex: 'faultDesc',
      key: 'faultDesc',
      width:120,
      render: (text, record) => {
        return (
          text ? <Tooltip placement="topLeft" title={text}>{text ? (text.length > 15 ? text.substr(0, 15) + "..." : text) : ""}</Tooltip>: '--'
        )
      }
    },
    {
      title: '问题原因',
      dataIndex: 'faultReason',
      key: 'faultReason',
      width:120,
      render: (text, record) => {
        return (
          text ? <Tooltip placement="topLeft" title={text}>{text ? (text.length > 15 ? text.substr(0, 15) + "..." : text) : ""}</Tooltip>: '--'
        )
      }
    },
    {
      title: '解决措施',
      dataIndex: 'faultAction',
      key: 'faultAction',
      width:120,
      render: (text, record) => {
        return (
          text ? <Tooltip placement="topLeft" title={text}>{text ? (text.length > 15 ? text.substr(0, 15) + "..." : text) : ""}</Tooltip>: '--'
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width:120,
      render: (text, record)=>{
        return (
          <Button type="link" size={'small'}>
          <Link to={"/patrol-sheet-detail/"+record.routingInspectionCode+"/" +props.match.params.site+"/"+props.match.params.day}>查看巡检单</Link>
          </Button>
        )
      }
    }
  ]
  //获取列表数据
  useEffect(() => {
    setLoading(true)
    setLoading2(true)
    setLoading3(true)
    let objectDesc1 = formValue.objectDesc
    var propertyDesc1 = formValue.propertyDesc
    var site = props.match.params.site
    var day = props.match.params.day
    let unnormal;
    let normal;
    //站点-异常数据巡检项列表
    dataStatistics.robotPatrolOrderSiteDetail({property : propertyDesc1, object : objectDesc1, day: day, site : site, start : (paging.currentPage - 1) * paging.pageSize, limit : paging.pageSize, type: '1'})
    .then(res => {
      if(res.models){
        unnormal=res.models
          setPaging(paging => {
            const aa={
              ...paging,
              total:res.total
            }
            return aa
          })
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
      .then(()=>{
      //站点-正常数据巡检项列表
      dataStatistics.robotPatrolOrderSiteDetail({property : propertyDesc1, object : objectDesc1, day: day, site : site, start : (paging2.currentPage - 1) * paging2.pageSize, limit : paging2.pageSize, type: '2'})
      .then(res => {
        if(res.models){
          normal=res.models
          setPaging2(paging2 => {
            const aa={
              ...paging2,
              total:res.total
            }
            return aa
          })
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
      .then(()=>{
        //站点-未检出数据巡检项列表
        dataStatistics.robotPatrolOrderSiteDetail({property : propertyDesc1, object : objectDesc1, day: day, site : site, start : (paging3.currentPage - 1) * paging3.pageSize, limit : paging3.pageSize, type: '3'})
        .then(res => {
          if(res.models){
            setTable(table => {
              const aa={
                ...table,
                unnormalData:unnormal,
                normalData:normal,
                notCheckData:res.models
              }
              return aa
            })
            setPaging3(paging3 => {
              const aa={
                ...paging3,
                total:res.total
              }
              return aa
            })
            setData(res.static)
            setLoading(false)
            setLoading2(false)
            setLoading3(false)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  //搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields()
      if (values) {
        setSearch(search=>search+1)
      }
    }
    catch {}
  }

  //分页
  const pageNumberOnChange = (page) => {
    setPaging(paging => {
      const aa={
        ...paging,
        currentPage:page
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  const pageSizeChange = (current,pageSize) => {
    setSelectedRowKeys('')
    setPaging(paging => {
      const aa={
        ...paging,
        pageSize:pageSize
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  //分页
  const pageNumberOnChange2 = (page) => {
    setSelectedRowKeys2('')
    setPaging2(paging2 => {
      const aa={
        ...paging2,
        currentPage:page
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  const pageSizeChange2 = (current,pageSize) => {
    setSelectedRowKeys2('')
    setPaging2(paging2 => {
      const aa={
        ...paging2,
        pageSize:pageSize
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  //分页
  const pageNumberOnChange3 = (page) => {
    setSelectedRowKeys3('')
    setPaging3(paging3 => {
      const aa={
        ...paging3,
        currentPage:page
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  const pageSizeChange3 = (current,pageSize) => {
    setPaging3(paging3 => {
      const aa={
        ...paging3,
        pageSize:pageSize
      }
      return aa
    })
    setSearch(search=>search+1)
  }
  const error = () => {
    if(robotPatrolIds.toString()){
      dataStatistics.robotItemRrror({codes:robotPatrolIds.toString(),isSureString:'false'})
      .then(res => {
        message.info('已人为判断为异常')
        setSelectedRowKeys('')
        setSelectedRowKeys2('')
        setSelectedRowKeys3('')
        setSearch(search=>search+1)
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    }
  }
  const normal = () => {
    if(robotPatrolIds.toString()){
      dataStatistics.robotItemRrror({codes:robotPatrolIds.toString(),isSureString:'true'})
      .then(res => {
        message.info('已人为判断为正常')
        setSelectedRowKeys('')
        setSelectedRowKeys2('')
        setSelectedRowKeys3('')
        setSearch(search=>search+1)
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    }
  }
  let isChecked = null
  if(table.unnormalData){
    const keys = Object.keys(table.unnormalData)
    if(selectedRowKeys){
      if(keys.length === selectedRowKeys.length){
        isChecked=true
      }else{
        isChecked=false
      }
    }
  }
  let isChecked2 = null
  if(table.normalData){
    const keys2 = Object.keys(table.normalData)
    if(selectedRowKeys2){
      if(keys2.length === selectedRowKeys2.length){
        isChecked2=true
      }else{
        isChecked2=false
      }
    }
  }
  let isChecked3 = null
  if(table.notCheckData){
    const keys3 = Object.keys(table.notCheckData)
    if(selectedRowKeys3){
      if(keys3.length === selectedRowKeys3.length){
        isChecked3=true
      }else{
        isChecked3=false
      }
    }
  }
  const selectAll =()=>{
    if(selectedRowKeys){
      if(table.unnormalData.length !== selectedRowKeys.length){
        const keys =[];
        const codes =[];
        table.unnormalData.forEach((item,index)=>{
          keys.push(item.code+index)
          codes.push(item.code)
        })
        const index =[];
        keys.forEach(item=>{
          index.push(item)
        });
        setSelectedRowKeys(index)
        setRobotPatrolIds(codes)
      } else {
        setSelectedRowKeys('')
      }
    } else{
      const keys =[];
      const codes =[];
      table.unnormalData.forEach((item,index)=>{
        keys.push(item.code+index)
        codes.push(item.code)
      })
      const index = []
      keys.forEach(item=>{
        index.push(item)
      });
      setSelectedRowKeys(index)
      setRobotPatrolIds(codes)
    }
  }
  const selectAll2 =()=>{
    if(table.normalData){
      if(selectedRowKeys2){
        if(table.normalData.length !== selectedRowKeys2.length){
          const keys =[];
          table.normalData.forEach(item=>{
            keys.push(item.code)
          })
          const index = []
          keys.forEach(item=>{
            index.push(item)
          });
          setSelectedRowKeys2(index)
          setRobotPatrolIds(index)
        } else {
          setSelectedRowKeys2('')
        }
      } else{
        const keys =[];
        table.normalData.forEach(item=>{
          keys.push(item.code)
        })
        const index = []
        keys.forEach(item=>{
          index.push(item)
        });
        setSelectedRowKeys2(index)
        setRobotPatrolIds(index)
      }
    }
  }
  const selectAll3 =()=>{
    if(selectedRowKeys3){
      if(table.notCheckData.length !== selectedRowKeys3.length){
        const keys =[];
        table.notCheckData.forEach(item=>{
          keys.push(item.code)
        })
        const index = []
        keys.forEach(item=>{
          index.push(item)
        });
        setSelectedRowKeys3(index)
        setRobotPatrolIds(index)
      } else {
        setSelectedRowKeys3('')
      }
    } else{
      const keys =[];
        table.notCheckData.forEach(item=>{
          keys.push(item.code)
        })
      const index = []
      keys.forEach(item=>{
        index.push(item)
      });
      setSelectedRowKeys3(index)
      setRobotPatrolIds(index)
    }
  }
  //列表逐条数据选择
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      let ids = new Set()
      setSelectedRowKeys(selectedRowKeys)
      selectedRowKeys.forEach (item =>{
        ids.add(item.substring(0,item.length-1))
      });
      setRobotPatrolIds(...ids)
    }
  }
  //列表逐条数据选择
  const rowSelection2 = {
    selectedRowKeys:selectedRowKeys2,
    onChange: (selectedRowKeys2) => {
      let ids = new Set()
      setSelectedRowKeys2(selectedRowKeys2)
      ids.add(selectedRowKeys2)
      setRobotPatrolIds(...ids)
    }
  }
  //列表逐条数据选择
  const rowSelection3 = {
    selectedRowKeys:selectedRowKeys3,
    onChange: (selectedRowKeys3) => {
      let ids = new Set()
      setSelectedRowKeys3(selectedRowKeys3)
      ids.add(selectedRowKeys3)
      setRobotPatrolIds(...ids)
    }
  }

  return (
    <div>
      <div>
      <Row>
      <Col span={12}>
        <Form layout="inline" style={{margin: 30}} form={form}>
          <Form.Item name="objectDesc">
            <Input placeholder="请输入设备名称"
              onChange={
                (value)=>{
                  setFormValue({...formValue, objectDesc:value.target.value})
                }
              }
              />
          </Form.Item>
          <Form.Item name="propertyDesc">
            <Input placeholder="请输入属性名称"
              onChange={
                (value)=>{
                  setFormValue({...formValue, propertyDesc:value.target.value})
                }
              }
              />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>搜索</Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={12}>
      </Col>
    </Row>
    <Row gutter={16} style={{ background: '#ECECEC', padding: '30px' }}>
      <Col span={3}>
        <Card title="待巡检次数" bordered={false}>
          {data.noRobotPatrolNum}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="巡检次数" bordered={false}>
          {data.robotPatrolNum}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="异常巡检次数" bordered={false}>
          {data.isErrorNum}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="未检出次数" bordered={false}>
          {data.noPatrolNum}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="正常巡检次数" bordered={false}>
          {data.isNotErrorNum}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="完成率" bordered={false}>
          {data.patrolNumPer}
        </Card>
      </Col>
      <Col span={3}>
        <Card title="未检出率" bordered={false}>
          {data.noPatrolNumPer}
        </Card>
      </Col>
    </Row>
      </div>
      <Tabs type="card">
        <TabPane tab="异常数据" key="1">
          <Table loading={loading} columns={columns} rowSelection={rowSelection} rowKey={(record,index) => record.code+index} dataSource={table.unnormalData} size="small" pagination={false}/>
          <Row type="flex" justify="space-between" style={{margin:30}}>
            <Col>
              <Checkbox onChange={selectAll} checked={isChecked}>全选</Checkbox>
              <Button type="danger" ghost onClick={error}>异常</Button>
              <Button type="danger" ghost onClick={normal}>正常</Button>
            </Col>
            <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
        </TabPane>
        <TabPane tab="正常数据" key="2">
          <Table loading={loading2} columns={columns} rowSelection={rowSelection2} rowKey="code" dataSource={table.normalData} size="small" pagination={false}/>
          <Row type="flex" justify="space-between" style={{margin:30}}>
            <Col>
              <Checkbox onChange={selectAll2} checked={isChecked2}>全选</Checkbox>
              <Button type="danger" ghost onClick={error}>异常</Button>
              <Button type="danger" ghost onClick={normal}>正常</Button>
            </Col>
            <Col><Pagination onShowSizeChange={pageSizeChange2} pageSize={paging2.pageSize} onChange={pageNumberOnChange2} total={paging2.total} current={paging2.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
        </TabPane>
        <TabPane tab="未检出数据" key="3">
          <Table loading={loading3} columns={columns} rowSelection={rowSelection3} rowKey="code" dataSource={table.notCheckData} size="small" pagination={false}/>
          <Row type="flex" justify="space-between" style={{margin:30}}>
            <Col>
              <Checkbox onChange={selectAll3} checked={isChecked3}>全选</Checkbox>
              <Button type="danger" ghost onClick={error}>异常</Button>
              <Button type="danger" ghost onClick={normal}>正常</Button>
            </Col>
          <Col><Pagination onShowSizeChange={pageSizeChange3} pageSize={paging3.pageSize} onChange={pageNumberOnChange3} total={paging3.total} current={paging3.currentPage} showSizeChanger showQuickJumper /></Col>
          </Row>
        </TabPane>
      </Tabs>
      <Row type="flex" justify="space-between" style={{margin:30}}>
    </Row>
    </div>
  )
}

export default React.memo(PatrolDetailModal);
