import {Show_Psd_Modal,Close_Psd_Modal,Location_Tree, Brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM} from './actionTypes'

const defaultStore = {
  psdModalvisible: false,
  locationTree: {},
  brands: [],
  robotObjectType: [],
  robotObjectStatus: [],
  videoStream: []
}

export default (state = defaultStore, action) => {
  switch (action.type) {
    case Show_Psd_Modal:
      return { ...state, psdModalvisible:true }
    case Close_Psd_Modal:
      return { ...state, psdModalvisible:false }
    case Location_Tree:
      return { ...state, locationTree:action.data }
    case Brands:
      return { ...state, brands:action.data }
    case ROBOT_OBJECT_TYPE:
      return { ...state, robotObjectType:action.data}
    case ROBOT_OBJECT_STATUS:
      return { ...state, robotObjectStatus:action.data}
    case VIDEO_STREAM:
      return { ...state, videoStream:action.data}
    default:
      return state
  }
}