import React, {useState, useContext, useEffect} from 'react'
import { Modal, Form, Row, Col,} from 'antd'
import { connect } from 'react-redux'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import { overheadLine,objecttemplates,classification,OBJECT_CRITICALITY_LEVEL,VOLTAGE_LEVEL,OBJECT_MAIN_CLS } from '../../../../../api/index'
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const ObjectDetilModal = props => {
  const { MyContext} = props
  const { classOption} = useContext(MyContext)
  const [object,setObject] = useState([])
  const [objectCriticalityLevel,setObjectCriticalityLevel] = useState([])
  const [voltageLevel,setVoltageLevel] = useState([])
  const [objectMainCls,setObjectMainCls] = useState([])
  const [objecttemplateList,setObjecttemplateList] = useState([])
  const [arr] = useState([])
  const [initValues, setInitValues] = useState({})


  useEffect(()=>{
    objecttemplates({type:'01'})
    .then(res => {
      if(res){
        setObjecttemplateList(res.models)
      }
    })
    OBJECT_CRITICALITY_LEVEL()
    .then(res => {
      if(res){
        setObjectCriticalityLevel(res.models)
      }
    })
    VOLTAGE_LEVEL()
    .then(res => {
      if(res){
        setVoltageLevel(res.models)
      }
    })
    OBJECT_MAIN_CLS()
    .then(res => {
      if(res){
        setObjectMainCls(res.models)
      }
    })
    classification({
      org: props.user.org,
      fun: 'asset.object',
      clsFun: 'asset.class'

    })
    .then(res => {
      if(res &&res.children){
        getObjClsArr(res.children)
      }
    })


  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    if(props.objId){
      overheadLine.overHeadLineObjectDetail(props.objId)
      .then(res => {
        if(res){
          if(res.template){
            const objecttemplate = objecttemplateList.find((value) =>  value.code === res.template)
            if(objecttemplate && objecttemplate.id){
              configObjectTemplate.objectTemplateDetail(objecttemplate.id)
              .then(res => {
                if(res){
                  const objectCriticalityLevels = objectCriticalityLevel.find(obj=>obj.code=res.importance)
                  const voltageLevels = voltageLevel.find(obj=>obj.code=res.voltageLevel)
                  const objectMainClses = objectMainCls.find(obj=>obj.code=res.mainCls)
                  const objectClses = arr.find(obj=>obj.id=res.objectCls)
                  setObject({
                    ...res,
                    template:res.name,
                    importanceDesc:objectCriticalityLevels?objectCriticalityLevels.name:undefined,
                    voltageLevelDesc:voltageLevels?voltageLevels.name:undefined,
                    objectMainClsDesc:objectMainClses?objectMainClses.name:undefined,
                    objectClsDesc:objectClses?objectClses.text:undefined
                  })
                }
              })
              .catch(() => {
                console.log("列表数据加载失败")
              })
            }
          }
          const objectClasses = []
          classOption && classOption.map(item => {
            item.children.map(item => {
              objectClasses.push (item)
              return objectClasses
            }
            )
            return objectClasses
          })

          const brandName = props.brands.toJS().find(obj=>obj.code===res.brand)
          const cls = objectClasses.find(obj=>obj.model.code===res.cls)
          const objecttemplate = objecttemplateList.find((value) =>  value.code = res.template)
          setInitValues({...res,
            brand : brandName ? brandName.descr:null,
            cls : cls?cls.model.desc:null,
            template:objecttemplate?objecttemplate.name:null,
            commissDate:res.commissDate?moment(res.commissDate).format('YYYY-MM-DD'):null
            })
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.objId])

  function getObjClsArr(data) {
    data.forEach((item)=>{
      if(item.children.length === 0) {
        arr.push(item)
      } else {
        getObjClsArr(item.children)
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="查看详情"
      okText="确认"
      cancelText="取消"
      width="800px"
      onOk={props.handleCancel}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} initialValues={{...initValues,...object}}>
        <Row gutter={24}>
          <Col span={24}>
            <label style={{fontSize:18, marginRight:20}}>基本信息</label>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">
              {initValues.descr}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="品牌">
            {initValues.brand}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="型号">
            {initValues.modelNumber}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格">
              {initValues.spec}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备分类">
              {initValues.cls}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">
            {initValues.remarks}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备标识">
            {initValues.objectMark}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="长度">
              {initValues.length}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="模板">
              {object.template}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="启用日期">
              {initValues.commissDate}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="另一根锚段号">
              {initValues.anchorSection}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="另一根股道数">
              {initValues.stationTrack}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="形式">
              {initValues.shape}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单/双线" >
              {initValues.singleDouleLine==='1'?'单线':'双线'}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="道岔号" >
              {initValues.turnout}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="股道数据量" >
              {initValues.stationTrackData}
            </Form.Item>
          </Col>
          <Col span={24}>
            <label style={{fontSize:18, marginRight:20}}>设备信息</label>
          </Col>
          <Col span={12}>
            <Form.Item label="设计寿命" >
              {object.designLife}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="大修年限">
              {object.repairLife}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="更换年限" >
              {object.replaceLife}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="建议维护周期" >
              {object.maintenanceCycle}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造商" >
              {object.manufact?object.manufact.name:''}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="一次变比参数">
              {object.transRatio1}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="二次变比参数">
              {object.transRatio2}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="遵循标准" >
            {object.standard}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item label="BIM结构图" >
              <Input disabled/>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <label style={{fontSize:18, marginRight:20}}>企业信息</label>
          </Col>
          <Col span={12}>
            <Form.Item label="重要程度">
              {object.importanceDesc}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ABC分类">
              {object.classification}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="固定资产分类">
              {object.objectClsDesc}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电压等级" >
              {object.voltageLevelDesc}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备大类" >
              {object.objectMainClsDesc}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="E码/订货编号">
              {object.ecode}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location']),
    user: state.getIn(['common', 'user']),
    brands: state.getIn(['common', 'brands'])
  }
}

export default connect(mapStateToProps, null)(React.memo(ObjectDetilModal))
