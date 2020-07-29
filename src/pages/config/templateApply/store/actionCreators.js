import { CHANGE_CLASS } from './actionTypes'
import {  classification } from '../../../../api/index'
import { fromJS } from 'immutable'

//设备分类
const changeClass = (data) => ({
  type: CHANGE_CLASS,
  data: fromJS(data)
})
export const getClass = (params) => {
  return dispatch => {
    classification(params)
      .then(res => {
        if (res && res.children) {
          if (params.clsFun === "asset.classification") {
            dispatch(changeClass(res.children))
          }
        }
      }).catch(() => {
        console.log("设备分类加载失败")
      })
  }
}
