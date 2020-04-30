import { CHANGE_LOCATION, SHOW_PASSWORD, CLOSE_PASSWORD } from './constants'
import { locationTree } from '../../../api/index'
import { fromJS } from 'immutable'

export const closePassword = (data) => ({
  type: CLOSE_PASSWORD,
  data
})

export const showPassword = (data) => ({
  type: SHOW_PASSWORD,
  data
})

const changeLocation = (data) => ({
  type: CHANGE_LOCATION,
  data: fromJS(data)
})
export const getLocation = () => {
  return dispatch => {
    locationTree()
    .then(res => {
      const siteArr = []
      const lineArr = []
      if (res) {
        for (var item of res.lineSite) {
          let lineObj = {}
          lineObj["value"] = item.value
          lineObj["label"] = item.label
          lineArr.push(lineObj)
          siteArr.push(...item.children)
        }
        const location = {
          lineSite: res.lineSite,
          line: lineArr,
          site: siteArr
        }
        dispatch(changeLocation(location))
      }
    }).catch(() => {
      console.log("线路站点数据加载失败")
    })
  }
}
