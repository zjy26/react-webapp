import {Brands} from './actionTypes'

const defaultStore = {
  inputValue: '',
  brands: []
};

export default (state = defaultStore, action) => {
  switch (action.type) {
    case Brands:
      return { ...state, brands:action.data }
    default:
      return state
  }
}
