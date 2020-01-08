import React from 'react';
import OA from '../../images/OA.png';
import GitLab from '../../images/GitLab.png';
import GitLabHelper from '../../images/GitLabHelper.png';
import Wiki from '../../images/Wiki.png';
import Setting from '../../images/Setting.png';
import Password from '../../images/Password.png';
import '../../styles/view.css';
import {connect} from 'react-redux';

const data = [
  {name: 'OA', mediaUrl: OA, href: 'https://github.com/'},
  {name: 'GitLab', mediaUrl: GitLab, href: 'https://github.com'},
  {name: 'GitLabHelper', mediaUrl: GitLabHelper, href: 'https://github.com'},
  {name: 'Wiki', mediaUrl:Wiki, href: 'https://github.com'},
  {name: 'Setting', mediaUrl: Setting, href: 'https://github.com'},
  {name: 'Password', mediaUrl: Password, href: '#'},
]
const View = props=>{
  const showModal = ()=>{
    props.showModal1()
  }
  return (
    <span>
      {
        data.map((item, index)=>{
          if(item.name === "Password") {
            return <div key={index} onClick={showModal}><img src={item.mediaUrl} alt="" className="img"/></div>
          } else {
            return (<a key={index} href={item.href}><img src={item.mediaUrl} alt="" className="img"/></a>)
          }
        })
      }
    </span>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
      showModal1(e) {
          let action = {
              type:'showModal'
          }
          dispatch(action)
      }
  }
}

export default connect(null, mapDispatchToProps)(React.memo(View));