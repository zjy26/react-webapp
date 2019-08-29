import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import TodoList from './TodoList';
import NewTodoList from './NewTodoList';
import {Provider} from 'react-redux';
import newStore from './newstore';

const App = (
    <Provider store = {newStore}>
        <NewTodoList/>
    </Provider>
)

// ReactDOM.render(<TodoList />, document.getElementById('root'));
ReactDOM.render(App, document.getElementById('root'));
