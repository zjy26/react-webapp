import React, { useState, useContext, useEffect } from 'react'
import { Modal, Form, Row, Col, Upload } from 'antd'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import { overheadLine, classification, OBJECT_CRITICALITY_LEVEL, VOLTAGE_LEVEL, OBJECT_MAIN_CLS,echoBrand } from '../../../../../api/index'
import moment from 'moment'
import { showFile } from '../../../../common/upload'

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
  const { MyContext } = props
  const { classOption, templateOption, user } = useContext(MyContext)
  const [object, setObject] = useState([])
  const [objectCriticalityLevel, setObjectCriticalityLevel] = useState([])
  const [voltageLevel, setVoltageLevel] = useState([])
  const [objectMainCls, setObjectMainCls] = useState([])
  const [arr] = useState([])
  const [initValues, setInitValues] = useState({})

  const [fileList, setFileList] = useState({
    objImage: [],
    objBim: []
  })

  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  })

  useEffect(() => {
    OBJECT_CRITICALITY_LEVEL()
      .then(res => {
        if (res) {
          setObjectCriticalityLevel(res.models)
        }
      })
    VOLTAGE_LEVEL()
      .then(res => {
        if (res) {
          setVoltageLevel(res.models)
        }
      })
    OBJECT_MAIN_CLS()
      .then(res => {
        if (res) {
          setObjectMainCls(res.models)
        }
      })
    classification({
      org: user.org,
      fun: 'asset.object',
      clsFun: 'asset.class'

    })
      .then(res => {
        if (res && res.children) {
          getObjClsArr(res.children)
        }
      })


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  //广度遍历，在树形对象数组结构中查找指定对象
  const breadthQuery = (tree, item, value) => {
    var stark = []
    stark = stark.concat(tree)
    while (stark.length) {
      const temp = stark.shift()
      if (temp.children) {
        stark = stark.concat(temp.children)
      }
      if (temp['model'][item] === value) {
        return temp
      }
    }
  }

  useEffect(() => {
    if (props.visible) {
      overheadLine.overHeadLineObjectDetail(props.objId)
        .then(res => {
          if (res) {
            if (res.template) {
              const objecttemplate = templateOption.find(obj => obj.code === res.template)
              if (objecttemplate && objecttemplate.id) {
                configObjectTemplate.objectTemplateDetail(objecttemplate.id)
                  .then(res => {
                    if (res) {
                      const objectCriticalityLevels = objectCriticalityLevel.find(obj => obj.code === res.importance)
                      const voltageLevels = voltageLevel.find(obj => obj.code === res.voltageLevel)
                      const objectMainClses = objectMainCls.find(obj => obj.code === res.mainCls)
                      const objectClses = arr.find(obj => obj.id === ""+res.objectCls)
                      setObject({
                        ...res,
                        template: res.name,
                        importanceDesc: objectCriticalityLevels ? objectCriticalityLevels.name : undefined,
                        voltageLevelDesc: voltageLevels ? voltageLevels.name : undefined,
                        objectMainClsDesc: objectMainClses ? objectMainClses.name : undefined,
                        objectClsDesc: objectClses ? objectClses.text : undefined
                      })
                    }
                  })
                  //关联模板中的附件
                showFile(objecttemplate.id, "d9ObjectTemplate-image", setFileList, "objImage")
                showFile(objecttemplate.id, "d9ObjectTemplate-bim", setFileList, "objBim")
              }else{
                 //关联模板中的附件
                 showFile(null, "d9ObjectTemplate-image", setFileList, "objImage")
                 showFile(null, "d9ObjectTemplate-bim", setFileList, "objBim")
              }


            } else {
              setObject({})
            }
            //品牌字段回显
            if(res.brand) {
              echoBrand({value: res.brand})
                .then( brand => {
                  setInitValues({
                    ...res,
                    brand: brand ? brand.name : null,
                    commissDate: res.commissDate ? moment(res.commissDate).format('YYYY-MM-DD') : null
                  })
                })
            }
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  function getObjClsArr(data) {
    data.forEach((item) => {
      if (item.children.length === 0) {
        arr.push(item)
      } else {
        getObjClsArr(item.children)
      }
    })
  }

  //图片预览
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreview({
      ...preview,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  const previewCancel = () => setPreview({ ...preview, previewVisible: false })

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="查看详情"
      okText="确认"
      cancelText="取消"
      width="1200px"
      onOk={props.handleCancel}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} name="objectDetilForm" initialValues={{ ...initValues, ...object }}>
        <Row gutter={24}>
          <Col span={24}>
            <label style={{ fontSize: 18, marginRight: 20 }}>基本信息</label>
          </Col>
          <Col span={8}>
            <Form.Item label="设备描述">
              {initValues.descr}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="品牌">
              {initValues.brand}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="型号">
              {initValues.modelNumber}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="规格">
              {initValues.spec}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备分类">
              {
                Object.keys(classOption).length > 0 && breadthQuery(classOption, "code", initValues.cls)
                  ? breadthQuery(classOption, "code", initValues.cls).text
                  : null
              }
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="备注">
              {object.remarks}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备标识">
              {initValues.objectMark}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="长度">
              {initValues.length}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="模板">
              {object.template}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="启用日期">
              {initValues.commissDate}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="部件标识">
              {initValues.objectMark}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="另一根锚段号">
              {initValues.anchorSection}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="另一根股道数">
              {initValues.stationTrack}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="形式">
              {initValues.shape}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="单/双线" >
              {initValues.singleDouleLine === '1' ? '单线' : initValues.singleDouleLine === '2' ? '双线' : null}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="道岔号" >
              {initValues.turnout}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="股道数据量" >
              {initValues.stationTrackData}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="E码/订货编号">
              {initValues.ecode}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备图片">
              <Upload
                fileList={fileList.objImage}
                listType="picture-card"
                onPreview={handlePreview}
                disabled
              />
              <Modal
                visible={preview.previewVisible}
                title={preview.previewTitle}
                footer={null}
                onCancel={previewCancel}
              >
                <img alt="设备图片" style={{ width: '100%' }} src={preview.previewImage} />
              </Modal>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="BIM结构图">
              <Upload fileList={fileList.objBim} disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <label style={{ fontSize: 18, marginRight: 20 }}>设备信息</label>
          </Col>
          <Col span={8}>
            <Form.Item label="设计寿命" >
              {object.designLife?object.designLife+'年':null}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="大修年限">
              {object.repairLife?object.repairLife+'年':null}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="更换年限" >
              {object.replaceLife}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="建议维护周期" >
              {object.maintenanceCycle?object.maintenanceCycle+'年':null}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="制造商" >
              {object.manufact ? object.manufact.name : ''}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="一次变比参数">
              {object.transRatio1}
            </Form.Item>
          </Col> */}
          {/* <Col span={8}>
            <Form.Item label="二次变比参数">
              {object.transRatio2}
            </Form.Item>
          </Col> */}
          {/* <Col span={8}>
            <Form.Item label="遵循标准" >
            {object.standard}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="规程大修寿命" >
              {object.overhaulLife?object.overhaulLife+'年':null}
            </Form.Item>
          </Col><Col span={8}>
            <Form.Item label="规程使用寿命" >
              {object.serviceLife?object.serviceLife+'年':null}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="BIM结构图" >
              <Input disabled/>
            </Form.Item>
          </Col> */}
          <Col span={24}>
            <label style={{ fontSize: 18, marginRight: 20 }}>企业信息</label>
          </Col>
          <Col span={8}>
            <Form.Item label="重要程度">
              {object.importanceDesc}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="ABC分类">
              {object.classification}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="固定资产分类">
              {object.objectClsDesc}
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item label="电压等级" >
              {object.voltageLevelDesc}
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item label="设备大类" >
              {object.objectMainClsDesc}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}


export default (React.memo(ObjectDetilModal))
