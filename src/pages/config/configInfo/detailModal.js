import React, {useState, useEffect} from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Radio, Row, Col } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const DetailModal = props => {
  const {getFieldDecorator} = props.form
  const [obj, setObj] = useState({})

  useEffect(()=>{
    setObj({})
  }, [])

  return (
    <Modal
      title={props.modalTitle}
      okText="确认"
      cancelText="取消"
      width="600px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      {
        props.modalTitle === "查看详情" ?
        <Form {...formItemLayout} >
         <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="名称">
                {getFieldDecorator("name", {
                  initialValue: obj.name,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="描述">
                {getFieldDecorator("descr", {
                  initialValue: obj.descr,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级">
                {getFieldDecorator("priority", {
                  initialValue: obj.priority,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态">
                {getFieldDecorator("disabled", {
                  initialValue: obj.disabled,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注">
                {getFieldDecorator("comment", {
                  initialValue: obj.comment,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form> :
        <Form {...formItemLayout} >
          <Form.Item label="名称">
            {getFieldDecorator("name", {
              initialValue: obj.name,
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="描述">
            {getFieldDecorator("descr", {
              initialValue: obj.descr,
            })(<Input placeholder="请输入描述" />)}
          </Form.Item>
          <Form.Item label="优先级">
            {getFieldDecorator("priority", {
              initialValue: obj.priority,
            })(<Input placeholder="请输入优先级" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator("disabled", {
              initialValue: obj.disabled,
              rules: [{required: true}],
            })(
            <Radio.Group>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>停用</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator("comment", {
              initialValue: obj.comment,
            })(<Input.TextArea placeholder="请输入备注" />)}
          </Form.Item>
        </Form>
      }
    </Modal>
  )
}

export default React.memo(Form.create()(DetailModal))
