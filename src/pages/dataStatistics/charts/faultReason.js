import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

const FaultReason = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('faultReason'), 'light')
    myChart.setOption({
      title: {
        text: "故障原因"
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['外部原因', '内部原因']
      },
      series: [
        {
          name: '故障原因',
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          },
          data: [
            { value: 10, name: '外部原因' },
            { value: 20, name: '内部原因' }
          ]
        }
      ]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='faultReason' style={{ height: 200 }}></div>
  )
}

export default FaultReason;