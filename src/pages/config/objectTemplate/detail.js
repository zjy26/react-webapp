import React, { useEffect, useState, createContext } from 'react'
import { Tabs, Row } from 'antd'
import { Link } from 'react-router-dom'
import Basic from './detailTabs/basic/index'
import Unit from './detailTabs/unit/index'
import Property from './detailTabs/property/index'
import Setting from './detailTabs/setting/index'
import Monitor from './detailTabs/monitor/index'
import Test from './detailTabs/test/index'
import { connect } from 'react-redux'
import { getClass, getProperty, getImpartance, getClassification, getMainCls, getVoltageLevel, getMonitorPointType, getUoms } from './store/actionCreators'

const MyContext = createContext({})

const Detail = props => {
  const { getClassDispatch, getPropertyDispatch, getImpartanceDispatch, getClassificationDispatch, geMainClsDispatch, getVoltageLevelDispatch, getMonitorPointTypeDispatch, getUomsDispatch } = props

  const [activeKey, setActiveKey] = useState("bascInfo")  //默认显示基础信息tab
  const [templateCode, setTemplateCode] = useState()  //模板基础信息code

  useEffect(() => {
    document.title = "模板定义详情"

    //设备分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.classification',
      clsFun: 'asset.classification',
      major: '06'
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
    getImpartanceDispatch()  //重要程度
    getClassificationDispatch()  //ABC分类
    geMainClsDispatch()  //设备大类
    getVoltageLevelDispatch()  //电压等级
    getPropertyDispatch()  //属性
    getMonitorPointTypeDispatch() //属性类别
    getUomsDispatch()  //计量单位

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Link to="/config/object-template"><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Link>
        <h2 style={{ margin: '-5px 0 10px 20px' }}>模板信息详情</h2>
      </Row>

      <MyContext.Provider
        value={{
          id: props.match.params.id,
          templateCode: templateCode,
          brandOption: props.brands.toJS(),  //品牌
          suppliersOption: props.suppliers.toJS(),  //供应商
          classOption: props.class.toJS(),  //设备分类
          unitClassOption: props.unitClass.toJS(),  //部件分类
          typeOption: props.type.toJS(),  //类型
          importanceOption: props.importance.toJS(),  //重要程度
          classificationOption: props.classification.toJS(),  //ABC分类
          objectClsOption: props.objectCls.toJS(),  //固定资产分类
          voltageLevelOption: props.voltageLevel.toJS(),  //电压等级
          mainClsOption: props.mainCls.toJS(),  //设备大类
          propertiesOption: props.properties.toJS(),  //属性
          monitorPointTypeOption: props.monitorPointType.toJS(),  //性能属性类型
          uomsOption: props.uoms.toJS(),  //计量单位
          actUomsOption: props.actUoms.toJS(),  //动作计量单位
        }}
      >
        {
          props.match.params.id !== "null" || templateCode ?
            <Tabs
              tabPosition="left"
              activeKey={activeKey}
              onChange={(key) => { setActiveKey(key) }}
            >
              <Tabs.TabPane tab="基础信息" key="bascInfo">
                <Basic {...{ MyContext, setTemplateCode, setActiveKey }} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="部件信息" key="unitInfo">
                <Unit MyContext={MyContext} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="属性信息" key="propertyInfo">
                <Property MyContext={MyContext} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="整定值信息" key="settingInfo">
                <Setting MyContext={MyContext} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="监测信息" key="monitorInfo">
                <Monitor MyContext={MyContext} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="试验信息" key="testInfo">
                <Test MyContext={MyContext} />
              </Tabs.TabPane>
            </Tabs> :
            <Tabs
              tabPosition="left"
              activeKey={activeKey}
              onChange={(key) => { setActiveKey(key) }}
            >
              <Tabs.TabPane tab="基础信息" key="bascInfo">
                <Basic {...{ MyContext, setTemplateCode, setActiveKey }} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="部件信息" key="unitInfo" disabled />
              <Tabs.TabPane tab="属性信息" key="propertyInfo" disabled />
              <Tabs.TabPane tab="整定值信息" key="settingInfo" disabled />
              <Tabs.TabPane tab="监测信息" key="monitorInfo" disabled />
              <Tabs.TabPane tab="试验信息" key="testInfo" disabled />
            </Tabs>

        }
      </MyContext.Provider>

    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  brands: state.getIn(['common', 'brands']),
  suppliers: state.getIn(['common', 'suppliers']),
  class: state.getIn(['objectTemplate', 'class']),
  unitClass: state.getIn(['objectTemplate', 'unitClass']),
  type: state.getIn(['objectTemplate', 'type']),
  importance: state.getIn(['objectTemplate', 'importance']),
  classification: state.getIn(['objectTemplate', 'classification']),
  objectCls: state.getIn(['objectTemplate', 'objectCls']),
  voltageLevel: state.getIn(['objectTemplate', 'voltageLevel']),
  mainCls: state.getIn(['objectTemplate', 'mainCls']),
  properties: state.getIn(['objectTemplate', 'properties']),
  monitorPointType: state.getIn(['objectTemplate', 'monitorPointType']),
  uoms: state.getIn(['objectTemplate', 'uoms']),
  actUoms: state.getIn(['objectTemplate', 'actUoms']),
})

const mapDispatchOBJ = {
  getClassDispatch: getClass,
  getImpartanceDispatch: getImpartance,
  getClassificationDispatch: getClassification,
  getVoltageLevelDispatch: getVoltageLevel,
  geMainClsDispatch: getMainCls,
  getPropertyDispatch: getProperty,
  getMonitorPointTypeDispatch: getMonitorPointType,
  getUomsDispatch: getUoms,
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(Detail))
