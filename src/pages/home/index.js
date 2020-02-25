import React, { useRef } from 'react';
import { Layout, Menu, Icon, Dropdown,Form } from 'antd';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import ObjectEvaluation from '../objectEvaluation';
import Application from '../application/index';
import ObjectModule from '../object/index';
import Detail from '../object/detail';
import PatrolPlan from '../patrolPlan/index';
import PatrolSheet from '../patrolSheet/index';
import PatrolConfig from '../patrolConfig/index';
import DataStatistics from '../dataStatistics/index';
import PatrolPlanDetail from '../patrolPlan/patrolPlan';
import NewPatrolSheet from '../patrolSheet/newPatrolSheet';
import PatrolSheetDetail from '../patrolSheet/patrolSheetDetail';
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
        <Menu.Item key="setting"><NavLink to="/setting">个人设置</NavLink></Menu.Item>
        <Menu.Item key="editPassword" onClick={showModal}>修改密码</Menu.Item>
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
            <Menu.Item key="objects"><NavLink to="/objects">设备管理</NavLink></Menu.Item>
            <Menu.Item key="patrolPlan"><NavLink to="/patrolPlan">巡检计划</NavLink></Menu.Item>
            <Menu.Item key="patrolSheet"><NavLink to="/patrolSheet">巡检单</NavLink></Menu.Item>
            <Menu.Item key="patrolConfig"><NavLink to="/patrolConfig">巡检配置</NavLink></Menu.Item>
            <Menu.Item key="dataStatistics"><NavLink to="/dataStatistics">数据统计</NavLink></Menu.Item>
            <Menu.Item key="objectEvaluation"><NavLink to="/objectEvaluation">设备评价</NavLink></Menu.Item>
            <Menu.Item key="demo"><NavLink to="/demo">Demo</NavLink></Menu.Item>
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
            <Route path="/demo" component= {Demo}></Route>
            <Route path="/objects" component= {ObjectModule}></Route>
            <Route path="/setting" component= {Setting}></Route>
            <Route path="/detail" component= {Detail}></Route>
            <Route path="/patrolPlan" component= {PatrolPlan}></Route>
            <Route path="/patrolSheet" component= {PatrolSheet}></Route>
            <Route path="/patrolConfig" component= {PatrolConfig}></Route>
            <Route path="/dataStatistics" component= {DataStatistics}></Route>
            <Route path="/patrolPlanDetail" component= {PatrolPlanDetail}></Route>
            <Route path="/newPatrolSheet" component= {NewPatrolSheet}></Route>
            <Route path="/patrolSheetDetail" component= {PatrolSheetDetail}></Route>
            <Route path="/objectEvaluation" component= {ObjectEvaluation}></Route>
            <Redirect to='/home' />
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