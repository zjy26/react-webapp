import React, { useEffect } from 'react'
import { Layout, Menu, Icon, Dropdown, Form } from 'antd'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'
import MeunRoute from '../../routes'
import EditPassword from './editPassword'
import './Index.module.scss'
import { locationTree, brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from '../../api'
import store from '../../store'
import { locationTreeAction, brandsAction, robotObjectTypeAction, robotObjectStatusAction, videoStreamAction } from '../../store/actionCreators'
import { connect } from 'react-redux'

const { Header, Content } = Layout
const Index = (props) => {
  console.log(props)
  const showModal = () => {
    props.showPsdModal()
  }
  const handleOk = (values) => {
    console.log(values)
  }
  const handleCancel = () => {
    props.closePsdModal()
  }

  // 方法一connect中不加mapDispatchToProps,能在props中直接获取到dispatch-----这个写法和redux文档上的类似
  useEffect(() => {
    //线路站点
  locationTree()
  .then(res => {
    const siteArr = []
    const lineArr = []
    if (res) {
      for (var item of res.lineSite) {
        let lineObj = {}
        lineObj["value"] = item.value
        lineObj["label"] = item.label
        lineArr.push(lineObj)
        siteArr.push(...item.children)
      }
      const location = {
        lineSite: res.lineSite,
        line: lineArr,
        site: siteArr
      }
      console.log(location)
      console.log(props.locationTreeAction)
      props.locationTreeAction(location)
    }
  }).catch((err) => {
    console.log("线路站点数据加载失败")
  })
  }, [])

  //品牌
  brands()
    .then(res => {
      if (res && res.models) {
        const action = brandsAction(res.models)
        store.dispatch(action)
      }
    })

  //设备类型
  ROBOT_OBJECT_TYPE()
    .then(res => {
      if (res && res.models) {
        const action = robotObjectTypeAction(res.models)
        store.dispatch(action)
      }
    })

  //设备状态
  ROBOT_OBJECT_STATUS()
    .then(res => {
      if (res && res.models) {
        const action = robotObjectStatusAction(res.models)
        store.dispatch(action)
      }
    })

  //视频流程协议
  VIDEO_STREAM()
    .then(res => {
      if (res && res.models) {
        const action = videoStreamAction(res.models)
        store.dispatch(action)
      }
    })

  const pathname = props.history.location.pathname.split('/').slice(1);  //获取当前页面的路径

  const menu = (
    <Menu className="dropMenu">
      <Menu.Item key="setting"><NavLink to="/setting">个人设置</NavLink></Menu.Item>
      <Menu.Item key="editPassword" onClick={showModal}>修改密码</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout"><NavLink to="/login">退出</NavLink></Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['home']}
            selectedKeys={pathname}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="home"><NavLink to="/home">首页</NavLink></Menu.Item>
            <Menu.Item key="applications"><NavLink to="/applications">应用管理</NavLink></Menu.Item>
            <Menu.Item key="patrol-object"><NavLink to="/patrol-object">设备管理</NavLink></Menu.Item>
            <Menu.Item key="patrol-plan"><NavLink to="/patrol-plan">巡检计划</NavLink></Menu.Item>
            <Menu.Item key="patrol-sheet"><NavLink to="/patrol-sheet">巡检单</NavLink></Menu.Item>
            <Menu.Item key="patrol-config"><NavLink to="/patrol-config">巡检配置</NavLink></Menu.Item>
            <Menu.Item key="data-statistics"><NavLink to="/data-statistics">数据统计</NavLink></Menu.Item>
            <Menu.Item key="user" style={{ float: 'right' }}>
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
            <Redirect to='/patrol-config' />
          </Switch>
        </Content>
      </Layout>
      <EditPassword form={props.form} visible={props.visible} {...{ handleOk, handleCancel }} />
    </div>
  );
}

//修改密码弹窗
const mapStateToProps = (state) => {
  console.log(state)
  return {
    visible: state.psdModalvisible
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    showPsdModal(e) {
      let action = {
        type: 'showPsdModal'
      }
      dispatch(action)
    },
    closePsdModal() {
      let action = {
        type: 'closePsdModal'
      }
      dispatch(action)
    },
    locationTreeAction(data) {
      console.log(data)
      locationTreeAction(dispatch, data)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Form.create()(Index)))