import {Show_Psd_Modal,Close_Psd_Modal,Location_Tree, Brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from './actionTypes'

const defaultStore = {
  weekData: [
    {name:'星期一', value: '2'},
    {name:'星期二', value: '3'},
    {name:'星期三', value: '4'},
    {name:'星期四', value: '5'},
    {name:'星期五', value: '6'},
    {name:'星期六', value: '7'},
    {name:'星期日', value: '1'}
  ],
  monthData: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  recurrenceData: [
    {name:'手动', value: 1},
    {name:'一次', value: 2},
    {name:'小时', value: 3},
    {name:'日', value: 4},
    {name:'星期', value: 5},
    {name:'月份', value: 6}
  ],
  psdModalvisible: false,
  locationTree: {},
  brands: [],
  robotObjectType: [],
  robotObjectStatus: [],
  videoStream: [],
  robotPatrolPlanType: [{
    "code": "APPR",
    "name": "使用中"
  },
  {
    "code": "CANCL",
    "name": "取消"
  }]
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