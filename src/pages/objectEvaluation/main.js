import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { getVoltageLevelOption, getSiteOption } from './chart'
import { objectEvaluation } from '../../api'
import styles from './ObjectEvaluation.module.scss'

//数组排序
const compare = (key) => {
  return function(value1, value2) {
    const val1 = value1[key]
    const val2 = value2[key]
    return val1-val2
  }
}

const Main = props => {

  const [voltageY, setVoltageY] = useState([])
  const [voltageData, setVoltageData] = useState([])

  const [siteY, setSiteY] = useState([])
  const [siteData, setSiteData] = useState([])
  const [score, setScore] = useState(null)

  useEffect(()=>{
    objectEvaluation.objectEvaluationVoltage()
    .then(res=>{
      const nameArr =[], valueArr = []
      const result = res && res.model
      const sortResult = result.sort(compare('value'))
      if(sortResult.length>0) {
        for(let i =0; i<sortResult.length; i++) {
          nameArr.push(sortResult[i].name)
          valueArr.push(Math.round(sortResult[i].value*100)/100)
        }
        setVoltageY(nameArr)
        setVoltageData(valueArr)

        setScore(Math.round(res.value*100)/100)   //保留两位小数
      }
    })
    .catch(err=>{
      console.log("各电压等级设备评分获取失败")
    })

    objectEvaluation.objectEvaluationsite()
    .then(res=>{
      const nameArr =[], valueArr = []
      const result = res && res.model
      const sortResult = result.sort(compare('value'))
      if(sortResult.length>0) {
        for(let i =0; i<sortResult.length; i++) {
          nameArr.push(sortResult[i].name)
          valueArr.push(Math.round(sortResult[i].value*100)/100)
        }
        setSiteY(nameArr)
        setSiteData(valueArr)
      }
    })
    .catch(err=>{
      console.log("各站点设备评分获取失败")
    })

  }, [setVoltageData])

  return (
    <div className={styles.mainSelect}>
      <Row>
        <Col span={20}>
          <h2>设备健康评分：<span className={styles.score}>{score}分</span></h2>
        </Col>
      </Row>
      <ReactEcharts
        option={getVoltageLevelOption(voltageY, voltageData)}
        theme="light"
        style={{width: '100%',height:'400px'}}
      />
      <ReactEcharts
        option={getSiteOption(siteY, siteData)}
        theme="light"
        style={{width: '100%',height:'600px'}}
      />
    </div>
  )
}

export default React.memo(Main)
