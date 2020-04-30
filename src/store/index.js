// import { createStore, applyMiddleware } from 'redux'
// import reducer from './reducer'
// import thunkMiddleware from 'redux-thunk'

// const store = createStore(reducer,applyMiddleware(thunkMiddleware))

// export default store


import { createStore, compose, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducer"
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
