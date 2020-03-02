import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

const SiteFaultRate = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('siteFaultRate'), 'light');
    myChart.setOption({
      title: {
        text: "站点故障率"
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
        data: ['设备数量', '故障数量', '故障率']
      },
      xAxis: {
        type: 'category',
        data: ['虹桥火车站', "徐泾路"]
      },
      yAxis: [{
        name: '数量',
        type: 'value',
        axisLabel: {
            formatter: '{value}'
        }
      }, {
        name: '百分比',
        type: 'value',
        axisLabel: {
            formatter: '{value} %'
        }
      }],
      series: [{
        name: '设备数量',
        data: [11, 8],
        type: 'bar',
        stack: '总量'
      }, {
        name: '故障数量',
        data: [2, 3],
        type: 'bar',
        stack: '总量'
      }, {
        name: '故障率',
        type: 'line',
        yAxisIndex: 1,
        data: [10, 8]
      }]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='siteFaultRate' style={{ height: 260 }}></div>
  )
}

export default SiteFaultRate;