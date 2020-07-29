/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, createContext } from 'react'
import { Tabs, Row, message } from 'antd'
import { Link } from 'react-router-dom'
import Basic from './detailTabs/basic/index'
import TestingRecord from './detailTabs/testingRecord/index'
import ObjectTable from './detailTabs/objectTable/index'
import { connect } from 'react-redux'
import { getClass, getClassification, getTemplate,getUnitTemplate, getPeople, getVehicleRoute, getConfigLocation, getstationTracks, getCatenaryType, getCatenaryLocationType, getOverheadLineDebugItem } from './store/actionCreators'

const MyContext = createContext({})

const Detail = props => {
  const { getClassDispatch, getTemplateDispatch, getUnitTemplateDispatch, getVehicleRouteDispatch, getPeopleDispatch, getConfigLocationDispatch, getstationTracksDispatch, getCatenaryTypeDispatch, getCatenaryLocationTypeDispatch, getOverheadLineDebugItemDispatch } = props

  const [activeKey, setActiveKey] = useState("bascInfo")  //默认显示基础信息tab
  const [line, setLine] = useState()  //线路
  const [base, setBase] = useState(0)  //调试记录更换刷新基础信息
  const [editStatus, setEditStatus] = useState()  //基础信息编辑状态

  useEffect(() => {
    document.title = "一杆一档详情"

    //设备分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.classification',
      clsFun: 'asset.classification',
      major: '07'
    })
    //部件分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.unit',
      clsFun: 'asset.unitClass'
    })
    //固定资产分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.object',
      clsFun: 'asset.class'
    })
    getVehicleRouteDispatch()  //行车路线
    getstationTracksDispatch()  //股道号
    getCatenaryTypeDispatch()  //触网类型
    getCatenaryLocationTypeDispatch() //布置位置
    getOverheadLineDebugItemDispatch()  //项目
    getConfigLocationDispatch() //线路信息
    getPeopleDispatch() //人员信息
    getTemplateDispatch()//设备模板
    getUnitTemplateDispatch()//部件模板
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Link to="/overhead-line"><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Link>
        <h2 style={{ margin: '-5px 0 10px 20px' }}>一杆一档详情</h2>
      </Row>

      <MyContext.Provider
        value={{
          id: props.match.params.id,
          code: props.match.params.code,
          user: props.user.toJS(),
          line: line,
          suppliersOption: props.suppliers.toJS(),  //供应商
          typeOption: props.type.toJS(),  //类型
          maintainTypeOption: props.maintainType.toJS(),  //维护类型
          brandOption: props.brands.toJS(),  //品牌
          peopleOption: props.peoples.toJS(),
          classOption: props.class.toJS(),  //设备分类
          unitClassOption: props.unitClass.toJS(),  //部件分类
          objectClsOption: props.objectCls.toJS(),  //固定资产分类
          vehicleRouteOption: props.vehicleRoute.toJS(), //行车路线
          stationtracksOption: props.stationtracks.toJS(),  //股道号
          catenaryTypeOption: props.catenaryType.toJS(),  //触网类型
          catenaryLocationTypeOption: props.catenaryLocationType.toJS(),  //布置位置
          overheadLineDebugItemOption: props.overheadLineDebugItem.toJS(),  //项目
          ConfigLocationOption: props.configLocations.toJS(), //线路信息
          templateOption: props.templates.toJS(),//设备模板
          unitTemplateOption:props.unitTemplates.toJS()//部件模板
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
            <Basic MyContext={MyContext} setLine={setLine} base={base} setEditStatus={setEditStatus} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="调试记录" key="testingRecord">
            <TestingRecord MyContext={MyContext} setBase={setBase} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="设备/更换/维护记录" key="object">
            <ObjectTable MyContext={MyContext} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="图形化信息" key="monitorInfo">

          </Tabs.TabPane> */}
        </Tabs>
      </MyContext.Provider>

    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  brands: state.getIn(['common', 'brands']),

  suppliers: state.getIn(['common', 'suppliers']),
  class: state.getIn(['onePoleAndOneGear', 'class']),
  objectCls: state.getIn(['onePoleAndOneGear', 'objectCls']),
  unitClass: state.getIn(['onePoleAndOneGear', 'unitClass']),
  type: state.getIn(['onePoleAndOneGear', 'type']),
  maintainType: state.getIn(['onePoleAndOneGear', 'maintainType']),
  peoples: state.getIn(['onePoleAndOneGear', 'peoples']),
  vehicleRoute: state.getIn(['onePoleAndOneGear', 'vehicleRoute']),
  stationtracks: state.getIn(['onePoleAndOneGear', 'stationtracks']),
  voltageLevel: state.getIn(['onePoleAndOneGear', 'voltageLevel']),
  catenaryType: state.getIn(['onePoleAndOneGear', 'catenaryType']),
  catenaryLocationType: state.getIn(['onePoleAndOneGear', 'catenaryLocationType']),
  overheadLineDebugItem: state.getIn(['onePoleAndOneGear', 'overheadLineDebugItem']),
  configLocations: state.getIn(['onePoleAndOneGear', 'configLocations']),
  templates: state.getIn(['onePoleAndOneGear', 'templates']),
  unitTemplates: state.getIn(['onePoleAndOneGear', 'unitTemplates'])
})

const mapDispatchOBJ = {
  getClassDispatch: getClass,
  getClassificationDispatch: getClassification,
  getVehicleRouteDispatch: getVehicleRoute,
  getstationTracksDispatch: getstationTracks,
  getCatenaryTypeDispatch: getCatenaryType,
  getCatenaryLocationTypeDispatch: getCatenaryLocationType,
  getOverheadLineDebugItemDispatch: getOverheadLineDebugItem,
  getConfigLocationDispatch: getConfigLocation,
  getPeopleDispatch: getPeople,
  getTemplateDispatch: getTemplate,
  getUnitTemplateDispatch: getUnitTemplate
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(Detail))
