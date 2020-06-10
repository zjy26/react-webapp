import { CHANGE_CLASS, CHANGE_UNITCLASS, CHANGE_IMPORTANCE, CHANGE_CLASSIFICATION, CHANGE_MAINCLS, CHANGE_OBJECTCLS, CHANGE_VOLTAGELEVEL, CHANGE_PROPERTY, CHANGE_MONITORPOINTTYPE, CHANGE_UOMS } from './actionTypes'
import { classification, properties, uoms, OBJECT_CRITICALITY_LEVEL, OBJECT_CLASSIFICATION, OBJECT_MAIN_CLS, VOLTAGE_LEVEL, MONITOR_POINT_INFO_TYPE } from '../../../../api/index'
import { fromJS } from 'immutable'

//设备分类
const changeClass = (data) => ({
  type: CHANGE_CLASS,
  data: fromJS(data)
})
//部件分类
const changeUnitClass = (data) => ({
  type: CHANGE_UNITCLASS,
  data: fromJS(data)
})
//固定资产分类
const changeObjectCls = (data) => ({
  type: CHANGE_OBJECTCLS,
  data: fromJS(data)
})
export const getClass = (params) => {
  return dispatch => {
    classification(params)
      .then(res => {
        if (res && res.children) {
          if (params.clsFun === "asset.classification") {
            dispatch(changeClass(res.children))
          } else if (params.clsFun === "asset.unitClass") {
            dispatch(changeUnitClass(res.children))
          } else {
            dispatch(changeObjectCls(res.children))
          }
        }
      }).catch(() => {
        console.log("设备分类加载失败")
      })
  }
}

const changeProperty = (data) => ({
  type: CHANGE_PROPERTY,
  data: fromJS(data)
})
export const getProperty = () => {
  return dispatch => {
    properties({ limit: 30 })  //属性默认只取前三十条
      .then(res => {
        if (res && res.models) {
          dispatch(changeProperty(res.models))
        }
      }).catch(() => {
        console.log("属性加载失败")
      })
  }
}

const changeImpartance = (data) => ({
  type: CHANGE_IMPORTANCE,
  data: fromJS(data)
})
export const getImpartance = () => {
  return dispatch => {
    OBJECT_CRITICALITY_LEVEL()
      .then(res => {
        if (res && res.models) {
          dispatch(changeImpartance(res.models))
        }
      }).catch(() => {
        console.log("重要程度加载失败")
      })
  }
}

const changeClassification = (data) => ({
  type: CHANGE_CLASSIFICATION,
  data: fromJS(data)
})
export const getClassification = () => {
  return dispatch => {
    OBJECT_CLASSIFICATION()
      .then(res => {
        if (res && res.models) {
          dispatch(changeClassification(res.models))
        }
      }).catch(() => {
        console.log("ABC分类加载失败")
      })
  }
}

const changeMainCls = (data) => ({
  type: CHANGE_MAINCLS,
  data: fromJS(data)
})
export const getMainCls = () => {
  return dispatch => {
    OBJECT_MAIN_CLS()
      .then(res => {
        if (res && res.models) {
          dispatch(changeMainCls(res.models))
        }
      }).catch(() => {
        console.log("设备大类加载失败")
      })
  }
}

const changeVoltageLevel = (data) => ({
  type: CHANGE_VOLTAGELEVEL,
  data: fromJS(data)
})
export const getVoltageLevel = () => {
  return dispatch => {
    VOLTAGE_LEVEL()
      .then(res => {
        if (res && res.models) {
          dispatch(changeVoltageLevel(res.models))
        }
      }).catch(() => {
        console.log("电压等级加载失败")
      })
  }
}

const changeMonitorPointType = (data) => ({
  type: CHANGE_MONITORPOINTTYPE,
  data: fromJS(data)
})
export const getMonitorPointType = () => {
  return dispatch => {
    MONITOR_POINT_INFO_TYPE({sort: JSON.stringify([{"property":"id","direction":"ASC"}])})
      .then(res => {
        if (res && res.models) {
          dispatch(changeMonitorPointType(res.models))
        }
      }).catch(() => {
        console.log("属性类型加载失败")
      })
  }
}

const changeUoms = (data) => ({
  type: CHANGE_UOMS,
  data: fromJS(data)
})
export const getUoms = () => {
  return dispatch => {
    uoms()
      .then(res => {
        if (res && res.children) {
          dispatch(changeUoms(res.children))
        }
      }).catch(() => {
        console.log("计量单位加载失败")
      })
  }
}
