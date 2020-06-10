import React, { useEffect, useState, createContext } from 'react'
import { Row, Tabs, message } from 'antd'
import { Link } from 'react-router-dom'
import Basic from './detailTabs/basic/index'
import Location from './detailTabs/location/index'
import Interval from './detailTabs/interval/index'
import Anchor from './detailTabs/anchor/index'
import Catenary from './detailTabs/catenary/index'
import { configLocation } from '../../../api/config/lineInfo'
import { classification, CATENARY_TYPE, SITE_FUNCTION, LOCATION_SUBSTATION_TYPE, STATION_LOCATION_TYPE, VEHICLE_ROUTE, brands } from '../../../api'
import { connect } from 'react-redux'

const MyContext = createContext({});

const Detail = props => {
  const [lineCode, setLineCode] = useState()
  const [siteList, setSiteList] = useState([])
  const [intervalList, setIntervalList] = useState([])
  const [activeKey, setActiveKey] = useState("bascInfo")  //默认显示基础信息tab
  const [entity, setEntity] = useState({
    catenaryTypeOption: [],  //触网类型
    siteFunctionOption: [],  //车站类型
    styleOption: [],  //变电所类型
    locationTypeOption: [],  //车站位置类型
    vehicleRouteOption: [],  //行车路线
    brandOption: [],  //品牌
    classOption: []  //设备分类
  })
  const [editStatus, setEditStatus] = useState()  //基础信息编辑状态

  //获取实体数据
  const getEntity = (url, option) => {
    url()
      .then((res) => {
        if (res && res.models) {
          const obj = {}
          obj[option] = res.models
          setEntity(entity => {
            return { ...entity, ...obj }
          })
        }
      })
  }

  useEffect(() => {
    document.title = "线路信息详情"

    getEntity(CATENARY_TYPE, "catenaryTypeOption")  //触网类型
    getEntity(SITE_FUNCTION, "siteFunctionOption")  //车站类型
    getEntity(LOCATION_SUBSTATION_TYPE, "styleOption")  //变电所类型
    getEntity(STATION_LOCATION_TYPE, "locationTypeOption")  //车站位置类型
    getEntity(VEHICLE_ROUTE, "vehicleRouteOption")  //行车路线
    getEntity(brands, "brandOption")//品牌


    //设备分类
    classification({
      org: props.user.toJS().org,
      fun: 'asset.classification',
      clsFun: 'asset.classification',
      major: '06'
    })
      .then(res => {
        if (res && res.children) {
          setEntity(entity => {
            return { ...entity, classOption: res.children }
          })
        }
      }).catch(() => {
        console.log("设备分类加载失败")
      })

    configLocation.configLocationDetail(props.match.params.id)
      .then(res => {
        if (res) {
          setLineCode(res.code)  //线路code

          configLocation.configIntervalList({ level: 4, line: res.code })  //区间信息(新建锚段时需要选择关联区间)
            .then(res => {
              if (res && res.models) {
                setIntervalList(res.models)
              }
            })
        }
      })
      .catch(() => {
        console.log("业务基础数据详情获取失败")
      })

    configLocation.configLocationList({ level: 4, line: props.match.params.code })  //站点信息(新建区间时需要选择站点)
      .then(res => {
        if (res && res.models) {
          setSiteList(res.models)
        }
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Link to="/config/line-info"><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Link>
        <h2 style={{ margin: '-5px 0 10px 20px' }}>线路信息详情</h2>
      </Row>

      <MyContext.Provider
        value={{
          entity: entity,
          lineCode: lineCode,
          org: props.user.toJS().org,
          siteList: siteList,
          intervalList: intervalList
        }}
      >
        <Tabs
          tabPosition="left"
          activeKey={activeKey}
          onChange={
            (key) => {
              if (editStatus) {
                message.info('基础信息处于编辑状态，请先保存或取消')
              } else {
                setActiveKey(key)
              }
            }
          }
        >
          <Tabs.TabPane tab="基础信息" key="bascInfo">
            <Basic {...{ id: props.match.params.id, catenaryTypeOption: entity.catenaryTypeOption, setLineCode, setEditStatus }} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="站点信息" key="siteInfo">
            <Location {...{ lineCode, entity, setSiteList, MyContext }} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="区间信息" key="netInfo">
            <Interval {...{ lineCode, entity, siteList, setIntervalList, MyContext }} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="锚段信息" key="anchorInfo">
            <Anchor {...{ lineCode, entity, MyContext }} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="设备信息" key="objectInfo">
            <Catenary  {...{ lineCode, entity, MyContext }} />
          </Tabs.TabPane>
        </Tabs>
      </MyContext.Provider>

    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user'])
})

export default connect(mapStateToProps, null)(React.memo(Detail))
