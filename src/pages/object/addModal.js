import React from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const AddModal = (props) => {
  const { getFieldDecorator, resetFields } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.handleOk(values);
        resetFields();
      }
    });
  };
  const handleCancel = e => {
    resetFields();
    props.handleCancel();
  }

  return (
    <div>
      <Modal
        title="新建"
        okText="确认"
        cancelText="取消"
        width= "750px"
        visible={props.visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Form {...formItemLayout} >
          <Row gutter={24}>
            <Col span={24}><h3>基本信息</h3></Col>
            <Col span={12}>
              <Form.Item label="设备名称">
                {getFieldDecorator("objName", {
                  rules: [{required: true}],
                })(<Input placeholder="请输入设备名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="线路">
                {getFieldDecorator("line", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择线路" >
                    <Option value="1117">17号线</Option>
                    <Option value="1111">11号线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="站点">
                {getFieldDecorator("site", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择站点" >
                    <Option value="1">诸光路</Option>
                    <Option value="2">控制中心</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="物理位置">
                {getFieldDecorator("location", {
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
                  <Select placeholder="请选择类型" >
                    <Option value="1">机器人</Option>
                    <Option value="2">摄像机(可识别)</Option>
                    <Option value="3">摄像机(不可识别)</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="品牌">
                {getFieldDecorator("brand", {
                  rules: [{required: true}],
                })(
                  <Select placeholder="请选择品牌" >
                    <Option value="1">西门子</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商">
                {getFieldDecorator("supplier")(
                  <Input placeholder="请输入供应商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="制造商">
                {getFieldDecorator("manufacturers")(
                  <Input placeholder="请输入制造商" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="型号">
                {getFieldDecorator("model")(
                  <Input placeholder="请输入型号" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备描述">
                {getFieldDecorator("objDescr")(
                  <Input.TextArea placeholder="请输入设备描述" />
                )}
              </Form.Item>
            </Col>

            <Col span={24}><h3>参数信息</h3></Col>
            <Col span={12}>
              <Form.Item label="体积(宽*深*高)">
                {getFieldDecorator("volume")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入尺寸" /></Col>
                    <Col span={4}>mm</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总重">
                {getFieldDecorator("weight")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总重" /></Col>
                    <Col span={4}>kg</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>

            <Col span={24}><h3>属性信息</h3></Col>
            <Col span={12}>
              <Form.Item label="属性名称">
                {getFieldDecorator("attributeName")(
                  <Input placeholder="请输入属性名称" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行时长">
                {getFieldDecorator("runningTime")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总运行时长" /></Col>
                    <Col span={4}>小时</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="总运行里程">
                {getFieldDecorator("runningMiles")(
                  <Row>
                    <Col span={20}><Input placeholder="请输入总运行里程" /></Col>
                    <Col span={4}>米</Col>
                  </Row>
                )}
              </Form.Item>
            </Col>

            <Col span={24}><h3>固定信息</h3></Col>
            <Col span={12}>
              <Form.Item label="通信标识">
                {getFieldDecorator("connectLogo", {
                  rules: [{required: true}],
                })(
                  <Input placeholder="请输入通信标识" />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="视频流程协议">
                {getFieldDecorator("video", {
                  initialValue: "1",
                  rules: [{required: true}],
                })(
                  <Select>
                    <Option value="1">HLS</Option>
                    <Option value="2">RTSP</Option>
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
