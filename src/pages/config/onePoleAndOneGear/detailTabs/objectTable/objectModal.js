import React, {useEffect,useState,useContext} from 'react'
import { Modal, Input, message, Form, Select, Row, Col, InputNumber, DatePicker, TreeSelect } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import {overheadLine,anchorSections,brands,echoBrand} from '../../../../../api/index'
import debounce from 'lodash/debounce'
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
  const { MyContext,renderChildData } = props
  const [associated, setAssociated] = useState([])
  const { code,classOption,brandOption} = useContext(MyContext)
  const [brandData, setBrandData] = useState(brandOption)

  const [anchorSectionList, setAnchorSectionList] = useState([])
  const { Option } = Select;
  const [okLoading, setOkLoading] = useState(false)

  //关联模板搜索时请求
  const associatedTemplate = debounce((key) => {
    configObjectTemplate.associatedTemplate(
      {
        type: "01",
        cls: form.getFieldValue("cls"),
        clsMajor:'07',
        brand: form.getFieldValue("brand"),
        modelNumber: form.getFieldValue("modelNumber"),
        limit: 30,
        name:key
      }
    )
      .then(res => {
        setAssociated(res.models)
      })
    }, 500)

  const templateChange = (val) => {
    const item = associated.find(item => item.code === val)
    if(item){
      //品牌字段回显
      if(item.brand) {
        echoBrand({value: item.brand})
          .then( res => {
            if(res) {
              const item = brandData.find(obj => obj.code === res.code)
              if(!item) {
                setBrandData([...brandData, res])
              }
            }
          })
      }
      form.setFieldsValue({spec:item.spec,modelNumber:item.modelNumber,cls:item.cls,brand:item.brand})
    }

  }

  useEffect(()=>{
    form.resetFields()
    setOkLoading(false)
    associatedTemplate()
    if(props.objId){
      overheadLine.overHeadLineObjectDetail(props.objId)
      .then(res => {
        if(res){
          //品牌字段回显
          if(res.brand) {
            echoBrand({value: res.brand})
              .then( res => {
                if(res) {
                  const item = brandData.find(obj => obj.code === res.code)
                  if(!item) {
                    setBrandData([...brandData, res])
                  }
                }
              })
          }
          form.setFieldsValue({
            ...res,
            commissDate:res.commissDate?moment(res.commissDate):null
          })
        }
      })
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
      const params = {
        ...data,
        overheadLine:code,
         _method: 'PUT',
        commissDate: values.commissDate?moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf():values.commissDate,
        template:values.template?values.template:null
      }
      setOkLoading(true)
      if(props.objId){
        overheadLine.overHeadLineObjectUpdate(props.objId,params)
        .then(res => {
          if(res){
            message.success("修改成功")
            props.setDirty((dirty)=>dirty+1)
            renderChildData(true,res.id,res.template)
            form.resetFields()
            props.handleCancel()
          }
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
      }
    })
    } catch (errorInfo) {
      return
    }
  }

  //品牌搜索时请求
  const handleSearch = debounce((key) => {
    brands({
      limit: 30,
      filter: JSON.stringify([{ property: 'name', value: key }])
    })
      .then(res => {
        setBrandData(res.models)
      })
  }, 500)

      //渲染设备分类
  const renderCls = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc} disabled>{renderCls(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>

    })
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
      okButtonProps={{ loading: okLoading }}
    >
      <Form {...formItemLayout} name="objectForm" form={form}>
        <Row gutter={24}>
        <Col span={12}>
            <Form.Item label="设备描述" name="descr" rules={[{required: true, message: '请输入设备描述'}]}>
              <Input placeholder="请输入设备描述" / >
            </Form.Item>
          </Col>
          {props.objId?
          <Col span={12}>
            <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
            <TreeSelect
              showSearch
              allowClear
              placeholder="请选择设备分类"
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={
                val => {
                  associatedTemplate()
                  form.setFieldsValue({template:null})
                }
              }
            >
              {renderCls(classOption)}
            </TreeSelect>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
            <TreeSelect
              allowClear
              showSearch
              placeholder="请选择设备分类"
              treeDefaultExpandAll
              treeNodeFilterProp="title"
              onChange={
                val => {
                  associatedTemplate()
                  form.setFieldsValue({template:null})

                }
              }
            >
              {renderCls(classOption)}
            </TreeSelect>
            </Form.Item>
          </Col>}
          {props.objId?
          <Col span={12}>
            <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择设备品牌'}]}>
              <Select
              placeholder="请选择设备品牌"
              allowClear
              showSearch
              filterOption={false}
              onSearch={handleSearch}
                onChange={
                  (value) => {
                    associatedTemplate()
                    form.setFieldsValue({template:null})
                  }
                }
              >
                {brandData && brandData.map(item => (
                  <Select.Option key={item.code} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择设备品牌'}]}>
              <Select
                placeholder="请选择品牌"
                showSearch
                allowClear
                filterOption={false}
                onSearch={handleSearch}
                onChange={
                  (value) => {
                    associatedTemplate()
                    form.setFieldsValue({template:null})
                  }
                }
              >
                {brandData && brandData.map(item => (
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
              <Input placeholder="请输入型号"
                onChange={
                  (e) => {
                    associatedTemplate()
                    form.setFieldsValue({template:null})
                  }
                }
              / >
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
              <Input placeholder="请输入型号"
                onChange={
                  (e) => {
                    associatedTemplate()
                    form.setFieldsValue({template:null})
                  }
                }
              / >
            </Form.Item>
          </Col>}
          {props.objId?
            <Col span={12}>
            <Form.Item label="规格" name="spec">
              <Input placeholder="请输入规格" />
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="规格" name="spec">
              <Input placeholder="请输入规格"/>
            </Form.Item>
          </Col>}
          {props.objId?<Col span={12}>
            <Form.Item label="关联模板" name="template">
            <Select
              allowClear
              placeholder="请选择关联模板"
              showSearch
              filterOption={false}
              onSearch={associatedTemplate}
              onChange={ val => templateChange(val) }
            >
              {
                associated && associated.length>0 && associated.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
            </Form.Item>
          </Col>:<Col span={12}>
            <Form.Item label="关联模板" name="template">
            <Select
              allowClear
              placeholder="请选择关联模板"
              showSearch
              filterOption={false}
              onSearch={associatedTemplate}
              onChange={ val => templateChange(val) }
            >
              {
                associated && associated.length>0 && associated.map(item => (
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
            <Form.Item label="另一根股道数" name="stationTrack">
              <Input placeholder="请输入另一根股道数"/>
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
          <Col span={12}>
            <Form.Item label="E码/订货编号" name="ecode">
              <Input placeholder="请输入E码/订货编号"/>
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
    user: state.getIn(['common', 'user'])
  }
}

export default connect(mapStateToProps, null)(React.memo(ObjectModal))
