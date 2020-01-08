import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//import TodoList from './TodoList';
// ReactDOM.render(<TodoList />, document.getElementById('root'));

//使用react-redux实现todolist
// import NewTodoList from './NewTodoList';
 import {Provider} from 'react-redux';
 import newStore from './newstore';
// const App = (
//     <Provider store = {newStore}>
//         <NewTodoList/>
//     </Provider>
// )
// ReactDOM.render(App, document.getElementById('root'));

//使用react router开发单页面
// import SignalPage from './SignalPage'
// ReactDOM.render(<SignalPage/>, document.getElementById('root'));

//使用react router开发博客页面
// import AppRouter from './AppRouter'
// ReactDOM.render(<AppRouter/>, document.getElementById('root'));

//react hooks
// import App from './App'
// ReactDOM.render(<App/>, document.getElementById("root"));
// import Demo from './hookdemo/Demo'
// ReactDOM.render(<Demo/>, document.getElementById("root"));

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/login'
import Index from './pages/home/index'
ReactDOM.render(
  <Provider store = {newStore}>
  <Router>
    <Switch>
      <Route path="/login" exact component = {Login}></Route>
      <Route path="/" component = {Index}></Route>
      <Redirect to='/login' />
    </Switch>
  </Router>
  </Provider>
  , document.getElementById("root"));
