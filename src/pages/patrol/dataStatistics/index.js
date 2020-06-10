import React, { useState, useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Tabs, Form, Card, Button, DatePicker, Select, Table } from 'antd';
import ObjDetailModal from './objDetailModal';
import { Link } from 'react-router-dom'
import { getFaultStatisticsByBrandOption, getFaultReason, getSiteFaultRate, getObjPipe, getMaintainOption, getObjDurationStatisticalOption,getImplementationPieOption } from './chart'
import ReactEcharts from 'echarts-for-react'
import moment from "moment"
import { dataStatistics } from '../../../api'
import { connect } from 'react-redux'

const objColumns = [
  {
    title: '排名',
    dataIndex: 'ranking',
    key: 'ranking'
  },
  {
    title: '设备名称',
    dataIndex: 'objName',
    key: 'objName'
  },
  {
    title: '历史故障次数',
    dataIndex: 'failureCount',
    key: 'failureCount'
  },
  {
    title: '解决故障次数',
    dataIndex: 'solveCount',
    key: 'solveCount'
  },
  {
    title: '故障处理率',
    dataIndex: 'solveRate',
    key: 'solveRate'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'runDistance',
    key: 'runDistance'
  },
  {
    title: '上次维护时间',
    dataIndex: 'lastMaintain',
    key: 'lastMaintain',
    render: (text, record) => moment(record.startDate).format('YYYY-MM-DD')
  }
]

const brandColumns = [
  {
    title: '排名',
    dataIndex: 'ranking',
    key: 'ranking'
  },
  {
    title: '品牌名称',
    dataIndex: 'brandName',
    key: 'brandName'
  },
  {
    title: '历史故障次数',
    dataIndex: 'failureCount',
    key: 'failureCount'
  },
  {
    title: '解决故障次数',
    dataIndex: 'solveCount',
    key: 'solveCount'
  },
  {
    title: '未解决故障个数',
    dataIndex: 'unsolveCount',
    key: 'unsolveCount'
  },
  {
    title: '故障率',
    dataIndex: 'solveRate',
    key: 'solveRate'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'runDistance',
    key: 'runDistance'
  }
]

