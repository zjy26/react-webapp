import React from 'react';
import { BrowserRouter as Router, Route, Link} from "react-router-dom"
import Main from './pages/Main'
import Video from './pages/Video'
import './index.css'
import WorkPlace from './pages/WorkPlace';

function AppRouter() {
    let routerConfig = [
        {title: '博客首页', link: '/', path: '/', component:Main, exact: true},
        {title: '视频教程', link: '/video', path: '/video', component:Video, exact: false},
        {title: '职场技能', link: '/workplace', path: '/workplace', component:WorkPlace, exact: false}
    ];
    return (
        <Router>
            <div className="mainDiv">
                <div className="leftNav">
                    <h3>一级导航</h3>
                    <ul>
                        {
                            routerConfig.map((item, index)=>{
                                return (<li key={index}><Link to={item.link}>{item.title}</Link></li>)
                            })
                        }
                    </ul>
                </div>
                <div className="rightMain">
                    {
                        routerConfig.map((item, index)=>{
                            return (<Route key={index} path={item.path} exact={item.exact} component={item.component}></Route>)
                        })
                    }
                </div>
            </div>
        </Router>
        );
}
 
export default AppRouter;