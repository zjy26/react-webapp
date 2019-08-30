import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from "react-router-dom"
import Main from './pages/Main'
import Video from './pages/Video'
import './index.css'

class AppRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <Router>
                <div className="mainDiv">
                    <div className="leftNav">
                        <h3>一级导航</h3>
                        <ul>
                            <li><Link to="/">博客首页</Link></li>
                            <li><Link to="/video">视频教程</Link></li>
                            <li><Link to="">职场技能</Link></li>
                        </ul>
                    </div>
                    <div className="rightMain">
                        <Route path = "/" exact component={Main}></Route>
                        <Route path = "/video" component={Video}></Route>
                    </div>
                </div>
            </Router>
         );
    }
}
 
export default AppRouter;