import * as actionTypes from './actionTypes'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  class: [],  //设备分类
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_CLASS:
      return state.set('class', action.data)
    default:
      return state
  }
}
