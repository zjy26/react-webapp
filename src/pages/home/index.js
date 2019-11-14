import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown, Button, Form, Input, Col } from 'antd';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Application from '../application/index';
import View from './view';
import '../../styles/header.css';
import ReactModal from 'react-modal'

const { Header, Content } = Layout;
const customStyles = {
  content: {
    width: '400px',
    height: '300px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -55%)'
  }
};

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpenState: false
    }
  }
  openModal(){
    this.setState({
      modalOpenState: true
    })
  }
  closeModal(){
    this.setState({
        modalOpenState: false
    })
  }
  comfirm() {
    this.setState({
      modalOpenState: false
    })
  }
  getParent = () => {
    return document.querySelector('#Modal');
  }
  render() {
    const menu = (
      <Menu className="dropMenu">
        <Menu.Item key="setting">个人设置</Menu.Item>
        <Menu.Item key="editPassword" onClick={this.openModal.bind(this)}>修改密码</Menu.Item>
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
            defaultSelectedKeys={['index']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="index"><NavLink to="/home/index/">首页</NavLink></Menu.Item>
            <Menu.Item key="application"><NavLink to="/application/index/">应用管理</NavLink></Menu.Item>
            <Menu.Item key="user" style={{float: 'right'}}>
              <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                <Icon type="user" />
              </a>
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
      <ReactModal
        style={customStyles}
        isOpen = {this.state.modalOpenState}
        ariaHideApp={false} 
      >
        <h2 className="modalTitle">修改密码</h2>
        <Form>
          <Form.Item>
            <Col span={6} align="right">原密码</Col>
            <Col span={14}><Input placeholder="请输入原密码" className="input"/></Col>
          </Form.Item>
          <Form.Item>
            <Col span={6} align="right">新密码</Col>
            <Col span={14}><Input placeholder="请输入新密码" className="input"/></Col>
          </Form.Item>
          <Form.Item>
            <Col span={6} align="right">重复新密码</Col>
            <Col span={14}><Input placeholder="请重新输入新密码" className="input"/></Col>
          </Form.Item>
        </Form>
        <div className="modalTitle">
          <Button type="primary" onClick={this.comfirm.bind(this)} className="modalBtn">确认</Button>
          <Button type="primary" onClick={this.closeModal.bind(this)} className="modalBtn">取消</Button>
        </div>
      </ReactModal>
    </div>
    );
  }
}

export default Index;