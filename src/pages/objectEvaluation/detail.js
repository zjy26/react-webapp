
import React, { useState, useEffect} from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Tooltip, Table, Empty, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react'
import { getFaultRateOption, getScoreOption } from './chart'
import { objectEvaluation } from '../../api'
import styles from './ObjectEvaluation.module.scss'

const Detail = props => {
  const [scoreResult, setScoreResult] = useState([])  //健康度综合数据

  const [indicatorList, setIndicatorList] = useState([])
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)

  const createNewArr=(data)=>{
    return data.reduce((result, item) => {
    //首先将time字段作为新数组result取出
      if (result.indexOf(item.time) < 0) {
        result.push(item.time)
      }
      return result
    }, []).reduce((result, time) => {
    //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter(item => item.time === time);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0,//将第一行数据添加rowSpan字段
        }))
      )
      return result;
    }, [])
  }

  const columns = [
    {
      title: 'time',
      dataIndex: 'time',
      key: 'time',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        }
        obj.props.rowSpan = row.rowSpan
        return obj
      }
    },
    {
      title: 'contente',
      dataIndex: 'contente',
      key: 'contente',
    },
    {
      title: 'result',
      dataIndex: 'result',
      key: 'result',
    },
  ]


  switch (score){
    case score<=60:
      var scoreText = "需整改，建议对核心部件进行更换"
      break;
    case score>80:
      scoreText = "可接受"
      break;
    default:
      scoreText = "需观察，建议加大维护频率"
  }

  useEffect(()=>{
    setLoading(true)
    objectEvaluation.objectEvaluationDetail()
    .then(res=>{
      if(res && res.model.resultList) {
        const data= []
        const result = res.model.resultList
        result.forEach(item=>{
          const arr = []
          arr.push(item.date)
          arr.push(item.score)
          data.push(arr)
        })
        setScoreResult(data)
      }
      if(res && res.model.indicatorList) {
        const result = res.model.indicatorList
        setLoading(false)
        setIndicatorList(result)
        setScore(res.model.nowValue)
      }
    })
    .catch(err=>{
      console.log("设备评价详情数据获取失败")
    })
  }, [])

  return (
    <div>
      {
        loading===true ? <div className={styles.spin}><Spin /></div> :
        indicatorList.length>0 ?
        <Row type="flex" justify="start">
          <Col span={6} offset={1}><h3>设备当前健康评分：<span className={styles.score}>{score}分</span></h3></Col>
          <Col span={11}>
            <h3>设备当前健康状态： <span className={styles.status}>{scoreText}</span>
              <Tooltip
                title={
                  <div>
                    <div>{'综合评分x:'}</div>
                    <div>{'x>80：可接受'}</div>
                    <div>{'60<x<80：需观察'}</div>
                    <div>{'x<=60：需整改'}</div>
                  </div>
                }
              >
                <QuestionCircleOutlined style={{ marginLeft: '0.25em' }} />
              </Tooltip>
            </h3>
          </Col>
          <Col span={24} style={{marginLeft:30}}>
            <ReactEcharts
              option={getScoreOption("设备健康度综合评分", scoreResult)}
              theme="light"
              style={{width: '80%',height:'650px'}}
            />
          </Col>
        </Row>: null
      }
      {
        loading===true ? null :
        indicatorList.length>0 ? indicatorList.map((item, index)=>
          <Row style={{margin:"0 20px"}} key={index}>
            <Col span={24} style={{marginTop:30}}><h2>{item.name} {item.indicatorValue}分</h2></Col>
            <Col span={12}>
              <Table rowKey="id" columns={columns} dataSource={createNewArr(item.recordList)} pagination={{pageSize:8}} showHeader={false}/>
            </Col>
            <Col span={12}>
              <ReactEcharts
                option={getFaultRateOption(item.name, item.list)}
                theme="light"
                style={{width: '100%',height:'450px'}}
              />
            </Col>
          </Row>
        ) : <Empty />
      }
    </div>
  );
}

export default React.memo(Form.create()(Detail))
