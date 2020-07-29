import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { connect } from 'react-redux'
import { unitClasses } from '../../../api'

const AddModel = props => {
  const [form] = Form.useForm();
  const { editNew, setEditNew } = props
  const { Option } = Select;

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
  };

  useEffect(() => {
    if (editNew) {
      form.resetFields()
      form.setFieldsValue({
        level: props.currentId.id !== 'root' ? 1 : 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editNew])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        let parentCls = props.currentId.id !== 'root' ? values.level === 1 ? props.currentId.model.parentCls !== null ? props.currentId.model.parentCls : "" : props.currentId.model.code : ""
        let parentClsOrg = props.currentId.id !== 'root' ? values.level === 1 ? props.currentId.model.parentClsOrg : props.currentId.model.org : ""
        let org = props.currentId.id === 'root' ? "*" : props.currentId.model.org
        unitClasses.unitClassesNew({
          parentCls: parentCls,
          parentClsOrg: parentClsOrg,
          org: org,
          descr: values.descr,
          remarks: values.remarks,
          code: parentCls + values.code,
          desc: values.desc,
          function: 19
        })
          .then(res => {
            if (res.actionErrors && res.actionErrors.length) {
              message.error(res.actionErrors[0])
            } else {
              message.success('添加成功')
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
    setEditNew(false)
  };

  const saveModal = () => {
    form.validateFields()
      .then(() => {
        handleSubmit()
        setEditNew(false)
      })
      .catch(error => {
      })
  };

  return (
    <Modal
      title="添加"
      visible={editNew}
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
          <Input maxLength={20} placeholder="请输入层级名称" />
        </Form.Item>
        <Form.Item name="code" label="分类代码" rules={[
          {
            required: true,
            message: '请输入分类代码'
          },
          {
            pattern: /^[^\s]*$/,
            message: '禁止输入空格',
          }]}>
          <Input maxLength={20} placeholder="请输入分类代码" />
        </Form.Item>
        <Form.Item name="level" label="级别选择" rules={[
          {
            required: true
          }]}>
          {
            props.currentId.level > 3 || props.currentId.id === 'root' ?
              <Select disabled>
                <Option value={0}>添加下级</Option>
                <Option value={1}>添加同级</Option>
              </Select>
              :
              <Select>
                <Option value={0}>添加下级</Option>
                <Option value={1}>添加同级</Option>
              </Select>
          }
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

export default connect(mapStateToProps, null)(React.memo(AddModel))
