import { CHANGE_PROPERTIES,CHANGE_ROBOT_PATROL_LOCS,CHANGE_SUPPLIERS,CHANGE_ROBOT_OBJECT_STATUS,CHANGE_ROBOT_OBJECT_TYPE,CHANGE_VIDEO_STREAM } from './actionTypes'
import { properties,robotPatrolLocs,suppliers,ROBOT_OBJECT_TYPE,ROBOT_OBJECT_STATUS,VIDEO_STREAM } from '../../../../api/index'
import { fromJS } from 'immutable'

const changeProperties = (data) => ({
  type: CHANGE_PROPERTIES,
  data: fromJS(data)
})
export const getProperties = () => {
  return dispatch => {
    properties()
    .then(res => {
      if(res && res.models) {
        dispatch(changeProperties(res.models))
      }
    }).catch(() => {
      console.log("属性获取失败")
    })
  }
}
const changeRobotPatrolLocs = (data) => ({
  type: CHANGE_ROBOT_PATROL_LOCS,
  data: fromJS(data)
})
export const getRobotPatrolLocs = () => {
  return dispatch => {
    robotPatrolLocs()
    .then(res => {
      if(res && res.models) {
        dispatch(changeRobotPatrolLocs(res.models))
      }
    }).catch(() => {
      console.log("导航菜单数据获取失败")
    })
  }
}

const changeSuppliers = (data) => ({
  type: CHANGE_SUPPLIERS,
  data: fromJS(data)
})
export const getSuppliers = () => {
  return dispatch => {
    suppliers()
    .then(res => {
      if(res) {
        dispatch(changeSuppliers(res.models))
      }
    }).catch(() => {
      console.log("导航菜单数据获取失败")
    })
  }
}

const changeVideoStream = (data) => ({
  type: CHANGE_VIDEO_STREAM,
  data: fromJS(data)
})
export const getVideoStream = () => {
  return dispatch => {
    VIDEO_STREAM()
    .then(res => {
      if(res && res.models) {
        dispatch(changeVideoStream(res.models))
      }
    }).catch(() => {
      console.log("导航菜单数据获取失败")
    })
  }
}

const changeRobotObjectType = (data) => ({
  type: CHANGE_ROBOT_OBJECT_TYPE,
  data: fromJS(data)
})
export const getRobotObjectType = () => {
  return dispatch => {
    ROBOT_OBJECT_TYPE()
    .then(res => {
      dispatch(changeRobotObjectType(res.models))
    }).catch(() => {
      console.log("导航菜单数据获取失败")
    })
  }
}

const changeObjectStatus = (data) => ({
  type: CHANGE_ROBOT_OBJECT_STATUS,
  data: fromJS(data)
})
export const getObjectStatus = () => {
  return dispatch => {
    ROBOT_OBJECT_STATUS()
    .then(res => {
      dispatch(changeObjectStatus(res.models))
    }).catch(() => {
      console.log("导航菜单数据获取失败")
    })
  }
}
