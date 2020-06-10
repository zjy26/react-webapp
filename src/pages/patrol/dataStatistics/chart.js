export const getFaultStatisticsByBrandOption = (faultBrand, fault,troubleshooting) => {
  return {
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
        data: faultBrand
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
        data: fault,
        type: 'bar'
      }, {
        name: '故障解决次数',
        data: troubleshooting,
        type: 'bar'
      }]
  }
}

export const getMaintainOption = (maintainBrand, maintain,unmaintained,stoptime) => {
  return {
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
        data: maintainBrand
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
        data: maintain,
        type: 'bar'
      }, {
        name: '维护完成次数',
        data: unmaintained,
        type: 'bar'
      }, {
        name: '维护时长',
        type: 'line',
        yAxisIndex: 1,
        data: stoptime
      }]
  }
}

export const getObjDurationStatisticalOption = (equipmentBrand, less1, bet13, bet35, more5) => {
  return {
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
        data: equipmentBrand
      },
      xAxis: {
        type: 'category',
        data: equipmentBrand
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
        data: less1,
        type: 'bar'
      }, {
        name: '使用1到3年数量',
        data: bet13,
        type: 'bar'
      }, {
        name: '使用3到5年数量',
        data: bet35,
        type: 'bar'
      }, {
        name: '使用5年以上数量',
        data: more5,
        type: 'bar'
      }]
  }
}
export const getImplementationPieOption = (maintainCount, runningCount, repairCount, toMaintainCount) => {
  return {
    title: {
        text: "设备实时情况"
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: -5,
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
            { value: runningCount, name: '正在运行' },
            { value: toMaintainCount, name: '待维护运行' },
            { value: 0, name: '故障运行' },
            { value: maintainCount, name: '停机维护' },
            { value: repairCount, name: '停机修复' }
          ]
        }
      ]
  }
}
export const getSiteFaultRate = (site, objCount, failureCount, rare) => {
  return {
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
        data: site
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
        data: objCount,
        type: 'bar',
        stack: '总量'
      }, {
        name: '故障数量',
        data: failureCount,
        type: 'bar',
        stack: '总量'
      }, {
        name: '故障率',
        type: 'line',
        yAxisIndex: 1,
        data: rare
      }]
  }
}
export const getObjPipe = (intactRate) => {
  return {
    series: [
      {
        name: '设备完好率',
        type: 'gauge',
        detail: {formatter: '{value}%'},
        data: [{value: intactRate, name: '完成率'}]
      }
    ]
  }
}
export const getFaultReason = (inRate,outRate) => {
  return {
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
          { value: inRate, name: '外部原因' },
          { value: outRate, name: '内部原因' }
        ]
      }
    ]
  }
}
