import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

const MaintenanceData = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('maintenanceData'), 'light');
    myChart.setOption({
      title: {
        text: "维护数据"
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
        data: ['待维护次数', '维护完成次数', '维护时长']
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
      }, {
        name: '时长（h）',
        type: 'value'
      }],
      series: [{
        name: '待维护次数',
        data: [11, 8, 6, 2],
        type: 'bar'
      }, {
        name: '维护完成次数',
        data: [2, 3, 7, 10],
        type: 'bar'
      }, {
        name: '维护时长',
        type: 'line',
        yAxisIndex: 1,
        data: [10, 4, 8, 6]
      }]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='maintenanceData' style={{ height: 320 }}></div>
  )
}

export default MaintenanceData;