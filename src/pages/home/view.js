import React, { Component } from 'react';
import OA from '../../images/OA.png';
import GitLab from '../../images/GitLab.png';
import GitLabHelper from '../../images/GitLabHelper.png';
import Wiki from '../../images/Wiki.png';
import Setting from '../../images/Setting.png';
import Password from '../../images/Password.png';
import '../../styles/view.css';


class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'OA', mediaUrl: OA, href: 'https://github.com/'},
        {name: 'GitLab', mediaUrl: GitLab, href: 'https://github.com'},
        {name: 'GitLabHelper', mediaUrl: GitLabHelper, href: 'https://github.com'},
        {name: 'Wiki', mediaUrl:Wiki, href: 'https://github.com'},
        {name: 'Setting', mediaUrl: Setting, href: 'https://github.com'},
        {name: 'Password', mediaUrl: Password, href: 'https://github.com'},
      ]
    }
  }
  render() { 
    return (
      <span>
        {
          this.state.data.map((item, index)=>{
            return (<a key={index} href={item.href}><img src={item.mediaUrl} alt="" className="img"/></a>)
          })
        }
      </span>
    );
  }
}
 
export default View;