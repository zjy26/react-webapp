import { CHANGE_PATROL_SHEET_TYPE } from './actionTypes'
import { ROBOT_PATROL_SHEET_TYPE } from '../../../../api/index'
import { fromJS } from 'immutable'
const changeSheetType = (data) => ({
    type: CHANGE_PATROL_SHEET_TYPE,
    data: fromJS(data)
  })
  export const getSheetType = () => {
    return dispatch => {
      ROBOT_PATROL_SHEET_TYPE()
      .then(res => {
        if(res && res.models) {
          dispatch(changeSheetType(res.models))
        }
      }).catch(() => {
        console.log("数据获取失败")
      })
    }
  }
