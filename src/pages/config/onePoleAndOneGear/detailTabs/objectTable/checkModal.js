import React, { useState, useEffect,useContext } from 'react'
import { Modal, Form, Row,Select,Input, Col,message, DatePicker} from 'antd'
import { overheadLine,classification } from '../../../../../api'
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

const CheckModal = props => {
  const {modalProperty, visible, handleCancel, activeKey} = props
  const [form] = Form.useForm()
  const { MyContext} = props
  const { brandOption,suppliersOption} = useContext(MyContext)
  const [unitClassOption, setUnitClassOption] = useState([])
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    classification({
      org: '11',
      fun: 'asset.unit',
      clsFun: 'asset.unitClass'
    })
    .then(res=> {
      setUnitClassOption(res.children)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    //部件分类
    const clsArr = []
    unitClassOption.map(item => {
      clsArr.push(item.model)
      return clsArr
    })

  useEffect(() => {
    if(visible) {
      if(modalProperty.edit === false && modalProperty.type==="static" && modalProperty.detil === true){
        configObjectTemplate.unitTemplateDetail(modalProperty.id)
        .then(res=> {
          const detail = res.detail
          const item = clsArr.find(obj => obj.code === detail.cls)
          setInitValues({
            ...detail,
            cls: detail.cls ? item.desc : null,
            brand: detail.brand&&detail.brand.name ? detail.brand.name : null,
            manufact: detail.manufact&&detail.manufact.name ? detail.manufact.name : null,
            enable: detail.enable === true ? "启用" : "未启用",
            criticality: detail.criticality === true ? "是" : "否",
            commissDate: modalProperty.commissDate?moment(modalProperty.commissDate):null
          })
        })
    }else if(modalProperty.edit === false && modalProperty.type==="dynamic" && modalProperty.detil === true){
      overheadLine.objectUnitDetail(modalProperty.id)
        .then(res=> {
          if(res){
          const supplier =  suppliersOption.find(obj => obj.code = res.manufact)
          setInitValues({
            ...res,
            brand: res.brand&&res.brand.name ? res.brand.name : null,
            manufact: supplier? supplier.name : null,
            enable: res.enable === true ? "启用" : "未启用",
            criticality: res.criticality === true ? "是" : "否",
            commissDate:res.commissDate?moment(res.commissDate):null
          })
          form.setFieldsValue({
            ...res,
            brand: res.brand&&res.brand.name ? res.brand.name : null,
            manufact: res.manufact&&res.manufact.name ? res.manufact.name : null,
            enable: res.enable === true ? "启用" : "未启用",
            criticality: res.criticality === true ? "是" : "否",
            commissDate:res.commissDate?moment(res.commissDate):null
          })
          }
        })
    }
      else if(modalProperty.edit === true){
          form.setFieldsValue({
            cls:modalProperty.cls,
            brand: modalProperty.brand,
            modelNumber: modalProperty.modelNumber,
            spec:modalProperty.spec,
            commissDate:modalProperty.commissDate?moment(modalProperty.commissDate):null
          })
          setInitValues({
            cls:modalProperty.cls,
            brand: modalProperty.brand,
            modelNumber: modalProperty.modelNumber,
            spec:modalProperty.spec,
            commissDate:modalProperty.commissDate?moment(modalProperty.commissDate):null
          })


      }else{
        overheadLine.objectUnitDetail(modalProperty.id)
        .then(res=> {
          setInitValues({
            ...res,
            brand: res.brand&&res.brand.name ? res.brand.name : null,
            manufact: res.manufact&&res.manufact.name ? res.manufact.name : null,
            enable: res.enable === true ? "启用" : "未启用",
            criticality: res.criticality === true ? "是" : "否",
            commissDate:res.commissDate?moment(res.commissDate):null
          })
          form.setFieldsValue({
            ...res,
            brand: res.brand&&res.brand.name ? res.brand.name : null,
            manufact: res.manufact&&res.manufact.name ? res.manufact.name : null,
            enable: res.enable === true ? "启用" : "未启用",
            criticality: res.criticality === true ? "是" : "否",
            commissDate:res.commissDate?moment(res.commissDate):null
          })
        })
      }

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, activeKey])

  const handleOk = () => {
    form.validateFields()
    .then(values=>{
    if(modalProperty.edit === false){
      const params = {
        _method: 'PUT',
        commissDate: values.commissDate?moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf():values.commissDate
      }
      overheadLine.objectUnitUpdate(modalProperty.id,params)
      .then(res => {
        if(res){
          message.success("修改成功")
          form.resetFields()
          props.setDirty((dirty)=>dirty+1)
          handleCancel()
        }
      })
    } else{
      const params = {
        _method: 'PUT',
        commissDate: values.commissDate?moment(new Date(values.commissDate), 'YYYY-MM-DD HH:mm:ss').valueOf():values.commissDate,
        objectId:modalProperty.objectId,
        d9OverheadLineObjectId:modalProperty.mainId,
        static:true
      }
      overheadLine.objectUnitUpdate(modalProperty.id,params)
      .then(res => {
        if(res){
          message.success("修改成功")
          form.resetFields()
          props.setDirty((dirty)=>dirty+1)
          handleCancel()
        }
      })
    }
  }
  )

  }
  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        getContainer={false}
        title={modalProperty.title}
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
          <Form form={form} {...formItemLayout} initialValues={initValues}>
          {modalProperty.detil?
            <Row gutter={24}>
          <Col span={24}><h3 style={{marginLeft:'3%'}}>基础信息</h3></Col>
          <Col span={12}>
            <Form.Item label="部件分类">{initValues.cls}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="品牌">{initValues.brand}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="型号">{initValues.modelNumber}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格">{initValues.spec}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="	元器件编号">{initValues.componentNumber}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述">{initValues.descr}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="状态">{initValues.enable}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="启用日期">{initValues.commissDate?moment(initValues.commissDate).format('YYYY-MM-DD'):null}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注">{initValues.remarks}</Form.Item>
          </Col>

          <Col span={24}><h3 style={{marginLeft:'3%'}}>部件信息</h3></Col>
          <Col span={12}>
            <Form.Item label="设计寿命">{initValues.designLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="大修年限">{initValues.repairLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="更换年限">{initValues.replaceLife}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="关键部件">{initValues.criticality}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造商">{initValues.manufact}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="一次变比参数">{initValues.transRatio1}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="二次变比参数">{initValues.transRatio2}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制E码/订货编号">{initValues.ecode}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备图片">

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="BIM结构图">

            </Form.Item>
          </Col>
        </Row>
            :<Row gutter={24}>
              { <Col span={24}><h3 style={{marginLeft:'3%'}}>基础信息</h3></Col> }
              <Col span={12}>
                {modalProperty.edit ===false?
                <Form.Item label="部件分类" name="firstLevelCls">
                  <Select placeholder="请选择设备分类" disabled>
                    {
                      unitClassOption && unitClassOption.length>0 && unitClassOption.map(item=> (
                        <Select.Option
                          key={item.id}
                          value={item.model.code}
                          type={item.model.type}
                          major={item.model.major}
                          org={item.model.org}
                        >
                          {item.text}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>:<Form.Item label="部件分类" name="cls">
                  <Select placeholder="请选择设备分类" disabled>
                    {
                      unitClassOption && unitClassOption.length>0 && unitClassOption.map(item=> (
                        <Select.Option
                          key={item.id}
                          value={item.model.code}
                          type={item.model.type}
                          major={item.model.major}
                          org={item.model.org}
                        >
                          {item.text}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>}
              </Col>
              <Col span={12}>
                <Form.Item label="品牌" name="brand">
                  <Select placeholder="请选择品牌" disabled>
                    {
                      brandOption && brandOption.length>0 && brandOption.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="型号" name="modelNumber">
                  <Input placeholder="请输入型号" disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="规格" name="spec">
                  <Input placeholder="请输入规格" disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="启用日期" name="commissDate" rules={[{required: true, message: '请选择启用日期'}]}>
                  <DatePicker placeholder="请选择启用日期"/>
                </Form.Item>
              </Col>

              {/* <Col span={24}><h3 style={{marginLeft:'3%'}}>设备信息</h3></Col>
              <Col span={12}>
                <Form.Item label="设计寿命" name="designLife">
                  <Input placeholder="请输入设计寿命" disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="大修年限" name="repairLife">
                  <Input placeholder="请输入大修年限" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="更换年限" name="replaceLife">
                  <Input placeholder="请输入更换年限"  disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="关键部件" name="criticality">
                  <Radio.Group disabled>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制造商" name="manufact">
                  <Select placeholder="请选择制造商" allowClear disabled>
                    {
                      suppliersOption && suppliersOption.length>0 && suppliersOption.map(item => (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="一次变比参数" name="transRatio1">
                  <Input placeholder="请输入一次变比参数"  disabled/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="二次变比参数" name="transRatio2">
                  <Input placeholder="请输入二次变比参数" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="制E码/订货编号" name="ecode">
                  <Input placeholder="请输入E码/订货编号" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备图片">

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="BIM结构图">

                </Form.Item>
              </Col> */}
            </Row>}
          </Form>
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(CheckModal)
