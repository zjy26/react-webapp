import React from 'react';
import {Route, Link} from "react-router-dom"
import Job from './workplace/Job'
import Money from './workplace/Money'

function WorkPlace() {
  let workplaceConfig = [
    {link:"/workplace/job", title:"工作", path:"/workplace/job/", component:Job},
    {link:"/workplace/money", title:"薪资", path:"/workplace/Money/", component:Money}
  ];
  return (
    <div>
      <div className="topNav">
        <ul>
          {
            workplaceConfig.map((item, index)=>{
              return (
                <li key={index}><Link to={item.link}>{item.title}</Link></li>
              )
            })
          }
        </ul>
      </div>
      <div className="videoContent">
        <div><h3>职场技能</h3></div>
        {
          workplaceConfig.map((item, index)=>{
            return(<Route key={index} path={item.path}  component={item.component} />)
          })
        }
      </div>
    </div>
  );

}

export default WorkPlace;