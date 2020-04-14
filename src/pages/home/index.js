import React, { useLayoutEffect } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Layout, Menu, Dropdown } from 'antd'
import { Route, NavLink, Switch, Redirect } from 'react-router-dom'
import MeunRoute from '../../routes'
import EditPassword from './editPassword'
import './Index.module.scss'
import { locationTree, brands, ROBOT_OBJECT_TYPE, ROBOT_OBJECT_STATUS, VIDEO_STREAM } from '../../api'
import { locationTreeAction, brandsAction, robotObjectTypeAction, robotObjectStatusAction, videoStreamAction } from '../../store/actionCreators'
import { connect } from 'react-redux'

const { Header, Content } = Layout
const Index = (props) => {
  const showModal = () => {
    props.showPsdModal()
  }
  const handleOk = (values) => {
    console.log(values)
  }
  const handleCancel = () => {
    props.closePsdModal()
  }

  useLayoutEffect(() => {
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
        props.locationTree(location)
      }
    }).catch((err) => {
      console.log("线路站点数据加载失败")
    })
    //品牌
    brands()
    .then(res => {
      if (res && res.models) {
        props.getBrands(res.models)
      }
    })
  
    //设备类型
    ROBOT_OBJECT_TYPE()
    .then(res => {
      if (res && res.models) {
        props.getRobotObjectType(res.models)
      }
    })
  
    //设备状态
    ROBOT_OBJECT_STATUS()
    .then(res => {
      if (res && res.models) {
        props.getRobotObjectStatus(res.models)
      }
    })

    //视频流程协议
    VIDEO_STREAM()
    .then(res => {
      if (res && res.models) {
        props.getVideoStream(res.models)
      }
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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
            <Menu.Item key="object-evaluation"><NavLink to="/object-evaluation">设备评价</NavLink></Menu.Item>
            <Menu.Item key="user" style={{ float: 'right' }}>
              <Dropdown overlay={menu} trigger={['click']}>
                <span>
                  <UserOutlined />
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
            <Redirect to='/home' />
          </Switch>
        </Content>
      </Layout>
      <EditPassword visible={props.visible} {...{ handleOk, handleCancel }} />
    </div>
  );
}

//修改密码弹窗
const mapStateToProps = (state) => {
  return {
    visible: state.psdModalvisible,
    locationTree: state.locationTree,
    brands: state.brands,
    robotObjectType: state.robotObjectType,
    robotObjectStatus: state.robotObjectStatus,
    videoStream: state.videoStream
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
    locationTree(data) {
      locationTreeAction(dispatch, data)
    },
    getBrands(data) {
      brandsAction(dispatch, data)
    },
    getRobotObjectStatus(data) {
      robotObjectStatusAction(dispatch, data)
    },
    getRobotObjectType(data) {
      robotObjectTypeAction(dispatch, data)
    },
    getVideoStream(data) {
      videoStreamAction(dispatch, data)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo((Index)))