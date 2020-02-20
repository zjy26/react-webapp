import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import newStore from './newstore';


// import TodoList from './todolist/TodoList';
// ReactDOM.render(<TodoList />, document.getElementById('root'));

//react hooks
// import App from './hookdemo/App'
// ReactDOM.render(<App/>, document.getElementById("root"));
// import Demo from './hookdemo/Demo'
// ReactDOM.render(<Demo/>, document.getElementById("root"));


import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './pages/login'
import Index from './pages/home/index'
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store = {newStore}>
      <Router>
        <Switch>
          <Route path="/login" exact component = {Login}></Route>
          <Route path="/" component = {Index}></Route>
          <Redirect to='/login' />
        </Switch>
      </Router>
    </Provider>
  </ConfigProvider>
  , document.getElementById("root"));
