import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            list: [
                {cid:111, title:'item1'},
                {cid:222, title:'item2'},
                {cid:333, title:'item3'}
            ]
         }
         this.props.history.push("/home/")
    }
    render() { 
        return (
            <div>
                <h2>index-page</h2>
                <ul>
                    {
                        this.state.list.map((item, index)=>{
                            return (
                                <li key={index}>
                                    <Link to={'/list/' + item.cid}>{item.title}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>


        );
    }
}
 
export default Index;