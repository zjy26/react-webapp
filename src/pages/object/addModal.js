import React from 'react'
import { Modal, Form, Input, Select, Row, Col, message } from 'antd'
import { robotObject } from '../../api'
import store from '../../store'

const { Option } = Select
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
  const { getFieldDecorator } = props.form;

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const {siteLine, ...data} = values
        const params = {...data, robotStatus: '01'}
        robotObject.robotObjectAdd(params)
        .then((res)=>{
          props.setDirty((dirty)=>dirty+1)
          message.success("新建成功")
          props.handleCancel()
        })
        .catch(error => {
          message.error("新建失败")
        })
      }
    });
  };

  return (
    <div>
      <Modal
        title="新建"
        okText="确认"
        cancelText="取消"
        width="750px"
        visible={props.visible}
        onOk={handleSubmit}
        onCancel={props.handleCancel}
      >
        <Form {...formItemLayout} >
          <Row gutter={24}>
            <Col span={24}><h3>基本信息</h3></Col>
            <Col span={12}>
              <Form.Item label="设备名称">
                {getFieldDecorator("name", {
                  rules: [{required: true}],
                })(<Input placeholder="请输入设备名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="线路">
                {getFieldDecorator("siteLine", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择线路">
                    {store.getState().locationTree.line && store.getState().locationTree.line.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点">
                {getFieldDecorator("site", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择站点">
                    {store.getState().locationTree.site && store.getState().locationTree.site.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="物理位置">
                {getFieldDecorator("robotPatrolLoc", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择物理位置" >
                    <Option value="1">35kv开关柜</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类型">
                {getFieldDecorator("type", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择类型">
                    {store.getState().robotObjectType && store.getState().robotObjectType.map(item => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌">
                {getFieldDecorator("brand", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择品牌">
                    {store.getState().brands && store.getState().brands.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商">
                {getFieldDecorator("supplier", {
                })(
                  <Input placeholder="请输入供应商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商">
                {getFieldDecorator("manufacturer", {
                })(
                  <Input placeholder="请输入制造商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号">
                {getFieldDecorator("modelNumber", {
                })(
                  <Input placeholder="请输入型号" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备描述">
                {getFieldDecorator("desc", {
                })(
                  <Input.TextArea placeholder="请输入设备描述" />
                )}
              </Form.Item>
            </Col>

            <Col span={24}><h3>参数信息</h3></Col>
            <Col span={12}>
              <Form.Item label="体积(宽*深*高)">
                {getFieldDecorator("volume", {
                })(
                  <Input placeholder="请输入尺寸" style={{width:"85%"}}/>
                )}mm
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总重">
                {getFieldDecorator("weight", {
                })(
                  <Input placeholder="请输入总重" style={{width:"85%"}}/>
                )}kg
              </Form.Item>
            </Col>

            <Col span={24}><h3>属性信息</h3></Col>
            <Col span={12}>
              <Form.Item label="属性描述">
                {getFieldDecorator("propertyName", {
                })(
                  <Input placeholder="请输入属性描述" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行时长">
                {getFieldDecorator("runningTime", {
                })(
                  <Input placeholder="请输入总运行时长" style={{width:"85%"}}/>
                )}小时
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行里程">
                {getFieldDecorator("runningMileage", {
                })(
                  <Input placeholder="请输入总运行里程" style={{width:"85%"}}/>
                )}千米
              </Form.Item>
            </Col>

            <Col span={24}><h3>固定信息</h3></Col>
            <Col span={12}>
              <Form.Item label="通信标识">
                {getFieldDecorator("communication", {
                  rules: [{required: true}],
                })(
                  <Input placeholder="请输入通信标识" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="视频流程协议">
                {getFieldDecorator("videoStream", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择视频流程协议">
                    {store.getState().videoStream && store.getState().videoStream.map(item => (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
export default Form.create()(AddModal);
