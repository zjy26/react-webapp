import React, {useEffect,useState,useContext} from 'react'
import { Modal, Input, message, Form, Select, Row, Col, InputNumber, DatePicker } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import {overheadLine,classification,anchorSections,objecttemplates} from '../../../../../api/index'
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

const ObjectModal = props => {
  const [form] = Form.useForm()
  const user = props.user.toJS()
  const brands = props.brands.toJS()
  const { MyContext} = props
  const { code} = useContext(MyContext)
  const [objectClassTrees, setObjectClassTrees] = useState([])
  const [objecttemplateList, setObjecttemplateList] = useState([])
  const [anchorSectionList, setAnchorSectionList] = useState([])
  const { Option } = Select;
  const [template, setTemplate] = useState({
    cls:'',
    brand:'',
    modelNumber:'',
    spec:''
  })

  useEffect(()=>{
    classification({org: user.org,clsFun:'asset.classification',fun:'asset.classification',major:'06'})
    .then(res => {
      if(res){
        setObjectClassTrees(res)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[0])


  //关联模板
  const associatedTemplate = (open) => {

    if(open) {
      configObjectTemplate.associatedTemplate(
        {
          type: "01",
          cls: template.cls,
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
  const templateChange = (val) => {
    const item = objecttemplateList.find(item => item.id === val)
    form.setFieldsValue(item)
  }

  useEffect(()=>{
    form.resetFields()
    if(props.objId){
      overheadLine.overHeadLineObjectDetail(props.objId)
      .then(res => {
        if(res){
          form.setFieldsValue({
            ...res,
            commissDate:res.commissDate?moment(res.commissDate):null
          })
          setTemplate({
            ...template,
            cls:res.cls,
            brand:res.brand,
            modelNumber:res.modelNumber,
            spec:res.spec
          })
          let sysFilterSql = 'ot_cls= "'+res.cls+'" and ot_brand="'+ res.brand+'" and ot_modelNumber="'+res.modelNumber +'"'
          if(res.spec){
            sysFilterSql = sysFilterSql + ' and ot_spc = "'+ res.spec + '"'
          }
          objecttemplates({sysFilterSql:sysFilterSql})
          .then(res => {
            if(res){
              setObjecttemplateList(res.models)
            }
          })
          .catch(() => {
            console.log("列表数据加载失败")
          })
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    } else{
      setTemplate([])
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.objId,props.visible])

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

  const handleSubmit = async () => {
    try {
    form.validateFields()
    .then(values=>{
      const { ...data} = values
      const params = {...data,overheadLine:code, _method: 'PUT',
      commissDate: values.commissDate?moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf():values.commissDate
    }
      if(props.objId){
        overheadLine.overHeadLineObjectUpdate(props.objId,params)
        .then(res => {
          if(res){
            message.success("修改成功")
            props.setDirty((dirty)=>dirty+1)
            form.resetFields()
            props.handleCancel()
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      } else {
        overheadLine.overHeadLineObjectNew(params)
      .then(res => {
        if(res){
          message.success("新建成功")
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
          form.resetFields()
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
      }
    })
    } catch (errorInfo) {
      return
    }
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={props.modalTitle}
      okText="确认"
      cancelText="取消"
      width="800px"
      onOk={handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} form={form}>
        <Row gutter={24}>
        <Col span={12}>
            <Form.Item label="设备描述" name="descr" rules={[{required: true, message: '请输入设备描述'}]}>
              <Input placeholder="请输入设备描述" / >
            </Form.Item>
          </Col>
          {props.objId?
          <Col span={12}>
            <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
            <Select placeholder="设备分类" allowClear disabled
              onChange={
                (value) => {
                  setTemplate({
                    ...template,
                    cls:value
                  })

                }
              }
            >
                {
                  objectClassTrees && objectClassTrees.children && objectClassTrees.children.map(item=> (
                    <Select.OptGroup key={item.id} label={item.text}>
                      {
                        item.children.map(child=> (
                          <Select.Option key={child.model.code} value={child.model.code}>{child.model.desc} ({child.model.code})</Select.Option>
                        ))
                      }
                    </Select.OptGroup>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
            <Select placeholder="设备分类" allowClear
              onChange={
                (value) => {
                  form.setFieldsValue({template:null})
                  setTemplate({
                    ...template,
                    cls:value
                  })
                }
              }
            >
                {
                  objectClassTrees && objectClassTrees.children && objectClassTrees.children.map(item=> (
                    <Select.OptGroup key={item.id} label={item.text}>
                      {
                        item.children.map(child=> (
                          <Select.Option key={child.model.code} value={child.model.code}>{child.model.desc} ({child.model.code})</Select.Option>
                        ))
                      }
                    </Select.OptGroup>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>}
          {props.objId?
          <Col span={12}>
            <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择设备品牌'}]}>
              <Select placeholder="请选择设备品牌"  allowClear disabled
                onChange={
                  (value) => {
                    setTemplate({
                      ...template,
                      brand:value
                    })
                  }
                }
              >
                {brands && brands.map(item => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择设备品牌'}]}>
              <Select placeholder="请选择设备品牌"  allowClear
                onChange={
                  (value) => {
                    form.setFieldsValue({template:null})
                    setTemplate({
                      ...template,
                      brand:value
                    })
                  }
                }
              >
                {brands && brands.map(item => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>}
          {props.objId?
          <Col span={12}>
            <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
              <Input placeholder="请输入型号" disabled
                onChange={
                  (e) => {
                    setTemplate({
                      ...template,
                      modelNumber:e.target.value
                    })
                  }
                }
              / >
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
              <Input placeholder="请输入型号"
                onChange={
                  (e) => {
                    form.setFieldsValue({template:null})
                    setTemplate({
                      ...template,
                      modelNumber:e.target.value
                    })
                  }
                }
              / >
            </Form.Item>
          </Col>}
          {props.objId?
            <Col span={12}>
            <Form.Item label="规格" name="spec">
              <Input placeholder="请输入规格" disabled
              onChange={
                (e) => {
                  setTemplate({
                    ...template,
                    spec:e.target.value
                  })
                }
              }
              />
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="规格" name="spec">
              <Input placeholder="请输入规格"
              onChange={
                (e) => {
                  form.setFieldsValue({template:null})
                  setTemplate({
                    ...template,
                    spec:e.target.value
                  })
                }
              }
              />
            </Form.Item>
          </Col>}
          {props.objId?<Col span={12}>
            <Form.Item label="关联模板" name="template" rules={[{required: true, message: '请选择关联模板'}]}>
            <Select disabled
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
          <Col span={12}>
            <Form.Item label="长度(m)" name="length">
              <InputNumber placeholder="请输入长度"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备标识" name="objectMark">
              <Input placeholder="请输入设备标识"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="启用日期" name="commissDate">
              <DatePicker placeholder="请选择启用日期"/>
            </Form.Item>
          </Col>
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
          <Col span={12}>
            <Form.Item label="另一跟股道数" name="stationTrack">
              <Input placeholder="请输入另一跟股道数"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="形式" name="shape">
              <Input placeholder="请输入形式"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="单双线" name="singleDouleLine">
              <Select allowClear>
                <Option value="1">单线</Option>
                <Option value="2">双线</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="道岔号" name="turnout">
              <Input placeholder="请输入道岔号"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="股道数据" name="stationTrackData">
              <Input placeholder="请输入股道数据"/>
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

export default connect(mapStateToProps, null)(React.memo(ObjectModal))
