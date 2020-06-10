import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Form, Modal, Input, Upload, DatePicker, TimePicker, Select, Row, Col, Button, message } from 'antd'
import moment from 'moment'
import { configLocation } from '../../../api/config/lineInfo'

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
  const { catenaryTypeOption, lineLeaderOption } = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [prefix, setPrefix] = useState()

  useEffect(() => {
    if (props.visible === true) {
      configLocation.configLocationNew({ level: 2 })
        .then((res) => {
          setPrefix(res.code)
          const { code, ...data } = res
          setInitValues({
            ...data, code: null,
            lineLeader: res.lineLeader ? res.lineLeader : undefined,
            catenaryType: res.catenaryType ? res.catenaryType : undefined,
            runTime: [res.runStartTime, res.runEndTime]
          })
          form.resetFields()
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  //确定
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        const { runTime, ...data } = values
        const runTimeArr = values.runTime.map(item => item ? moment(item).format('HH:mm') : "")

        const params = {
          ...data,
          level: 2,
          org: props.user.org,
          code: `${prefix}${values.code}`,
          commissionDate: values.commissionDate ? moment(values.commissionDate, 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
          runStartTime: runTimeArr[0],
          runEndTime: runTimeArr[1],
          catenaryType: values.catenaryType ? values.catenaryType.toString() : null
        }
        configLocation.configLocationAdd(params)
          .then((res) => {
            if (res.success) {
              props.handleCancel()
              props.setDirty((dirty) => dirty + 1)
            } else {
              message.error("新建失败，站点代码可能重复")
            }
          })
      })
  }

  return (
    <Modal
      maskClosable={false}
      title="新建线路"
      okText="确认"
      cancelText="取消"
      width="800px"
      onOk={handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form name="newLineForm" {...formItemLayout} form={form} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="线路代码"
              name="code"
              rules={[
                { whitespace: true, message: '内容不能为空' },
                { required: true, message: '请输入线路代码' }
              ]}
            >
              <Input addonBefore={prefix} maxLength={2} placeholder="请输入线路代码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="线路描述"
              name="desc"
              rules={[
                { whitespace: true, message: '内容不能为空' },
                { required: true, message: '请输入线路描述' }
              ]}
            >
              <Input placeholder="请输入线路描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始运营日期" name="commissionDate">
              <DatePicker placeholder="请选择开始运营日期" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="日运营时间" name="runTime">
              <TimePicker.RangePicker format={"HH:mm"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型" name="catenaryType">
              <Select placeholder="请选择触网类型" allowClear mode="multiple">
                {
                  catenaryTypeOption.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="线长" name="lineLeader">
              <Select
                placeholder="请选择线长"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  lineLeaderOption.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
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
