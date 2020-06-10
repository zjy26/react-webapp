import * as actionTypes from './actionTypes';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  sheetType: []
})

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_PATROL_SHEET_TYPE:
      return state.set('sheetType', action.data)
    default:
      return state
  }
}