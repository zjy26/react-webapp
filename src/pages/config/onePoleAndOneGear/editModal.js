import React, { useState, useEffect } from 'react'
import { Modal, Input, message, Select, DatePicker, Form } from 'antd'
import moment from "moment"
import { overheadLine, classification } from '../../../api'
import { connect } from 'react-redux'

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

const EditModal = props => {
  const [form] = Form.useForm()
  const user = props.user.toJS()
  const brands = props.brands.toJS()
  const [objectClassTrees, setObjectClassTrees] = useState([])
  const handleSubmit = async () => {
    try {
      form.validateFields()
        .then(values => {
          const { siteLine, ...data } = values
          const params = { ...data, codeList: props.selectedCodes.toString(), commissDate: moment(values.commissDate).valueOf() }
          overheadLine.overHeadLineRevise(params)
            .then((res) => {
              message.success("编辑成功")
              props.handleCancel()
              props.setDirty((dirty) => dirty + 1)
              form.resetFields()
            })

        })
    } catch (errorInfo) {
      return
    }
  }

  useEffect(() => {
    classification({ org: user.org, clsFun: 'asset.classification', fun: 'asset.classification', major: '06' })
      .then(res => {
        if (res) {
          setObjectClassTrees(res)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedCodes])

  return (
    <Modal
      maskClosable={false}
      title="批量修改"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      objectIds={props.selectedCodes}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      setDirty={props.setDirty}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="设备分类" name="cls" rules={[{ required: true, message: '请选择设备分类' }]}>
          <Select placeholder="请选择设备分类" allowClear>
            {
              objectClassTrees && objectClassTrees.children && objectClassTrees.children.map(item => (
                <Select.OptGroup key={item.id} label={item.text}>
                  {
                    item.children.map(child => (
                      <Select.Option key={child.model.code} value={child.model.code}>{child.model.desc} ({child.model.code})</Select.Option>
                    ))
                  }
                </Select.OptGroup>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item label="品牌" name="brand" rules={[{ required: true, message: '请选择设备品牌' }]}>
          <Select placeholder="请选择设备品牌" allowClear >
            {brands && brands.map(item => (
              <Select.Option key={item.code} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="型号" name="modelNumber" rules={[{ required: true, message: '请选择设备品牌' }]} >
          <Input placeholder="请输入型号" />
        </Form.Item>
        <Form.Item label="规格" name="spec">
          <Input placeholder="请输入规格" />
        </Form.Item>
        <Form.Item label="启用日期" name="commissDate" rules={[{ required: true, message: '请选择启用日期' }]}>
          <DatePicker placeholder="请选择启用日期" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location']),
    user: state.getIn(['common', 'user']),
    brands: state.getIn(['common', 'brands'])
  }
}

export default connect(mapStateToProps, null)(React.memo((EditModal)))
