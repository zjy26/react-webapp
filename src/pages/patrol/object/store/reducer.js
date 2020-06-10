import * as actionTypes from './actionTypes'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  properties: [],
  robotPatrolLocs: [],
  robotObjectType: [],
  robotObjectStatus: [],
  videoStream: {},
  suppliers: {}
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_PROPERTIES:
      return state.set('properties', action.data)
    case actionTypes.CHANGE_ROBOT_PATROL_LOCS:
      return state.set('robotPatrolLocs', action.data)
    case actionTypes.CHANGE_ROBOT_OBJECT_TYPE:
      return state.set('robotObjectType', action.data)
    case actionTypes.CHANGE_ROBOT_OBJECT_STATUS:
      return state.set('robotObjectStatus', action.data)
    case actionTypes.CHANGE_VIDEO_STREAM:
      return state.set('videoStream', action.data)
    case actionTypes.CHANGE_SUPPLIERS:
      return state.set('suppliers', action.data)
    default:
      return state
  }
}
