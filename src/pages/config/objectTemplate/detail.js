import React, { useEffect, useState, createContext } from 'react'
import { Tabs, Row, message } from 'antd'
import { Link } from 'react-router-dom'
import Basic from './detailTabs/basic/index'
// import DynamicBasic from './detailTabs/dynamicBasic/index'
import Unit from './detailTabs/unit/index'
import Property from './detailTabs/property/index'
import Setting from './detailTabs/setting/index'
import Monitor from './detailTabs/monitor/index'
import Test from './detailTabs/test/index'
import Faultlib from './detailTabs/faultlib/index'
import { connect } from 'react-redux'
import { getClass, getProperty, getImpartance, getObjectFunctionalType, getClassification, getMainCls, getVoltageLevel, getMonitorPointType, getUoms, getParamsName, getExperimentStandardType, getExperimentStandardValue } from './store/actionCreators'

const MyContext = createContext({})

const Detail = props => {
  const { getClassDispatch, getPropertyDispatch, getObjectFunctionalTypeDispatch, getImpartanceDispatch, getClassificationDispatch, geMainClsDispatch, getVoltageLevelDispatch, getMonitorPointTypeDispatch, getUomsDispatch, getParamsNameDispatch, getExperimentStandardTypeDispatch, getExperimentStandardValueDispatch } = props

  const [activeKey, setActiveKey] = useState("bascInfo")  //默认显示基础信息tab
  const [templateCode, setTemplateCode] = useState()  //模板基础信息code
  const [objectClass, setObjectClass] = useState()  //设备分类
  const [versionCode, setVersionCode] = useState(0)  //版本/镜像
  const [checkStatus, setCheckStatus] = useState({    //基础信息编辑状态
    info1: true,
    info2: true,
    info3: true
  })

  useEffect(() => {
    document.title = "模板定义详情"

    //变电设备分类
    if(props.match.params.type === "substation") {
      getClassDispatch({
        org: props.user.toJS().org,
        fun: 'asset.classification',
        clsFun: 'asset.classification',
        major: '06'
      })
    }

    //触网设备分类
    if(props.match.params.type === "catenary") {
      getClassDispatch({
        org: props.user.toJS().org,
        fun: 'asset.classification',
        clsFun: 'asset.classification',
        major: '07'
      })
    }

    //固定资产分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.object',
      clsFun: 'asset.class'
    })
    getObjectFunctionalTypeDispatch()  //功能类型
    getImpartanceDispatch()  //重要程度
    getClassificationDispatch()  //ABC分类
    geMainClsDispatch()  //设备大类
    getVoltageLevelDispatch()  //电压等级
    getPropertyDispatch()  //属性
    getMonitorPointTypeDispatch() //属性类别
    getUomsDispatch()  //计量单位
    getParamsNameDispatch()  //动态基础信息参数名称
    getExperimentStandardTypeDispatch()  //试验属性标准值类型
    getExperimentStandardValueDispatch()  //试验属性标准值

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
          newType: props.match.params.type,
          id: props.match.params.id,
          org: props.user.toJS().org,
          templateCode: templateCode,
          brandOption: props.brands.toJS(),  //品牌
          suppliersOption: props.suppliers.toJS(),  //供应商
          classOption: props.class.toJS(),  //设备分类
          unitClassOption: props.unitClass.toJS(),  //部件分类
          typeOption: props.type.toJS(),  //类型
          importanceOption: props.importance.toJS(),  //重要程度
          objectFunctionTypeOption: props.objectFunctionType.toJS(),  //功能类型
          classificationOption: props.classification.toJS(),  //ABC分类
          objectClsOption: props.objectCls.toJS(),  //固定资产分类
          voltageLevelOption: props.voltageLevel.toJS(),  //电压等级
          mainClsOption: props.mainCls.toJS(),  //设备大类
          propertiesOption: props.properties.toJS(),  //属性
          monitorPointTypeOption: props.monitorPointType.toJS(),  //性能属性类型
          uomsOption: props.uoms.toJS(),  //计量单位
          actUomsOption: props.actUoms.toJS(),  //动作计量单位
          paramsNameOption: props.paramsName.toJS(),  //参数名称
          dataTypeOption: props.dataType.toJS(),  //数据样式
          experimentStandardTypeOption: props.experimentStandardType.toJS(),  //试验属性标准值类型
          experimentStandardValueOption: props.experimentStandardValue.toJS(),  //试验属性标准值类型
        }}
      >
        {
          props.match.params.id !== "null" || templateCode
          ? <React.Fragment>
            {
              props.match.params.type === "unit"
              ? <Tabs       //部件模板
                  tabPosition="left"
                  activeKey={activeKey}
                  onChange={
                    (key) => {
                      if (checkStatus.info1 && checkStatus.info2 && checkStatus.info3) {
                        setActiveKey(key)
                      } else {
                        message.info('基础信息处于编辑状态，请先保存或取消')
                      }
                    }
                  }
                >
                  <Tabs.TabPane tab="基础信息" key="bascInfo">
                    <Basic {...{ MyContext, setTemplateCode, setVersionCode, setObjectClass, setActiveKey, setCheckStatus }} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="出厂属性信息" key="propertyInfo">
                    <Property MyContext={MyContext} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="监测信息" key="monitorInfo">
                    <Monitor MyContext={MyContext} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="试验信息" key="testInfo">
                    <Test MyContext={MyContext} />
                  </Tabs.TabPane>
                </Tabs>
              : <Tabs       //设备模板
                  tabPosition="left"
                  activeKey={activeKey}
                  onChange={
                    (key) => {
                      if (checkStatus.info1 && checkStatus.info2 && checkStatus.info3) {
                        setActiveKey(key)
                      } else {
                        message.info('基础信息处于编辑状态，请先保存或取消')
                      }
                    }
                  }
                >
                  <Tabs.TabPane tab="基础信息" key="bascInfo">
                    <Basic {...{ MyContext, setTemplateCode, setVersionCode, setObjectClass, setActiveKey, setCheckStatus }} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部件信息" key="unitInfo">
                    <Unit MyContext={MyContext} versionCode={versionCode} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="出厂属性信息" key="propertyInfo">
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
                  <Tabs.TabPane tab="故障知识库" key="faultlib">
                    <Faultlib MyContext={MyContext} objectClass={objectClass}/>
                  </Tabs.TabPane>
                </Tabs>
            }
            </React.Fragment>
          : <React.Fragment>
            {  //新建
              props.match.params.type === "unit"
              ? <Tabs tabPosition="left" activeKey={activeKey}>
                  <Tabs.TabPane tab="基础信息" key="bascInfo">
                    <Basic {...{ MyContext, setTemplateCode, setActiveKey, setCheckStatus }} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="出厂属性信息" key="propertyInfo" disabled />
                  <Tabs.TabPane tab="监测信息" key="monitorInfo" disabled />
                  <Tabs.TabPane tab="试验信息" key="testInfo" disabled />
                </Tabs>
              : <Tabs tabPosition="left" activeKey={activeKey}>
                  <Tabs.TabPane tab="基础信息" key="bascInfo">
                    <Basic {...{ MyContext, setTemplateCode, setActiveKey, setCheckStatus }} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="部件信息" key="unitInfo" disabled />
                  <Tabs.TabPane tab="出厂属性信息" key="propertyInfo" disabled />
                  <Tabs.TabPane tab="整定值信息" key="settingInfo" disabled />
                  <Tabs.TabPane tab="监测信息" key="monitorInfo" disabled />
                  <Tabs.TabPane tab="试验信息" key="testInfo" disabled />
                  <Tabs.TabPane tab="故障知识库" key="faultlib" disabled />
                </Tabs>
            }
           </React.Fragment>
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
  objectFunctionType: state.getIn(['objectTemplate', 'objectFunctionType']),
  classification: state.getIn(['objectTemplate', 'classification']),
  objectCls: state.getIn(['objectTemplate', 'objectCls']),
  voltageLevel: state.getIn(['objectTemplate', 'voltageLevel']),
  mainCls: state.getIn(['objectTemplate', 'mainCls']),
  properties: state.getIn(['objectTemplate', 'properties']),
  monitorPointType: state.getIn(['objectTemplate', 'monitorPointType']),
  uoms: state.getIn(['objectTemplate', 'uoms']),
  actUoms: state.getIn(['objectTemplate', 'actUoms']),
  paramsName: state.getIn(['objectTemplate', 'paramsName']),
  dataType: state.getIn(['objectTemplate', 'dataType']),
  experimentStandardType: state.getIn(['objectTemplate', 'experimentStandardType']),
  experimentStandardValue: state.getIn(['objectTemplate', 'experimentStandardValue']),
})

const mapDispatchOBJ = {
  getClassDispatch: getClass,
  getImpartanceDispatch: getImpartance,
  getObjectFunctionalTypeDispatch: getObjectFunctionalType,
  getClassificationDispatch: getClassification,
  getVoltageLevelDispatch: getVoltageLevel,
  geMainClsDispatch: getMainCls,
  getPropertyDispatch: getProperty,
  getMonitorPointTypeDispatch: getMonitorPointType,
  getUomsDispatch: getUoms,
  getParamsNameDispatch: getParamsName,
  getExperimentStandardTypeDispatch: getExperimentStandardType,
  getExperimentStandardValueDispatch: getExperimentStandardValue,
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo(Detail))
