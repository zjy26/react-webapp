import React, {useEffect} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

const ImplementationPie = (props)=> {
  useEffect(() => {
    let myChart = echarts.init(document.getElementById('pie'), 'light')
    myChart.setOption({
      title: {
        text: "设备实时情况"
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'left',
        data: ['正在运行', '待维护运行', '故障运行', '停机维护', '停机修复']
      },
      series: [
        {
          name: '设备实时情况',
          type: 'pie',
          radius: ['50%', '70%'],
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          },
          data: [
            { value: props.array[0], name: '正在运行' },
            { value: props.array[1], name: '待维护运行' },
            { value: props.array[2], name: '故障运行' },
            { value: props.array[3], name: '停机维护' },
            { value: props.array[4], name: '停机修复' }
          ]
        }
      ]
    })

    window.addEventListener('resize', function() {
      myChart.resize()
    })
  });
  return (
    <div id='pie' style={{ height: 160 }}></div>
  )
}

export default ImplementationPie;