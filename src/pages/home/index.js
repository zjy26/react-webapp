import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Application from '../application/index';
import View from './view';
import EditPassword from './editPassword';
import '../../styles/header.css';

const { Header, Content } = Layout;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const pathname = this.props.history.location.pathname.split('/').slice(1);  //获取当前页面的路径
    const menu = (
      <Menu className="dropMenu">
        <Menu.Item key="setting">个人设置</Menu.Item>
        <Menu.Item key="editPassword" onClick={this.showModal}>修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><NavLink to="/login">退出</NavLink></Menu.Item>
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
            <Menu.Item key="home"><NavLink to="/home">首页</NavLink></Menu.Item>
            <Menu.Item key="applications"><NavLink to="/applications">应用管理</NavLink></Menu.Item>
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
            <Route path="/home" exact component= {View}></Route>
            <Route path="/applications" component= {Application}></Route>
            <Redirect to='/home' />
          </Switch>
        </Content>
      </Layout>
      <EditPassword visible={this.state.visible} {...{handleOk: this.handleOk, handleCancel: this.handleCancel}}/>
    </div>
    );
  }
}

export default Index;