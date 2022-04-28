import React from 'react'
import { 
  Chart,
  Tooltip,
  Line,
  Interval,
  Axis,
  Legend,
  Annotation
} from 'bizcharts'
import ReactEcharts from 'echarts-for-react'
import { pictorialBarOption, colBarOption } from './echarts'


const data = [
  { name: 'London', month: 'Jan.', value: 18.9, value2: 22},
  { name: 'London', month: 'Feb.', value: 28.8, value2: 50},
  { name: 'London', month: 'Mar.', value: 39.3, value2: 35},
  { name: 'London', month: 'Apr.', value: 81.4, value2: 40 },
  { name: 'London', month: 'May', value: 47, value2: 60 },
  { name: 'London', month: 'Jun.', value: 20.3, value2: 45 },
  { name: 'London', month: 'Jul.', value: 24, value2: 22 },
  { name: 'Berlin', month: 'Jan.', value: 12.4, value2: 22 },
  { name: 'Berlin', month: 'Feb.', value: 23.2, value2: 50 },
  { name: 'Berlin', month: 'Mar.', value: 34.5, value2: 35 },
  { name: 'Berlin', month: 'Apr.', value: 99.7, value2: 40 },
  { name: 'Berlin', month: 'May', value: 52.6, value2: 60},
  { name: 'Berlin', month: 'Jun.', value: 35.5, value2: 45 },
  { name: 'Berlin', month: 'Jul.', value: 37.4, value2: 22 },
]
const lineData = [
  {date: '20200228', value: -60},
  {date: '20200229', value: 80},
  {date: '20200301', value: 90},
  {date: '20200302', value: -89},
  {date: '20200303', value: 79},
  {date: '20200304', value: 89},
  {date: '20200305', value: 20},
  {date: '20200306', value: 79},
  {date: '20200307', value: 69},
]
const Grouped = () => {

  return (
    <React.Fragment>
      <h3>数据总览图</h3>
      <Chart 
        height={300}
        padding={30}
        autoFit
        data={data}
      >
        <Tooltip shared />
        <Legend position="right-top" layout="horizontal"/> 
        <Axis name="value" grid={null} />
        <Axis name="value2" grid={null} />
        <Legend
            custom
            position="right-top"
            layout="horizontal"
            items={
              [
                {
                  name: 'London',
                  marker: {
                    symbol: 'square',
                    style: { fill: "#6394f9", r: 5 }
                  },
                },
                {
                  name: 'Berlin',
                  marker: {
                    symbol: 'square',
                    style: { fill: '#62daaa', r: 5 }
                  },
                },
                {
                  name: '折线',
                  marker: {
                    symbol: 'hyphen',
                    style: { stroke: '#6394f9', r: 5, lineWidth: 3 }
                  }
                }
              ]
            }
        />
        <Interval
          adjust={[{
              type: 'dodge',
              marginRatio: 0,
            },
          ]}
          color="name"
          position="month*value"
        />
        <Line position="month*value2" />
      </Chart>

      <h3>数据分析图</h3>
      <Chart
        height={300}
        width={500}
        padding={[30, 30, 60, 30]}
        autoFit
        data={lineData}
      >
        <Axis name="value"   />
        <Axis name="date" line={false} />
        <Annotation.Line
          start={['0%', '50%']}
          end={['100%', '50%']}
          color="#6394f9"
          style={{
            stroke: "#6394f9",
            lineWidth: 1,
            lineDash: [3, 3],
          }}
        />
        <Line position="date*value" />
      </Chart>

      <ReactEcharts
        option={pictorialBarOption()}
        theme="light"
        style={{width: '100%',height:'400px'}}
      />

      <ReactEcharts
        option={colBarOption()}
        theme="light"
        style={{width: '100%',height:'400px'}}
      />
    </React.Fragment>
  )
}

const View = () => {
  return (
    <Grouped />
  )
}

export default React.memo(View)