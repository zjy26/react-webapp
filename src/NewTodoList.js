import React from 'react';
import 'antd/dist/antd.css'
import { Input, Button, List } from 'antd'
import {connect} from 'react-redux';

const NewTodoList = (props) => {
    let {inputChange, inputValue, add, list} = props
    return ( <div>
        <Input
            style={{width: '250px', marginRight:'10px'}}
            value={inputValue} 
            onChange={inputChange}
        >
        </Input>
        <Button type="primary" onClick={add}>增加</Button>
        <List
            bordered 
            dataSource = {list}
            renderItem={(item, index)=>(
            <List.Item 
                onClick={() => {props.delete(index)}}>{item}
            </List.Item>)}
        ></List>
        
    </div> );
}

const stateProps = (state) => {
    return {
        inputValue: state.inputValue,
        list: state.list
    }
}
const dispatchToProps = (dispatch) => {
    return {
        inputChange(e) {
            let action = {
                type:'change_input',
                value: e.target.value,
            }
            dispatch(action)
        },
        add() {
            let action = {
                type: 'add_item'
            }
            dispatch(action)
        },
        delete(index) {
            let action = {
                type: 'delete_item',
                index
            }
            dispatch(action)
        }
    }
}
 
export default connect(stateProps, dispatchToProps)(NewTodoList);
