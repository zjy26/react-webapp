import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';

const ObjPipe = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('ObjPipe'), 'light')
    myChart.setOption({
      series: [
        {
          name: '设备完好率',
          type: 'gauge',
          detail: {formatter: '{value}%'},
          data: [{value: 50, name: '完成率'}]
        }
      ]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='ObjPipe' style={{ height: 220 }}></div>
  )
}

export default ObjPipe;