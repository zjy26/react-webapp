import React, { useEffect, useContext, useState } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, message } from 'antd'
import { overheadLine } from '../../../../../api/index'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  }
}

const AddTestModal = props => {
  const { visible, handleCancel, setDirty, setBase, MyContext } = props
  const { code } = useContext(MyContext)
  const [okLoading, setOkLoading] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        if (values) {
          overheadLine.overheadLineDebugNew({ ...values, overheadLine: code })
            .then(() => {
              message.success("新建成功")
              handleCancel()
              setBase(base => base + 1)
              setDirty(dirty => dirty + 1)
              form.resetFields()
            })
        } else {
          setOkLoading(false)
          message.success("请输入要新建的值")
        }

      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="新建"
      okText="确认"
      cancelText="取消"
      width={800}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="templateTestForm" form={form} {...formItemLayout}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="导高" name="guideHeight">
              <InputNumber placeholder="请输入导高(mm)" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="拉出值" name="pullValue">
              <Input.TextArea placeholder="请输入拉出值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="接触线磨耗" name="contractLineAbrasion">
              <Input placeholder="请输入接触线磨耗" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="接触面高" name="contactSurfaceHeight">
              <InputNumber placeholder="接触面高(m)" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="下锚状态A值" name="anchorStateAValue">
              <Input placeholder="请输入下锚状态A值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="下锚状态B值" name="anchorStateBValue">
              <Input placeholder="请输入下锚状态B值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="分段导滑板磨耗" name="sectSkateAbrasion">
              <Input placeholder="请输入分段导滑板磨耗" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="中心锚接数据" name="centralAnchorData">
              <Input placeholder="请输入中心锚接数据" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(AddTestModal)
