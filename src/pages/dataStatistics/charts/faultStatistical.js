import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

const FaultStatistical = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('faultStatistical'), 'light');
    myChart.setOption({
      title: {
        text: "故障统计"
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['故障次数', '故障解决次数']
      },
      xAxis: {
        type: 'category',
        data: ['西门子', "安科瑞", "百能堡", "艾百勤"]
      },
      yAxis: [{
        name: '数量',
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      }],
      series: [{
        name: '故障次数',
        data: [11, 8, 6, 2],
        type: 'bar'
      }, {
        name: '故障解决次数',
        data: [2, 3, 7, 10],
        type: 'bar'
      }]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='faultStatistical' style={{ height: 320 }}></div>
  )
}

export default FaultStatistical;