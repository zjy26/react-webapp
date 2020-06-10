import React, { useEffect,useState } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import { robotObject } from '../../../api'

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
const AddModal = (props) => {
  const [form] = Form.useForm()
  const [siteOption, setSiteOption] = useState([])

  useEffect(()=> {
    form.resetFields()
    if(props.visible === true) {
      robotObject.robotObjectNew()
      .then(res => {
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentId, props.visible, form.resetFields])

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      const {siteLine, ...data} = values
      const params = {...data, robotStatus: '01',org:'11'}
      robotObject.robotObjectAdd(params)
      .then((res)=>{
        props.setDirty((dirty)=>dirty+1)
        message.success("新建成功")
        props.handleCancel()
      })
      .catch(error => {
        message.error("新建失败")
      })
    })
    .catch (errorInfo=>{
      return
    })
  }

  return (
    <div>
      <Modal
        maskClosable={false}
        getContainer={false}
        title="新建"
        okText="确认"
        cancelText="取消"
        width="750px"
        visible={props.visible}
        onOk={handleSubmit}
        onCancel={props.handleCancel}
        locationTree={props.locationTree}
        entity={props.entity}
      >
        <Form {...formItemLayout} form={form} name="addFrom">
          <Row gutter={24}>
            <Col span={24}><h3>基本信息</h3></Col>
            <Col span={12}>
              <Form.Item label="设备名称" name="name" rules={[{required: true, message: '请输入设备名称'}]}>
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item name="siteLine" label="线路" rules={[{required: true, message: '请选择线路'}]}>
                <Select placeholder="请选择线路"
                  onChange={
                    (value) => {
                      props.locationTree.lineSite && props.locationTree.lineSite.forEach(item=>{
                        if(item.value === value) {
                          setSiteOption(item.children)
                          form.setFieldsValue({site:null})
                        }
                      })
                    }
                  }
                >
                  {props.locationTree.line && props.locationTree.line.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="site" label="站点" rules={[{required: true, message: '请选择站点'}]}>
                <Select placeholder="请选择站点" allowClear>
                {
                  siteOption.length>0 && siteOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))
                }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="物理位置" name="robotPatrolLoc" rules={[{required: true, message: '请选择物理位置'}]}>
              <Select placeholder="请选择物理位置">
                {props.entity.robotPatrolLocs && props.entity.robotPatrolLocs.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.desc}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型" name="type" rules={[{required: true, message: '请选择类型'}]}>
                <Select placeholder="请选择类型" allowClear>
                  {props.entity.robotObjectType && props.entity.robotObjectType.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
                <Select placeholder="请选择品牌" allowClear>
                  {props.entity.brands && props.entity.brands.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商" name="supplier">
                <Select placeholder="请选择供应商" allowClear>
                    {props.entity.suppliers && props.entity.suppliers.length>0  && props.entity.suppliers.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商" name="manufacturer">
                <Select placeholder="请选择制造商" allowClear>
                  {props.entity.suppliers && props.entity.suppliers.length>0  && props.entity.suppliers.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号" name="modelNumber">
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备描述" name="desc">
                <Input.TextArea placeholder="请输入设备描述" />
              </Form.Item>
            </Col>

            <Col span={24}><h3>参数信息</h3></Col>
            <Col span={12}>
              <Form.Item label="体积(宽*深*高)">
                <Form.Item name="volume" noStyle>
                  <InputNumber style={{ width: 'auto'}} placeholder="请输入尺寸" />
                </Form.Item>
              <span className="ant-form-text"> mm</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总重(kg)" name="weight">
                <InputNumber placeholder="请输入总重"/>
              </Form.Item>
            </Col>

            <Col span={24}><h3>属性信息</h3></Col>
            <Col span={12}>
              <Form.Item label="属性描述" name="propertyName">
                <Select placeholder="请选择属性描述" allowClear>
                  {props.entity.properties && props.entity.properties.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.desc}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行时长(小时)" name="runningTime">
                <InputNumber placeholder="请输入总运行时长"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行里程(千米)" name="runningMileage">
                <InputNumber placeholder="请输入总运行里程"/>
              </Form.Item>
            </Col>

            <Col span={24}><h3>固定信息</h3></Col>
            <Col span={12}>
              <Form.Item label="通信标识" name="communication" rules={[{required: true, message: '请输入通信标识'}]}>
                <Input placeholder="请输入通信标识" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="视频流程协议" name="videoStream" rules={[{required: true, message: '请选择视频流程协议'}]}>
                <Select placeholder="请选择视频流程协议" allowClear>
                  {props.entity.videoStream && props.entity.videoStream.length>0 && props.entity.videoStream.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default React.memo((AddModal))
