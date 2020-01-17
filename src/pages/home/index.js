import React, { useRef } from 'react';
import { Layout, Menu, Icon, Dropdown,Form } from 'antd';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Application from '../application/index';
import Setting from './setting';
import View from './view';
import EditPassword from './editPassword';
import Demo from '../demo/index';
import '../../styles/header.css';
import {connect} from 'react-redux';

const { Header, Content } = Layout;

const Index =(props)=> {
  const childRef = useRef()

  const showModal = () => {
    props.showModal1()
    console.log(childRef)
  }

  const handleOk = (values) => {
    console.log(values)
    
  }
  const handleCancel = ()=> {
    props.closeModal()
  }
 
    console.log(props)
 
    const pathname = props.history.location.pathname.split('/').slice(1);  //获取当前页面的路径
    const menu = (
      <Menu className="dropMenu">
        <Menu.Item key="setting"><NavLink to="/en/setting">个人设置</NavLink></Menu.Item>
        <Menu.Item key="editPassword" onClick={showModal}>修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><NavLink to="/en/login">退出</NavLink></Menu.Item>
      </Menu>
    );
    return (
      <div>
      <Layout>
        <Header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            selectedKeys={pathname}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="home"><NavLink to="/en/home">首页</NavLink></Menu.Item>
            <Menu.Item key="applications"><NavLink to="/en/applications">应用管理</NavLink></Menu.Item>
            <Menu.Item key="demo"><NavLink to="/cn/demo">Demo</NavLink></Menu.Item>
            <Menu.Item key="user" style={{float: 'right'}}>
              <Dropdown overlay={menu} trigger={['click']}>
               <span>
                <Icon type="user" />
              </span>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Switch>
            <Route path="/:lang/home" exact component= {View}></Route>
            <Route path="/:lang/applications" component= {Application}></Route>
            <Route path="/:lang/demo" component= {Demo}></Route>
            <Route path="/:lang/setting" component= {Setting}></Route>
            <Redirect to='/:lang/home' />
          </Switch>
        </Content>
      </Layout>
      <EditPassword form={props.form} ref={childRef} visible={props.visible} {...{ handleOk, handleCancel}}/>
    </div>
    );
  }

const mapStateToProps = (state) => {
  console.log(state)
  return {
      visible: state.visible
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
      showModal1(e) {
          let action = {
              type:'showModal'
          }
          dispatch(action)
      },
      closeModal() {
        let action = {
          type:'closeModal'
        }
        dispatch(action)
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Form.create()(Index)));