import { CHANGE_PATROL_SHEET_TYPE } from './actionTypes'
import { fromJS } from 'immutable'
const changeSheetType = (data) => ({
    type: CHANGE_PATROL_SHEET_TYPE,
    data: fromJS(data)
  })
  export const getSheetType = () => {
    return dispatch => {
     dispatch(changeSheetType([{code:"11", name:"aa"}]))
    }
  }
