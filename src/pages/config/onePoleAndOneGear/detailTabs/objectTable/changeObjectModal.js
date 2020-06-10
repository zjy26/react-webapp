import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, message, InputNumber, DatePicker } from 'antd'
import { anchorSections, overheadLine } from '../../../../../api'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  }
}

const ChangeObjectModal = props => {
  const {visible, handleCancel, setDirty, MyContext} = props
  const [objData, setObjData] = useState([])
  const {brandOption,peopleOption,typeOption,code} = useContext(MyContext)
  const [objecttemplateList, setObjecttemplateList] = useState([])
  const [form] = Form.useForm()
  const [unitTemplateList, setUnitTemplateList] = useState([])
  const [anchorSectionList, setAnchorSectionList] = useState([])
  const [type, setType] = useState('01')
  const [unitSn, setUnitSn] = useState(null)

  const [templateCode, setTemplateCode] = useState('01')
  const [unitTemplate, setUnitTemplate] = useState({
    id:null,
    objectId:null
  })
  const [objectCode, setObjectCode] = useState('01')

  const [template, setTemplate] = useState({
    cls:'',
    brand:'',
    modelNumber:''
  })
  const [templateCls, setTemplateCls] = useState('')

  useEffect(()=>{
    anchorSections({line:props.line})
    .then(res => {
      if(res){
        setAnchorSectionList(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  },[props.line])

  useEffect(() => {
    if(visible) {
      form.resetFields()
      setType("01")
      form.setFieldsValue({type:'01'})
      overheadLine.overheadLineObjectList({code:code})
      .then(res => {
        if(res.models){
          if(objData !== res.models)
          setObjData(res.models)
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    form.validateFields()
    .then(values=>{
      let {oldbrand,oldmodelNumber,clsName, ...data} = values
      if(data.type === "01"){
        let params = {
          ...data,
          replaceTime: values.replaceTime?moment(new Date(values.replaceTime), 'YYYY-MM-DD HH:mm:ss').valueOf():values.replaceTime
        }
        overheadLine.objectChangeAdd(params)
        .then(res => {
          if(res.success){
            message.success("新建成功")
            setDirty(dirty => dirty+1)
            handleCancel()
          }
        })
      }else if(data.type === "02"){
        let params = {
          ...data,
          unitTemplateId:unitTemplate.id,
          objectId:unitTemplate.objectId,
          unitSn:unitSn?unitSn:null,
          replaceTime: values.replaceTime?moment(new Date(values.replaceTime), 'YYYY-MM-DD HH:mm:ss').valueOf():values.replaceTime,
        }
        overheadLine.objectChangeAdd(params)
        .then(res => {
          if(res.success){
            message.success("新建成功")
            setDirty(dirty => dirty+1)
            handleCancel()
          }
        })
      }
    })
    .catch(err=> {
      if(!err.values.name) {
      }
    })
  }

  //关联模板
  const associatedTemplate = (open) => {

    if(open) {
      if(type ==="01"){
        configObjectTemplate.associatedTemplate(
          {
            type: "01",
            cls: templateCls,
            brand: template.brand,
            modelNumber: template.modelNumber,
            spec: template.spec
          }
        )
        .then(res => {
          if(res && res.models) {
            setObjecttemplateList(res.models)
          }
        })
      } else if(type ==="02"){
        configObjectTemplate.associatedTemplate(
          {
            type: "02",
            cls: templateCls,
            brand: template.brand,
            modelNumber: template.modelNumber,
            spec: template.spec
          }
        )
        .then(res => {
          if(res && res.models) {
            setObjecttemplateList(res.models)
          }
        })
      }
    }
  }
  const templateChange = (val) => {
    const item = objecttemplateList.find(item => item.id === val)
    form.setFieldsValue(item)
  }

  //关联部件
  const associatedUnitTemplate = (open) => {

    if(open) {
      overheadLine.unitTemplateList({id:objectCode,template:templateCode})
      .then(res => {
        if(res.objectUnitList){
          setUnitTemplateList(res.objectUnitList)
        }
      })
    }
  }


  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        getContainer={false}
        title="新建"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} {...formItemLayout}>
          <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="更换类型" name="type" rules={[{required: true, message: '请选择更换类型'}]}>
              <Select
                placeholder="请选择更换类型"
                onChange={val=>{
                  if(type !== val)
                  setType(val)
                  form.resetFields()
                  form.setFieldsValue({type:val})
                }}
              >
                {
                  typeOption && typeOption.length>0 && typeOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
            </Col>
            {
                type === "01" ?
                  <Col span={24}><h3>设备信息</h3></Col> :
                  <Col span={24}><h3>部件信息</h3></Col>
            }
            <Col span={12}>
              <Form.Item label="设备描述" name="overheadLineObject" rules={[{required: true, message: '请选择设备'}]}>
              <Select placeholder="请选择设备"
              onChange={
                (value) => {
                  const objects = objData.find(obj => obj.id === value)
                  if(type === "01"){
                    form.setFieldsValue({
                      oldbrand:objects.brdName,
                      oldmodelNumber:objects.modelNumber,
                      clsName:objects.clsName
                    })
                    if(templateCls !== objects.cls){
                      setTemplateCls(objects.cls)
                    }

                  } else if(type==="02"){
                    if(templateCode !== objects.template){
                      setTemplateCode(objects.template)
                    }

                    setObjectCode(value)
                  }
                }
              }
              >
                {
                  objData && objData.length>0 && objData.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.descr}</Select.Option>
                  ))
                }
              </Select>
              </Form.Item>
            </Col>
            {
                type === "02" ?
            <Col span={12} >
              <Form.Item label="部件描述" rules={[{required: true, message: '请选择部件'}]}>
            <Select
              onDropdownVisibleChange = {open => associatedUnitTemplate(open)}
              onChange={
                (value) => {
                  const object = unitTemplateList.find(obj => obj.template === value)
                  form.setFieldsValue({
                    oldbrand:object.brand,
                    oldmodelNumber:object.modelNumber,
                    clsName:object.firstLevelCls
                  })
                  setUnitSn(object.unitSn)
                  setTemplateCls(object.cls)
                  setUnitTemplate({
                    ...unitTemplate,
                    id:object.unitTemplateId,
                    objectId:object.id
                  })
                }
              }
            >
              {
                unitTemplateList && unitTemplateList.length>0 && unitTemplateList.map(item => (
                  <Select.Option key={item.template} value={item.template}>{item.desc}</Select.Option>
                ))
              }
            </Select>
            </Form.Item>
            </Col>:null
            }
            {type ==="02"?
            <Col span={12}>
              <Form.Item label="部件分类" name="clsName">
                <Input disabled />
              </Form.Item>
            </Col>:
            <Col span={12}>
            <Form.Item label="设备分类" name="clsName">
              <Input disabled />
            </Form.Item>
            </Col>}
            {type==='02'?<Col span={12}>
              <Form.Item label="原部件品牌" name="oldbrand">
              <Input disabled />
              </Form.Item>
            </Col>:
            <Col span={12}>
              <Form.Item label="原设备品牌" name="oldbrand">
              <Input disabled />
              </Form.Item>
            </Col>}
            {type==='02'?
            <Col span={12}>
              <Form.Item label="原部件型号" name="oldmodelNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            :<Col span={12}>
            <Form.Item label="原设备型号" name="oldmodelNumber">
              <Input disabled />
            </Form.Item>
          </Col>}
          {
                type === "01" ?
                  <Col span={24}><h3>新设备信息</h3></Col> :
                  <Col span={24}><h3>新部件信息</h3></Col>
          }
          {type==="01"?
          <Col span={12}>
            <Form.Item label="新设备品牌" name="brand" rules={[{required: true, message: '请选择新设备品牌'}]}>
              <Select placeholder="请选择新设备品牌"
                onChange={
                  (value) => {
                    setTemplate({
                      ...template,
                      brand:value
                    })
                  }
                }
              >
                {
                  brandOption && brandOption.length>0 && brandOption.map(item => (
                    <Select.Option key={item.id} value={item.code} code={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>:
          <Col span={12}>
          <Form.Item label="新部件品牌" name="brand" rules={[{required: true, message: '请选择新部件品牌'}]}>
            <Select placeholder="请选择新部件品牌"
              onChange={
                (value) => {
                  setTemplate({
                    ...template,
                    brand:value
                  })
                }
              }
            >
              {
                brandOption && brandOption.length>0 && brandOption.map(item => (
                  <Select.Option key={item.id} value={item.code} code={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>}
        {type==="01"?
          <Col span={12}>
            <Form.Item label="新设备型号" name="modelNumber" rules={[{required: true, message: '请输入新设备型号'}]}>
              <Input placeholder="请输入新设备型号"
                onChange={
                  (e) => {
                    setTemplate({
                      ...template,
                      modelNumber:e.target.value
                    })
                  }
                }
              />
            </Form.Item>
          </Col>:
          <Col span={12}>
            <Form.Item label="新部件型号" name="modelNumber" rules={[{required: true, message: '请输入新部件型号'}]}>
              <Input placeholder="请输入新部件型号"
                onChange={
                  (e) => {
                    setTemplate({
                      ...template,
                      modelNumber:e.target.value
                    })
                  }
                }
              />
            </Form.Item>
          </Col>}
          {type==="01"?
          <Col span={12}>
            <Form.Item label="关联模板" name="template" rules={[{required: true, message: '请选择关联模板'}]}>
            <Select
              onDropdownVisibleChange = {open => associatedTemplate(open)}
              onChange = {val => templateChange(val)}
            >
              {
                objecttemplateList && objecttemplateList.length>0 && objecttemplateList.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="关联模板" name="template" rules={[{required: true, message: '请选择关联模板'}]}>
            <Select
              onDropdownVisibleChange = {open => associatedTemplate(open)}
              onChange = {val => templateChange(val)}
            >
              {
                objecttemplateList && objecttemplateList.length>0 && objecttemplateList.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
            </Form.Item>
          </Col>}
          {type==="01"?<Col span={12}>
            <Form.Item label="长度(m)" name="length">
              <InputNumber placeholder="请输入长度"/>
            </Form.Item>
          </Col>:null}
          {type==="01"?
          <Col span={12}>
          <Form.Item label="设备标识" name="objectMark">
            <Input placeholder="请输入设备标识"/>
          </Form.Item>
          </Col>
          :null}
          {type==="01"?
          <Col span={12}>
          <Form.Item label="另一根锚段号" name="anchorSection">
            <Select placeholder="请选择锚段号">
                {
                  anchorSectionList && anchorSectionList.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.descr}
                    </Select.Option>
                  ))
                }
            </Select>
          </Form.Item>
        </Col>
          :null}
          {type==="01"?
          <Col span={12}>
          <Form.Item label="另一跟股道数" name="stationTrack">
            <Input placeholder="请输入另一跟股道数"/>
          </Form.Item>
        </Col>
          :null}
        {type==="01"?
          <Col span={12}>
            <Form.Item label="形式" name="shape">
              <Input placeholder="请输入形式"/>
            </Form.Item>
          </Col>
        :null}
        {type==="01"?
          <Col span={12}>
          <Form.Item label="单双线" name="singleDouleLine">
            <Select allowClear>
              <Select.Option value="1">单线</Select.Option>
              <Select.Option value="2">双线</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        :null}
        {type==="01"?
          <Col span={12}>
          <Form.Item label="道岔号" name="turnout">
            <Input placeholder="请输入道岔号"/>
          </Form.Item>
        </Col>
        :null}
        {type==="01"?
          <Col span={12}>
          <Form.Item label="股道数据" name="stationTrackData">
            <Input placeholder="请输入股道数据"/>
          </Form.Item>
        </Col>
        :null}
        <Col span={24}><h3>新设备信息</h3></Col>
            <Col span={12}>
              <Form.Item label="负责人" name="principal" rules={[{required: true, message: '请选择负责人'}]}>
              <Select placeholder="请选择负责人" showSearch allowClear
                >
                  {
                    peopleOption && peopleOption.length>0 && peopleOption.map(item => (
                      <Select.Option key={item.id} value={item.id} code={item.code}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换日期" name="replaceTime" rules={[{required: true, message: '请选择日期'}]}>
                <DatePicker placeholder="请选择日期"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="更换原因" name="reason">
                <Input.TextArea maxLength={200} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(ChangeObjectModal)
