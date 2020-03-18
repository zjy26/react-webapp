import { Location_Tree, Brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from './actionTypes'

export const locationTreeAction = (data) => ({
  type: Location_Tree,
  data
})

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