const { TabPane } = Tabs;
const DataStatistics = props => {
  const [form] = Form.useForm()
  const locationTree = props.location.toJS()
  const [toDay] = useState(new Date());
  const [search, setSearch] = useState(0)
  const [search2, setSearch2] = useState(0)
  const [search3, setSearch3] = useState(0)
  const [search4, setSearch4] = useState(0)
  const { MonthPicker  } = DatePicker;
  const [faultBrand, setFaultBrand] = useState([])
  const [fault, setFault] = useState([])
  const [troubleshooting, setTroubleshooting] = useState([])

  const [equipmentBrand, setEquipmentBrand] = useState([])
  const [bet13, setBet13] = useState([])
  const [bet35, setBet35] = useState([])
  const [less1, setLess1] = useState([])
  const [more5, setMore5] = useState([])

  const [detailData, setDetailData] = useState([])  //设备统计详情
  const [maintainBrand, setMaintainBrand] = useState([])
  const [maintain, setMaintain] = useState([])
  const [unmaintained, setUnmaintained] = useState([])
  const [stoptime, setStoptime] = useState([])
  const [situation, setSituation] = useState({})

  const [formValue, setFormValue] = useState({
    dateTime: toDay,
    line: 1117,
    date: toDay,
    faultMonth: toDay,
    lineStation: 1117,
    day: toDay
  })
  const [loading, setLoading] = useState(true)
  const [intactRate, setIntactRate] = useState({
    inRate: '',
    intactRate: '',
    outRate: ''
  })
  const [data, setData] = useState([])  //列表数据
  const [table, setTable] = useState({
    data: [],
    objData: [],
    brandData: []
  });
  const [siteFaultRate, setSiteFaultRate] = useState({
    site: [],
    objCount: [],
    failureCount: [],
    rare: [],
  });
  const [inspectionTable, setInspectionTable] = useState({
    data: []
  });
  const [visible, setVisible] = useState({  //弹窗
    showObj: false,
    showPatrol: false
  });

  const columns = [
    {
      title: '线路',
      dataIndex: 'locDesc',
      key: 'locDesc',
      width: 120
    },
    {
      title: '站点',
      dataIndex: 'site',
      key: 'site',
      width: 120
    },
    {
      title: '设备数量',
      dataIndex: 'objCount',
      key: 'objCount',
      width: 120
    },
    {
      title: '故障数量',
      dataIndex: 'failureCount',
      key: 'failureCount',
      width: 120
    },
    {
      title: '停用数量',
      dataIndex: 'stopCount',
      key: 'stopCount',
      width: 120
    },
    {
      title: '故障率',
      dataIndex: 'failureRate',
      key: 'failureRate',
      width: 120,
      render: (text, record) =>{
      return(
        text?text/record.siteList.length:text
      )
      }
    },
    {
      title: '停用时长',
      dataIndex: 'sumStopTime',
      key: 'sumStopTime',
      width: 120
    },
    {
      title: '运行里程',
      dataIndex: 'runDistance',
      key: 'runDistance',
      width: 120,
      render: (text, record) =>{
        return(
          text?text/record.siteList.length:text
        )
      }
    },
    {
      title: '品牌名称',
      dataIndex: 'brand',
      key: 'brand',
      width: 240
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <Button type="link" size={'small'} onClick={()=>{checkDetail(record.ids)}}>
            查看详情
          </Button>
        )
      }
    }
  ];

  const siteColumns = [
    {
      title: '线路',
      dataIndex: 'site',
      key: 'site',
      width: 120
    },
    {
      title: '站点',
      dataIndex: 'locDesc',
      key: 'locDesc',
      width: 120
    },
    {
      title: '设备数量',
      dataIndex: 'objCount',
      key: 'objCount',
      width: 120
    },
    {
      title: '故障数量',
      dataIndex: 'failureCount',
      key: 'failureCount',
      width: 120
    },
    {
      title: '停用数量',
      dataIndex: 'stopCount',
      key: 'stopCount',
      width: 120
    },
    {
      title: '故障率',
      dataIndex: 'failureRate',
      key: 'failureRate',
      width: 120
    },
    {
      title: '停用时长',
      dataIndex: 'sumStopTime',
      key: 'sumStopTime',
      width: 120
    },
    {
      title: '运行里程',
      dataIndex: 'runDistance',
      key: 'runDistance',
      width: 120
    },
    {
      title: '品牌名称',
      dataIndex: 'brand',
      key: 'brand',
      width: 240
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <Button type="link" size={'small'} onClick={()=>{checkDetail(record.ids)}}>
            查看详情
          </Button>
        )
      }
    }
  ];

  const patrolColumns = [
    {
      title: '线路',
      dataIndex: 'siteDesc',
      key: 'siteDesc',
      width: 120
    },
    {
      title: '站点',
      dataIndex: 'site',
      key: 'site',
      width: 120,
      render: (text, record) => {
          if(locationTree&&locationTree.site) {
            const item = locationTree.site.find(obj=>obj.value===record.site)
            if(item)
              return item.label
          }
        }
    },
    {
      title: '待巡检次数',
      dataIndex: 'noRobotPatrolNum',
      key: 'noRobotPatrolNum',
      width: 120
    },
    {
      title: '巡检次数',
      dataIndex: 'robotPatrolNum',
      key: 'robotPatrolNum',
      width: 120
    },
    {
      title: '异常巡检次数',
      dataIndex: 'isErrorNum',
      key: 'isErrorNum',
      width: 120
    },
    {
      title: '未检出次数',
      dataIndex: 'noPatrolNum',
      key: 'noPatrolNum',
      width: 120
    },
    {
      title: '正常巡检次数',
      dataIndex: 'isNotErrorNum',
      key: 'isNotErrorNum',
      width: 120
    },
    {
      title: '完成率',
      dataIndex: 'patrolNumPer',
      key: 'patrolNumPer',
      width: 120
    },
    {
      title: '未检出率',
      dataIndex: 'noPatrolNumPer',
      key: 'noPatrolNumPer',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <Button type="link" size={'small'}>
            <Link to={"/robot-patrol-order-site-detail/"+record.site +"/"+moment(formValue.dateTime).format('YYYY-MM-DD')}>查看详情</Link>
          </Button>
        )
      }
    }
  ]

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showObj: false,
      showPatrol: false
    });
  }
  //获取列表数据
  useEffect(() => {
    document.title = "数据统计";
    let siteList=''
    let codeList=''
    setLoading(true)
    //设备统计按站点归类
    dataStatistics.robotObjGroupBySiteList({queryDate: moment(formValue.dateTime).format('YYYY-MM-DD HH:mm:ss')})
    .then(res => {
      if(res.robotObjGroupBySiteList){
        siteList = res.robotObjGroupBySiteList
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    .then(res => {
      //设备排名--按设备归类
      dataStatistics.robotObjSortByCode()
      .then(res => {
        if(res.robotObjSortByCodeList){
          codeList=res.robotObjSortByCodeList
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
      .then(res => {
        //设备排名—按品牌归类
        dataStatistics.robotObjSortByBrand()
        .then(res => {
          if(res){
            setTable({
              data:siteList,
              objData:codeList,
              brandData:res.robotObjSortByBrandList
            })
            setLoading(false)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      })
    })
    dataStatistics.robotObjRealSituation()
    .then(res => {
      if(res.robotObjRealSituationList){
        setSituation(res.robotObjRealSituationList[0])
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    //巡检单统计
    dataStatistics.robotpatrolRobotPatrolOrderCount({day: moment(formValue.dateTime).format('YYYY-MM-DD'),_method:'PUT'})
    .then(res => {
        if(res.statics){
          setData(res.statics)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    //分线路统计巡检情况
    dataStatistics.robotPatrolOrderSiteCount({day: moment(formValue.dateTime).format('YYYY-MM-DD'),_method:'PUT'})
    .then(res => {
        if(res){
          setInspectionTable({
            data : res.models
          })
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(()=>{
    //站点故障率接口
    dataStatistics.robotObjSiteFailureRate({line:formValue.line,queryDate: moment(formValue.date).format('YYYY-MM-DD HH:mm:ss')})
    .then(res => {
      const objCountArr =[], failureCountArr = [],locDescArr = [],failureRateArr = []
        if(res && res.robotObjSiteFailureRateList.length>0) {
          for(let i =0; i<res.robotObjSiteFailureRateList.length; i++) {
            objCountArr.push(res.robotObjSiteFailureRateList[i].objCount)
            failureCountArr.push(res.robotObjSiteFailureRateList[i].failureCount)
            locDescArr.push(res.robotObjSiteFailureRateList[i].locDesc)
            failureRateArr.push(res.robotObjSiteFailureRateList[i].failureRate)
          }
          setSiteFaultRate({
            site:locDescArr,
            objCount:objCountArr,
            failureCount:failureCountArr,
            rare:failureRateArr
          })
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    dataStatistics.robotObjIntactRate({line:formValue.line,queryDate: moment(formValue.date).format('YYYY-MM-DD HH:mm:ss')})
    .then(res => {
      if(res.robotObjIntactRateList){
        setIntactRate({
          inRate:res.robotObjIntactRateList[0].inRate,
          intactRate:res.robotObjIntactRateList[0].intactRate,
          outRate:res.robotObjIntactRateList[0].outRate
        })
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search2])

  useEffect(()=>{
    //故障统计接口（按品牌）
    dataStatistics.faultStatisticsByBrand({thisMonth: moment(formValue.faultMonth).format('YYYY-MM')})
    .then(res => {
      const faultBrandArr =[], troubleshootingArr = [],faultArr = []
      if(res && res.models.length>0) {
        for(let i =0; i<res.models.length; i++) {
        faultBrandArr.push(res.models[i].brand)
          troubleshootingArr.push(res.models[i].troubleshooting)
          faultArr.push(res.models[i].fault)
        }
        setFaultBrand(faultBrandArr)
        setTroubleshooting(troubleshootingArr)
        setFault(faultArr)
        }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    //维护数据接口（按品牌）
    dataStatistics.maintainDataByBrand({thisMonth: moment(formValue.faultMonth).format('YYYY-MM')})
    .then(res => {
      const brandArr =[], maintainArr = [],UnmaintainedArr = [],StoptimeArr=[]
      if(res && res.models.length>0) {
        for(let i =0; i<res.models.length; i++) {
          brandArr.push(res.models[i].brand)
          maintainArr.push(res.models[i].maintain)
          UnmaintainedArr.push(res.models[i].unmaintained)
          StoptimeArr.push(res.models[i].stoptime)
        }
        setMaintainBrand(brandArr)
        setMaintain(maintainArr)
        setStoptime(StoptimeArr)
        setUnmaintained(UnmaintainedArr)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search3])

  useEffect(()=>{
    //设备年限统计接口（按品牌）
    dataStatistics.equipmentAgeStatisticsByBrand({thisday: moment(formValue.day).format('YYYY-MM-DD'), line: formValue.lineStation})
    .then(res => {
      const equipmentBrand =[], bet13Arr = [],bet35Arr = [],less1Arr=[],more5Arr=[]
      if(res && res.models.length>0) {
        for(let i =0; i<res.models.length; i++) {
          equipmentBrand.push(res.models[i].brand)
          bet13Arr.push(res.models[i].bet13)
          bet35Arr.push(res.models[i].bet35)
          less1Arr.push(res.models[i].less1)
          more5Arr.push(res.models[i].more5)
        }
        setEquipmentBrand(equipmentBrand)
        setBet13(bet13Arr)
        setBet35(bet35Arr)
        setLess1(less1Arr)
        setMore5(more5Arr)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search4])

  //搜索
  const handleSearch = async () => {
    try {
      const values = await form.validateFields()
      if (values.dateTime) {
        setSearch(search=>search+1)
      }
    }
    catch {}
  }
  //搜索
  const handleSearch2 = async () => {
    try {
      const values = await form.validateFields()
      if (values.date) {
        setSearch2(search2=>search2+1)
      }
    }
    catch {}
  }

  //搜索
  const handleSearch3 = async () => {
    try {
      const values = await form.validateFields()
      if (values.faultMonth) {
        setSearch3(search3=>search3+1)
      }
    }
    catch {}
  }
  //搜索
  const handleSearch4 = async () => {
    try {
      const values = await form.validateFields()
      if (values.day) {
        setSearch4(search4=>search4+1)
      }
    }
    catch {}
  }

  const expanded = (data) => {
    return (
      <Table
        rowKey="site"
        columns={patrolColumns}
        dataSource={data}
        showHeader={false}
        pagination={false}
      />
    );
  }
  const siteListexpanded = (data) => {
    return (
      <Table
        rowKey="locDesc"
        columns={siteColumns}
        dataSource={data}
        showHeader={false}
        pagination={false}
      />
    );
  }
  //查看详情
  const checkDetail = (id)=>{
    setDetailData({
      queryDate : moment(formValue.dateTime).format('YYYY-MM-DD HH:mm:ss'),
      robotIds : id
    })
    setVisible({...visible, showObj:true})
  }
  return (
    <div>
      <Form form={form} layout="inline" style={{margin: 30}} initialValues={{dateTime:moment(toDay)}}>
        <Form.Item name="dateTime">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
            onChange={
              (value)=>{
                  setFormValue({...formValue, dateTime:value})
                }
              }
              placeholder="请选择日期"
            />
        </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={handleSearch}>筛选</Button>
      </Form.Item>

      </Form>
      <Tabs type="card">
        <TabPane tab="设备统计" key="1">
          <Table loading={loading} columns={columns}
          expandedRowRender={record=>{
              if (record&&record.siteList&&record.siteList.length>0) {
                return siteListexpanded(record.siteList)
              }
            }
          }
          rowKey="ids" dataSource={table.data} defaultExpandedRowKeys={[1]} pagination={false}/>
          <Row>
            <Col span={12}>
              <Table loading={loading} columns={objColumns} rowKey="ranking" dataSource={table.objData} size="small" />
            </Col>
            <Col span={12}>
              <Table loading={loading} columns={brandColumns} rowKey="ranking" dataSource={table.brandData} size="small" />
            </Col>
          </Row>
          <div style={{ background: '#ECECEC', padding: '30px' }}>
            <Row gutter={16} style={{height: '200px', width: '100%'}} >
              <Col span={8}>
              <Card>
              <ReactEcharts
              option={getImplementationPieOption(situation.maintainCount, situation.runningCount, situation.repairCount, situation.toMaintainCount)}
              theme="light"
              style={{height: '80px', width: '100%'}}
            />
            </Card>
              </Col>
              <Col span={3}>
                <Card title="正在运行" bordered={false}>
                  {situation.runningCount}
                </Card>
              </Col>
              <Col span={3}>
                <Card title="待维护运行" bordered={false}>
                  {situation.toMaintainCount}
                </Card>
              </Col>
              <Col span={3}>
                <Card title="故障运行" bordered={false}>
                  0
                </Card>
              </Col>
              <Col span={3}>
                <Card title="停机维护" bordered={false}>
                  {situation.maintainCount}
                </Card>
              </Col>
              <Col span={3}>
                <Card title="停机修复" bordered={false}>
                  {situation.repairCount}
                </Card>
              </Col>
            </Row>
            <Card>
            <Row>
              <Col span={24}>
                <Form form={form} layout="inline" style={{margin: 30}} initialValues= {{line:'17号线',date:moment(toDay)}} >
                  <Form.Item name="line">
                    <Select placeholder="请选择线路"
                        onChange={
                          (value)=>{
                            setFormValue({...formValue, line:value})
                          }
                        }>
                        {locationTree.line && locationTree.line.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.label}
                            </Select.Option>
                            )
                          )
                        }
                      </Select>
                  </Form.Item>
                  <Form.Item name="date">
                    <DatePicker
                      onChange={
                        (value)=>{
                          setFormValue({...formValue, date:value})
                        }
                      }
                      placeholder="请选择日期" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSearch2}>搜索</Button>
                  </Form.Item>
                </Form>
                </Col>
                <Col span={12}>
                <Card>
                <ReactEcharts
                option={getSiteFaultRate(siteFaultRate.site, siteFaultRate.objCount,siteFaultRate.failureCount,siteFaultRate.rare)}
                theme="light"
                style={{height: '350px', width: '100%'}}
              />
              </Card>
              </Col>
              <Col span={12}>
                <Card>
                <ReactEcharts option={getObjPipe(intactRate.intactRate)} theme="light" style={{height: '150px', width: '100%'}}/>
                </Card>
                <Card>
                <ReactEcharts option={getFaultReason(intactRate.inRate,intactRate.outRate)} theme="light" style={{height: '150px', width: '100%'}}/>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form form={form} layout="inline" style={{margin: 30}} initialValues={{faultMonth:moment(toDay)}}>
                  <Form.Item name="faultMonth">
                    <MonthPicker
                      onChange={
                        (value)=>{
                          setFormValue({...formValue, faultMonth:value})
                        }
                      }
                      placeholder="请选择月份" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSearch3}>搜索</Button>
                  </Form.Item>
                </Form>
                <ReactEcharts
                option={getFaultStatisticsByBrandOption(faultBrand, fault,troubleshooting)}
                theme="light"
              />
              </Col>
              <Col span={12} style={{marginTop:"100px"}}>
              <ReactEcharts
              option={getMaintainOption(maintainBrand, maintain,unmaintained,stoptime)}
              theme="light"
            />
              </Col>
            </Row>
            </Card>
            <Row>
              <Col span={12}>
                <Form form={form} layout="inline" style={{margin: 30}} initialValues= {{lineStation:'17号线',day:moment(toDay)}}>
                  <Form.Item name="lineStation" value= '17号线'>
                    <Select placeholder="请选择线路"
                    onChange={
                      (value)=>{
                        setFormValue({...formValue, lineStation:value})
                      }
                    }
                    >
                    {locationTree.line && locationTree.line.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                      ))
                     }
                    </Select>
                  </Form.Item>
                  <Form.Item name="day">
                    <DatePicker
                        onChange={
                          (value)=>{
                            setFormValue({...formValue, day:value})
                          }
                        }
                        placeholder="请选择日期" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSearch4}>搜索</Button>
                  </Form.Item>
                </Form>
                <ReactEcharts
                option={getObjDurationStatisticalOption(equipmentBrand, less1,bet13,bet35,more5)}
                theme="light"
              />
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane tab="巡检统计" key="2">
          <div>
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
              <Table
                rowKey="site"
                columns={patrolColumns}
                dataSource={inspectionTable.data}
                size="small"
                pagination={false}
                expandedRowRender={record=>{
                    if (record&&record.value&&record.value.length>0) {
                      return expanded(record.value)
                    }
                  }
                }
              />
          </div>
        </TabPane>
      </Tabs>

      <ObjDetailModal visible={visible.showObj} {...{detailData,handleCancel}}/>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}

export default connect(mapStateToProps, null)(React.memo(DataStatistics));
