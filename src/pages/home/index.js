import React, { useState, useEffect } from 'react'
import { MessageOutlined, UserOutlined, VideoCameraOutlined, UploadOutlined, MenuUnfoldOutlined, MenuFoldOutlined, NotificationOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'
import MeunRoute from '../../routes'
import EditPassword from './editPassword'
import styles from './Index.module.scss'
import { closePassword, showPassword, getLocation } from './store/actionCreators'
import { connect } from 'react-redux'

const { Header, Content, Sider } = Layout
const Index = (props) => {

  const locationJS = props.location.toJS()
  console.log(locationJS)

  const { getLocationDispatch, showPsd, closePsd, psdVisible } = props
  const [collapsed, setCollapsed] = useState(false)

  const showModal = () => {
    showPsd()
  }
  const handleOk = (values) => {
    console.log(values)
  }
  const handleCancel = () => {
    closePsd()
  }
  
  useEffect(() => {
    getLocationDispatch();
  }, [getLocationDispatch]);

  const pathname = props.history.location.pathname.split('/').slice(1);  //获取当前页面的路径

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logo} />
          <Menu theme="dark" mode="inline" selectedKeys={pathname}>
            <Menu.Item key="home">
              <UserOutlined />
              <NavLink to="/home">首页</NavLink>
            </Menu.Item>
            <Menu.Item key="applications">
              <VideoCameraOutlined />
              <NavLink to="/applications">应用管理</NavLink>
            </Menu.Item>
            <Menu.Item key="object-evaluation">
              <UploadOutlined />
              <NavLink to="/object-evaluation">设备评价</NavLink>
            </Menu.Item>
            <Menu.SubMenu
              key="patrol"
              title={
                <span>
                  <NotificationOutlined />
                  智能巡检
                </span>
              }
            >
              <Menu.Item key="patrol-object"><NavLink to="/patrol-object">设备管理</NavLink></Menu.Item>
              <Menu.Item key="patrol-config"><NavLink to="/patrol-config">巡检配置</NavLink></Menu.Item>
              <Menu.Item key="patrol-plan"><NavLink to="/patrol-plan">巡检计划</NavLink></Menu.Item>
              <Menu.Item key="patrol-sheet"><NavLink to="/patrol-sheet">巡检单</NavLink></Menu.Item>
              <Menu.Item key="patrol-statistics"><NavLink to="/patrol-statistics">数据统计</NavLink></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="config"
              title={
                <span>
                  <NotificationOutlined />
                  基础配置
                </span>
              }
            >
              <Menu.Item key="config-info"><NavLink to="/config-info">业务基础数据</NavLink></Menu.Item>
              <Menu.Item key="config-class"><NavLink to="/config-class">分类设置</NavLink></Menu.Item>
              <Menu.Item key="config-line"><NavLink to="/config-line">线路信息</NavLink></Menu.Item>
              <Menu.Item key="config-template"><NavLink to="/config-template">设备模板</NavLink></Menu.Item>
              <Menu.Item key="config-parameter"><NavLink to="/config-parameter">台账信息</NavLink></Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout className={styles.siteLayout}>
          <Header style={{ padding: 0 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.trigger,
              onClick: toggle,
            })}
            <Menu mode="horizontal" style={{float: 'right'}}>
              <Menu.Item key="message"><MessageOutlined style={{ fontSize: 20}} /></Menu.Item>
              <Menu.SubMenu
                key="user"
                title={<UserOutlined style={{fontSize: 20}}/>}
              >
                <Menu.Item key="setting"><NavLink to="/setting">个人设置</NavLink></Menu.Item>
                <Menu.Item key="editPassword" onClick={showModal}>修改密码</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout"><NavLink to="/login">退出</NavLink></Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>
          <Content>
            <Switch>
              {
                MeunRoute.map(item => {
                  return (
                    <Route
                      key={item.path}
                      path={item.path}
                      exact={item.exact}
                      component={item.component}
                    />
                  )
                })
              }
              <Redirect to='/home' />
            </Switch>
          </Content>
        </Layout>
      </Layout>

      <EditPassword visible={psdVisible} {...{ handleOk, handleCancel }} />
    </div>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location']),
  psdVisible: state.getIn(['common', 'psdVisible'])
})
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getLocationDispatch() {
      dispatch(getLocation())
    },

    showPsd() {
      dispatch(showPassword())
    },

    closePsd() {
      dispatch(closePassword())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Index))