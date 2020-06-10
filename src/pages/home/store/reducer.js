import * as actionTypes from './actionTypes';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  location: {},
  psdVisible: false,
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_LOCATION:
      return state.set('location', action.data)
    case actionTypes.SHOW_PASSWORD:
      return state.set('psdVisible', true)
    case actionTypes.CLOSE_PASSWORD:
      return state.set('psdVisible', false)
    default:
      return state
  }
}