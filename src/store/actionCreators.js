import { Location_Tree, Brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from './actionTypes'
export const locationTreeAction = (dispatch,data)=> {
  dispatch({
    type: Location_Tree,
    data
  })
}

export const brandsAction = (dispatch,data) => {
  dispatch({
    type: Brands,
    data
  })
}

export const robotObjectTypeAction = (dispatch,data) => {
  dispatch({
    type: ROBOT_OBJECT_TYPE,
    data
  })
}

export const robotObjectStatusAction = (dispatch, data) => {
  dispatch({
    type: ROBOT_OBJECT_STATUS,
    data
  })
}

export const videoStreamAction = (dispatch, data) => {
  dispatch({
    type: VIDEO_STREAM,
    data
  })
}
