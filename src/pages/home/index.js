import React, { Component } from 'react';
import 'antd/dist/antd.css';

import { Layout, Menu, Icon, Dropdown } from 'antd';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Application from '../application/index'
import View from './view'

const { Header, Content } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="setting">个人设置</Menu.Item>
    <Menu.Item key="editPassword">修改密码</Menu.Item>
    <Menu.Divider />
    <Menu.Item key="logout"><NavLink to="/login">退出</NavLink></Menu.Item>
  </Menu>
);
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return (
      <Layout>
        <Header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['index']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="index"><NavLink to="/home/index/">首页</NavLink></Menu.Item>
            <Menu.Item key="application"><NavLink to="/application/index/">应用管理</NavLink></Menu.Item>
            <Menu.Item key="user" style={{float: 'right'}}>
              <Dropdown overlay={menu} trigger={['hover']}>
                <Icon type="user" />
              </Dropdown>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Switch>
            <Route path="/home/index/" exact component= {View}></Route>
            <Route path="/application/index/" component= {Application}></Route>
            <Redirect to='/home/index/' />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

export default Index;