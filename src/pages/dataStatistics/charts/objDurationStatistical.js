import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

const ObjDurationStatistical = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('objDurationStatistical'), 'light');
    myChart.setOption({
      title: {
        text: "设备年限统计"
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
        data: ['使用1年以内数量', '使用1到3年数量', '使用3到5年数量', '使用5年以上数量']
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
        name: '使用1年以内数量',
        data: [11, 8, 6, 2],
        type: 'bar'
      }, {
        name: '使用1到3年数量',
        data: [8, 5, 4, 3],
        type: 'bar'
      }, {
        name: '使用3到5年数量',
        data: [2, 3, 7, 10],
        type: 'bar'
      }, {
        name: '使用5年以上数量',
        data: [6, 4, 9, 5],
        type: 'bar'
      }]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='objDurationStatistical' style={{ height: 320 }}></div>
  )
}

export default ObjDurationStatistical;