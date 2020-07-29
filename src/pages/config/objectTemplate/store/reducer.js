import * as actionTypes from './actionTypes'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  type: [
    { name: '设备', value: '01' },
    { name: '部件', value: '02' },
  ],
  class: [],  //设备分类
  unitClass: [],  //部件分类
  importance: [],  //重要程度
  objectFunctionType: [],  //功能类型
  classification: [],  //ABC分类
  objectCls: [],  //固定资产分类
  voltageLevel: [],  //电压等级
  mainCls: [],  //设备大类
  properties: [],  //属性
  monitorPointType: [],  //性能属性类型
  uoms: [],  //计量单位
  actUoms: [
    { name: 'ms', code: 'ms' },
    { name: 's', code: 's' }
  ],  //动作计量单位
  paramsName: [],  //参数名称
  dataType: [
    {name: '比例', value: '02'},
    {name: '数值', value: '01'},
  ],
  experimentStandardType:[], //标准值类型
  experimentStandardValue: [], //标准值
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CLASS:
      return state.set('class', action.data)
    case actionTypes.CHANGE_UNITCLASS:
      return state.set('unitClass', action.data)
    case actionTypes.CHANGE_IMPORTANCE:
      return state.set('importance', action.data)
    case actionTypes.CHANGE_OBJECTFUNCTIONALTYPE:
      return state.set('objectFunctionType', action.data)
    case actionTypes.CHANGE_CLASSIFICATION:
      return state.set('classification', action.data)
    case actionTypes.CHANGE_OBJECTCLS:
      return state.set('objectCls', action.data)
    case actionTypes.CHANGE_VOLTAGELEVEL:
      return state.set('voltageLevel', action.data)
    case actionTypes.CHANGE_MAINCLS:
      return state.set('mainCls', action.data)
    case actionTypes.CHANGE_PROPERTY:
      return state.set('properties', action.data)
    case actionTypes.CHANGE_MONITORPOINTTYPE:
      return state.set('monitorPointType', action.data)
    case actionTypes.CHANGE_UOMS:
      return state.set('uoms', action.data)
    case actionTypes.CHANGE_PARAMS_NAME:
      return state.set('paramsName', action.data)
    case actionTypes.CHANGE_EXPERIMENT_STANDARD_TYPE:
      return state.set('experimentStandardType', action.data)
    case actionTypes.CHANGE_EXPERIMENT_STANDARD_VALUE:
      return state.set('experimentStandardValue', action.data)
    default:
      return state
  }
}
