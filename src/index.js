import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//import TodoList from './TodoList';
// ReactDOM.render(<TodoList />, document.getElementById('root'));

//使用react-redux实现todolist
// import NewTodoList from './NewTodoList';
// import {Provider} from 'react-redux';
// import newStore from './newstore';
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
import AppRouter from './AppRouter'
ReactDOM.render(<AppRouter/>, document.getElementById('root'));