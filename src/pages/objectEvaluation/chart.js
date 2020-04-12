export const getVoltageLevelOption = (yValue, data) => {
  return {
    title: {
      text: "各电压等级设备评分"
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
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 10
    },
    yAxis: {
      type: 'category',
      data: yValue
    },
    series: [
      {
        type: 'bar',
        data: data
      }
    ]
  }
}

export const getSiteOption = (yValue, data) => {
  return {
    title: {
      text: '各站点设备评分'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 10
    },
    yAxis: {
      type: 'category',
      data: yValue
    },
    visualMap: {
      orient: 'horizontal',
      type: 'piecewise',
      dimension: 0,
      show: false,
      pieces: [
        {gt: 80, lt: 100, color: '#00C7CB'},
        {gt: 60, lte: 80, color: '#E6C86E'},
        {gt: 0, lte: 60, color: '#EA767C'}
      ]
    },
    series: [{
      data: data,
      type: 'bar'
    }]
  }
}

export const getScoreOption = (title, data) => {
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: data
      }
    ]
  }
}

export const getFaultRateOption = (title, data) => {
  return {
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true
      }
    ]
  }
}
