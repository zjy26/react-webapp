import React from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const DetailModal = props => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };
  return (
    <Modal
      title={props.title}
      width="1200px"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Row>
          <Col span={8}>
            <Form.Item label="序号">
              {getFieldDecorator('code')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="专业">
              {getFieldDecorator('professional')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="线路">
              {getFieldDecorator('line')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="站点">
              {getFieldDecorator('site')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备类型">
              {getFieldDecorator('objType')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备名称">
              {getFieldDecorator('objName')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="厂家">
              {getFieldDecorator('manufacturer')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="型号">
              {getFieldDecorator('model')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备投用时间">
              {getFieldDecorator('objUseTime')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备大修周期">
              {getFieldDecorator('objMaintenanceCycle')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="使用年限">
              {getFieldDecorator('useTime')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预防性维护周期">
              {getFieldDecorator('preventiveMaintenanceCycle')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="上次试验时间">
              {getFieldDecorator('lastTestTime')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预防性试验设备评估结论">
              {getFieldDecorator('preventiveTestObjEvaluation')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="预防性试验情况（是/否）">
              {getFieldDecorator('preventiveTestSituation')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="年度计划维护频次">
              {getFieldDecorator('annualPlanMaintenanceFrequency')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="最近维护时间">
              {getFieldDecorator('lastMaintenanceTime')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="最近维护时间">
              {getFieldDecorator('lastMaintenanceTime')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="物耗成本">
              {getFieldDecorator('materialCost')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备使用年限">
              {getFieldDecorator('objUsedYears')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="故障率">
              {getFieldDecorator('faultRate')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备状态">
              {getFieldDecorator('objState')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="备件储备">
              {getFieldDecorator('partsReserve')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="技术能力">
              {getFieldDecorator('technicalAbility')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="物耗值">
              {getFieldDecorator('materialValue')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="风险权重">
              {getFieldDecorator('riskWeighting')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="负荷能力">
              {getFieldDecorator('loadCapacity')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="综合评分">
              {getFieldDecorator('comprehensiveScore')(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="设备评级">
              {getFieldDecorator('objRating')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
        
    </Modal>
  )
}

export default Form.create()(DetailModal);