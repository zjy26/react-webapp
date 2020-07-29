import { CHANGE_CLASSIFICATION, CHANGE_UnitTemplate,CHANGE_Template,CHANGE_CLASS,CHANGE_UNITCLASS,CHANGE_OBJECTCLS,CHANGE_People, CHANGE_ConfigLocation, CHANGE_VEHICLE_ROUTE, CHANGE_ANCHORSECTIONS, CHANGE_STATIONTRACKS, CHANGE_CATENARY_TYPE, CHANGE_CATENARY_LOCATION_TYPE, CHANGE_OVERHEAD_LINE_DEBUG_ITEM } from './actionTypes'
import { VEHICLE_ROUTE,objecttemplates,OBJECT_CLASSIFICATION, people, classification, anchorSections, stationTracks, CATENARY_TYPE, CATENARY_LOCATION_TYPE, OVERHEAD_LINE_DEBUG_ITEM } from '../../../../api/index'
import { configLocation } from '../../../../api/config/lineInfo'
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

const changegetVehicleRoute = (data) => ({
  type: CHANGE_VEHICLE_ROUTE,
  data: fromJS(data)
})
export const getVehicleRoute = () => {
  return dispatch => {
    VEHICLE_ROUTE()
    .then(res => {
      if (res && res.models) {
        dispatch(changegetVehicleRoute(res.models))
      }
    }).catch(() => {
      console.log("属性加载失败")
    })
  }
}

const changeanchorSections = (data) => ({
  type: CHANGE_ANCHORSECTIONS,
  data: fromJS(data)
})
export const getanchorSections = () => {
  return dispatch => {
    anchorSections()
    .then(res => {
      if (res && res.models) {
        dispatch(changeanchorSections(res.models))
      }
    }).catch(() => {
      console.log("重要程度加载失败")
    })
  }
}

const changestationTracksn = (data) => ({
  type: CHANGE_STATIONTRACKS,
  data: fromJS(data)
})
export const getstationTracks = () => {
  return dispatch => {
    stationTracks()
    .then(res => {
      if (res && res.models) {
        dispatch(changestationTracksn(res.models))
      }
    }).catch(() => {
      console.log("ABC分类加载失败")
    })
  }
}

const changeCatenaryType = (data) => ({
  type: CHANGE_CATENARY_TYPE,
  data: fromJS(data)
})
export const getCatenaryType = () => {
  return dispatch => {
    CATENARY_TYPE()
    .then(res => {
      if (res && res.models) {
        dispatch(changeCatenaryType(res.models))
      }
    }).catch(() => {
      console.log("设备大类加载失败")
    })
  }
}

const changegetCatenaryLocationType = (data) => ({
  type: CHANGE_CATENARY_LOCATION_TYPE,
  data: fromJS(data)
})
export const getCatenaryLocationType = () => {
  return dispatch => {
    CATENARY_LOCATION_TYPE()
    .then(res => {
      if (res && res.models) {
        dispatch(changegetCatenaryLocationType(res.models))
      }
    }).catch(() => {
      console.log("电压等级加载失败")
    })
  }
}

const changeOverheadLineDebugItem = (data) => ({
  type: CHANGE_OVERHEAD_LINE_DEBUG_ITEM,
  data: fromJS(data)
})
export const getOverheadLineDebugItem = () => {
  return dispatch => {
    OVERHEAD_LINE_DEBUG_ITEM()
    .then(res => {
      if (res && res.models) {
        dispatch(changeOverheadLineDebugItem(res.models))
      }
    }).catch(() => {
      console.log("属性类型加载失败")
    })
  }
}

const changeConfigLocation = (data) => ({
  type: CHANGE_ConfigLocation,
  data: fromJS(data)
})
export const getConfigLocation = () => {
  return dispatch => {
    configLocation.configLocationList({level:'4'})
    .then(res => {
      if (res && res.models) {
        dispatch(changeConfigLocation(res.models))
      }
    }).catch(() => {
      console.log("属性类型加载失败")
    })
  }
}

const changePeople = (data) => ({
  type: CHANGE_People,
  data: fromJS(data)
})
export const getPeople = () => {
  return dispatch => {
    people()
    .then(res => {
      if (res && res.models) {
        dispatch(changePeople(res.models))
      }
    }).catch(() => {
      console.log("人员加载失败")
    })
  }
}

const changeTemplate = (data) => ({
  type: CHANGE_Template,
  data: fromJS(data)
})
export const getTemplate = () => {
  return dispatch => {
    objecttemplates({type:'01'})
    .then(res => {
      if (res && res.models) {
        dispatch(changeTemplate(res.models))
      }
    }).catch(() => {
      console.log("设备模板加载失败")
    })
  }
}
const changeUnitTemplate = (data) => ({
  type: CHANGE_UnitTemplate,
  data: fromJS(data)
})
export const getUnitTemplate = () => {
  return dispatch => {
    objecttemplates({type:'02'})
    .then(res => {
      if (res && res.models) {
        dispatch(changeUnitTemplate(res.models))
      }
    }).catch(() => {
      console.log("设备模板加载失败")
    })
  }
}
