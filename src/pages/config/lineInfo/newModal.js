import React, {useEffect} from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Modal, Input, Upload, DatePicker, TimePicker, Select, Row, Col, Button } from 'antd'
import './Line.module.scss'
import moment from 'moment'

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

const NewModal = props => {
  const [form] = Form.useForm()

  useEffect(()=>{
    if(props.visible === true) {

    }

  }, [props.visible])

  //确定
  const handleSubmit = () => {
    form.validateFields()
    .then(values=> {
      const params = {
        ...values,
        commissionDate: values.commissionDate ? moment(values.commissionDate , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        runStartTime: values.runStartTime ? moment(values.runStartTime).format('HH:mm') : null,
        runEndTime: values.runEndTime ? moment(values.runEndTime).format('HH:mm') : null
      }
      console.log(params)
    })
  }

  return (
    <Modal
      title="新建线路"
      okText="确认"
      cancelText="取消"
      width="800px"
      onOk= {handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout} form={form}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="线路描述" name="name" rules={[{required: true, message: '请输入线路描述'}]}>
              <Input placeholder="请输入线路描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始运营时间" name="commissionDate">
              <DatePicker placeholder="请选择开始运营时间" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="日运营开始时间" name="runStartTime">
              <TimePicker placeholder="请选择日运营开始时间" format={"HH:mm"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="日运营结束时间" name="runEndTime">
              <TimePicker placeholder="请选择日运营结束时间" format={"HH:mm"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型" name="catenaryType">
              <Select placeholder="请选择触网类型" allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="comment">
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="图形">
              <Upload listType="picture-card">
                <PlusOutlined />
              </Upload>
              <div>不超过20M,格式为jpg，png</div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="附件">
              <Upload>
                <Button>上传附件</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(NewModal)
