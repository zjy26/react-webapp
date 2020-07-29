import React, { useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { connect } from 'react-redux'
import { toolClassess } from '../../../api'

const EditModel = props => {
  const [form] = Form.useForm();
  const { read, setRead } = props

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  };

  useEffect(() => {
    if (read) {
      console.log(props.id)
      toolClassess.toolClassessDetail(props.id.id)
        .then(res => {
          if (res.actionErrors && res.actionErrors.length) {
            message.error(res.actionErrors[0])
          } else {
            form.setFieldsValue({
              code: res.code,
              desc: res.desc,
              remarks: res.remarks
            })
          }
        })
        .catch(error => {
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [read])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log(props.id)
        toolClassess.toolClassessUpdate(props.id.id, {
          remarks: values.remarks,
          desc: values.desc,
          _method: 'PUT'
        })
          .then(res => {
            if (res.actionErrors && res.actionErrors.length) {
              message.error(res.actionErrors[0])
            } else {
              message.success('更新成功')
            }
            props.setDirty(dirty => dirty + 1)
          })
          .catch(error => {
          })
      })
      .catch(error => {
      });
  }
  const hideModal = () => {
    setRead(false)
  };

  const saveModal = () => {
    handleSubmit()
    setRead(false)
  };

  return (
    <Modal
      title="编辑"
      visible={read}
      onOk={saveModal}
      onCancel={hideModal}
      okText="确认"
      okType="danger"
      cancelText="取消"
      keyboard={true}
      maskClosable={false}
      getContainer={false}
    >
      <Form {...layout} form={form}>
        <Form.Item name="desc" label="层级名称" rules={[
          {
            required: true,
            message: '请输入层级名称'
          },
          {
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
          }]}>
          <Input maxLength={20} placeholder="请输入层级名称"/>
        </Form.Item>
        <Form.Item name="code" label="分类代码" rules={[{ required: true, message: '请输入分类代码' }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="remarks" label="备注" rules={[{}]}>
          <Input.TextArea placeholder="请输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  userLine: state.getIn(['common', 'userLine'])
})

export default connect(mapStateToProps, null)(React.memo(EditModel))
