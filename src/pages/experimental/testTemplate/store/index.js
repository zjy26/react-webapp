import { fromJS } from 'immutable'
import { standardWork, properties } from '../../../../api/index'
import { configObjectTemplate } from '../../../../api/config/objectTemplate'

//actionTypes
export const CHANGE_OBJECT_TEMPLATE = 'textTemplate/CHANGE_OBJECT_TEMPLATE'
export const CHANGE_STANDARD_WORK = 'textTemplate/CHANGE_STANDARD_WORK'
export const CHANGE_PROPERTY = 'textTemplate/CHANGE_PROPERTY'

//actionCreator
const changeObjectTemplate = (data) => ({
  type: CHANGE_OBJECT_TEMPLATE,
  data: fromJS(data)
})
const changeStandardWork = (data) => ({
  type: CHANGE_STANDARD_WORK,
  data: fromJS(data)
})
const changeProperty = (data) => ({
  type: CHANGE_PROPERTY,
  data: fromJS(data)
})

export const getObjectTemplateList = () => {
  return dispatch => {
    configObjectTemplate.objectTemplateList({
      filter: JSON.stringify([{ property: 'type', value: '01' }])
    })
      .then(data => {
        const list = data && data.models
        dispatch(changeObjectTemplate(list))
      })
  }
}

export const getStandardWork = () => {
  return dispatch => {
    standardWork()
      .then(data => {
        const list = data && data.models
        dispatch(changeStandardWork(list))
      })
  }
}

export const getProperty = () => {
  return dispatch => {
    properties({
      sysFilterSql: 'pro_test is true'
    })
      .then(data => {
        const list = data && data.models
        dispatch(changeProperty(list))
      })
  }
}

//reducer
const defaultState = fromJS({
  objectTemplate: [],  //试验对象
  standardWork: [],  //标准作业计划
  property: []  //试验属性
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_OBJECT_TEMPLATE:
      return state.set('objectTemplate', action.data);
    case CHANGE_STANDARD_WORK:
      return state.set('standardWork', action.data);
    case CHANGE_PROPERTY:
      return state.set('property', action.data);
    default:
      return state;
  }
}

export { reducer }
