const echarts = require("echarts");

export const pictorialBarOption = () => {
  const data = [100, 200, 300, 150];
  return {
    backgroundColor: '#28467c',
    tooltip: {
      trigger: 'axis',
      formatter: '{b} : {c}',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      data: ['A', 'B', 'C', 'D'],
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        tooltip: {
          show: false
        },
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: '#0B4EC3' // 0% 处的颜色
                },
                {
                  offset: 0.6,
                  color: '#138CEB' // 60% 处的颜色
                },
                {
                  offset: 1,
                  color: '#17AAFE' // 100% 处的颜色
                }
              ]
            )
          }
        },
        data: data,
        barGap: 0,
        label: {
          normal: {
            show: true,
            position: 'top',
            offset: [10, -5],
            textStyle: {
              color: '#fff'
            }
          }
        }
      },
      {
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: '#09337C' // 0% 处的颜色
                },
                {
                  offset: 0.6,
                  color: '#0761C0' // 60% 处的颜色
                },
                {
                  offset: 1,
                  color: '#0575DE' // 100% 处的颜色
                }
              ]
            )
          }
        },
        barGap: 0,
        data: data
      },
      //顶部
      {
        type: 'pictorialBar',
        itemStyle: {
          borderWidth: 1,
          borderColor: '#0571D5',
          color: '#1779E0'
        },
        symbol: 'diamond',
        symbolSize: [40, 10],
        symbolOffset: [0, -5],
        symbolPosition: 'end',
        data: data,
        z: 3
      },
      //底部
      {
        type: 'pictorialBar',
        itemStyle: {
          borderWidth: 1,
          borderColor: '#0571D5',
          color: '#1779E0'
        },
        symbol: 'diamond',
        symbolSize: [40, 10],
        symbolOffset: [0, 5],
        data: data,
        z: 3
      }
    ]
  }
}

export const colBarOption = () => {


  var xData2 = ['1', '2', '3', '4']
  var data1 = [50, 30, 66, 100]

  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b} : {c}',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    backgroundColor: 'rgba(0,0,0,0)',
    grid: {
      left: 100,
      bottom: 50,
      top: 30,
      right: 80
    },
    xAxis: {
      data: xData2,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: [
      //底部形状
      {
        type: 'pictorialBar',
        symbolSize: [41, 15],
        symbolOffset: [0, 8],
        z: 12,
        symbol: 'diamond',
        itemStyle: {
          opacity: 1,
          color: function (params) {
            if (params.dataIndex % 2 === 0) {
              return new echarts.graphic.LinearGradient(1, 0, 0, 0,
                [
                  {
                    offset: 0,
                    color: '#0462D0' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0BD5F3' // 100% 处的颜色
                  }
                ])
            } else {
              return new echarts.graphic.LinearGradient(1, 0, 0, 0,
                [
                  {
                    offset: 0,
                    color: '#E1DC53' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#E8AE62' // 100% 处的颜色
                  }
                ])
            }
          }
        },
        data: data1
      },
      // 数据的柱状图
      {
        type: 'bar',
        barWidth: 41,
        itemStyle: {
          opacity: 1,
          color: function (params) {
            if (params.dataIndex % 2 === 0) {
              return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                [
                  {
                    offset: 0,
                    color: '#0462D0' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0BD5F3' // 100% 处的颜色
                  }
                ])
            } else {
              return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                [
                  {
                    offset: 0,
                    color: '#E1DC53' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#E8AE62' // 100% 处的颜色
                  }
                ])
            }
          }
        },

        data: data1
      },
      // 替代柱状图 默认不显示颜色
      // {
      //   type: 'bar',
      //   symbol: 'diamond',
      //   barWidth: 41,
      //   itemStyle: {
      //     color: 'transparent'
      //   },
      //   data: data1
      // },
      // 顶部形状
      {
        type: 'pictorialBar',
        symbol: 'diamond',
        symbolSize: [41, 15],
        symbolOffset: [0, -8],
        z: 12,
        itemStyle: {
          normal: {
            opacity: 1,
            color: function (params) {
              if (params.dataIndex % 2 === 0) {
                return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                  [
                    {
                      offset: 0,
                      color: '#0462D0' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#0BD5F3' // 100% 处的颜色
                    }
                  ])
              } else {
                return new echarts.graphic.LinearGradient(0, 1, 0, 0,
                  [
                    {
                      offset: 0,
                      color: '#E1DC53' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#E8AE62' // 100% 处的颜色
                    }
                  ])
              }
            },
            label: {
              show: true, // 开启显示
              position: 'top', // 在上方显示
              textStyle: {
                color: '#FFFFFF',
                fontSize: 20,
                top: 50
              },
            }
          }
        },
        symbolPosition: 'end',
        data: data1
      },
      //阴影的顶部
      {
        type: 'pictorialBar',
        symbol: 'diamond',
        symbolSize: [41, 15],
        symbolOffset: [0, -8],
        z: 12,
        symbolPosition: 'end',
        itemStyle: {
          color: '#ff0000',
          opacity: 0.3,
          borderWidth: 1,
          borderColor: '#ff0000'
        },
        // data: [100, 100, 100, 100]
      },
      // 阴影背景
      {
        type: 'bar',
        barWidth: 41,
        barGap: '-100%',
        z: 0,
        itemStyle: {
          color: '#cecece'
        },
        data: [100, 100, 100, 100]
      }
    ]
  }
}