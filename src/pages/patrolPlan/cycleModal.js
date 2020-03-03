import React, {useState} from 'react';
import { Modal, Form, Select, DatePicker, Button, InputNumber, Row, Col } from 'antd';

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
const {Option} = Select;
const weekOption = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const { confirm } = Modal;

function showConfirm() {
  confirm({
    title: '是否将计划变更到待使用状态，变更后该巡检计划将会暂停',
    onOk() {

    },
    onCancel() {},
  });
}

const CycleModal = props => {
  const { getFieldDecorator } = props.form;
  const [selectedItems, setItems] = useState([]);
  const filteredOptions = weekOption.filter(o => !selectedItems.includes(o));
  const selectChange = selectedItems => {
    setItems( selectedItems )
  };
  const handleOk = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        showConfirm();
      }
    });
  }

  return (
    <Modal
      title="编辑周期"
      okText="确认"
      cancelText="取消"
      width = "700px"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk= {handleOk}
    >
      <h5>(编辑后巡检计划次日生效)</h5>
      <Form {...formItemLayout}>
        <Row>
          <Col span={12}>
            <Form.Item label="周期">
              {getFieldDecorator('cycle', {
                rules: [{required: true}],
              })(
                <Select placeholder="请选选周期">
                  <Option value="1">手动</Option>
                  <Option value="2">星期</Option>
                  <Option value="3">日</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始时间">
              {getFieldDecorator('startTime', {rules: [{required: true}]} )(
                <DatePicker showTime placeholder="请选择开始时间" />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始时间">
              {getFieldDecorator('endTime', {rules: [{required: true}]} )(
                <DatePicker showTime placeholder="请选择结束时间" />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="启动时间">
              {getFieldDecorator('startTime', {rules: [{required: true}]} )(
                <span>
                  <InputNumber min={1} max={24} style={{ width: '25%' }}/>时
                  <InputNumber min={0} max={59} style={{ width: '25%' }}/>分
                  <InputNumber min={0} max={59} style={{ width: '25%' }}/>秒
                </span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="星期">
              {getFieldDecorator('week', {
                rules: [{required: true}],
              })(
                <span>
                  <Select
                    mode="multiple"
                    placeholder="请选择星期"
                    value={selectedItems}
                    onChange={selectChange}
                    style={{ width: '70%' }}
                  >
                    {filteredOptions.map(item => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button shape="circle" icon="plus"/>
                  <Button shape="circle" icon="minus" />
                </span>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="巡检时间">
              {getFieldDecorator('time', {
                rules: [{required: true}],
              })(
                <span>
                  <InputNumber min={1} max={24} style={{ width: '25%' }}/>时
                  <InputNumber min={0} max={59} style={{ width: '25%' }}/>分
                  <Button shape="circle" icon="plus" />
                  <Button shape="circle" icon="minus" />
                </span>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default Form.create()(CycleModal);