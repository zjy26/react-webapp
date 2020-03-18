import { Location_Tree, Brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from './actionTypes'
import { locationTree } from '../api'
export const locationTreeAction = ()=> (dispatch)=> {
  //线路站点
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
      console.log(location)
      dispatch({
        type: Location_Tree,
        data: location
      })
    }
  }).catch((err) => {
    console.log("线路站点数据加载失败")
  })
}

export const brandsAction = (data) => ({
    type: Brands,
    data
})

export const robotObjectTypeAction = (data) => ({
  type: ROBOT_OBJECT_TYPE,
  data
})

export const robotObjectStatusAction = (data) => ({
  type: ROBOT_OBJECT_STATUS,
  data
})

export const videoStreamAction = (data) => ({
  type: VIDEO_STREAM,
  data
})
