import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, Form } from 'antd'
import Result from './result'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { templateApply } from '../../../api/config/templateApply'
import { connect } from 'react-redux'
import { configObjectTemplate } from '../../../api/config/objectTemplate'

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
  const [associated, setAssociated] = useState([])
  const [result, setResult] = useState({})
  const [visible, setVisible] = useState(false)
  const { modalProperty } = props

  const handleSubmit = () => {
    form.validateFields()
    .then(values => {
      Modal.confirm({
        title: '已应用模板的设备，进行模板变更时，所有设备属性和部件信息将采用新的模板内容。原有数据将清空删除。此操作不可恢复，是否确定变更？',
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const params = {
            objectIds: modalProperty.type==='edit'? modalProperty.id : props.selectedCodes.toString(),
            objectTemplate: modalProperty.template
          }
          templateApply.addObjectTemplate(params)
          .then((res) => {
            if(res.success){
              setResult(res)
              setVisible(true)
            }
          })
        }
      })
    })
  }

  const handleCancel = () => {
    setVisible(false)
    props.setDirty(dirty => dirty+1)
    props.handleCancel()
  }

  useEffect(() => {
    if(props.visible){
      searchTemplate(modalProperty.cls,modalProperty.brand,modalProperty.modelNumber)
      form.setFieldsValue({cls:modalProperty.clsDesc,brand:modalProperty.brandName,modelNumber:modalProperty.modelNumber,template:modalProperty.template})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const searchTemplate = (cls,brand,modelNumber) => {
    configObjectTemplate.associatedTemplate(
      {
        type: "01",
        cls: cls,
        brand: brand,
        modelNumber: modelNumber,
        limit: 30,
      }
    )
      .then(res => {
        setAssociated(res.models)
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="变更模板"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      setDirty={props.setDirty}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="设备分类" name="cls">
          <Select placeholder="请选择设备分类" allowClear disabled>
          </Select>
        </Form.Item>
        <Form.Item label="品牌" name="brand">
          <Select placeholder="请选择设备品牌" allowClear disabled >
            {/* {brands && brands.map(item => (
              <Select.Option key={item.code} value={item.code}>
                {item.name}
              </Select.Option>
            ))} */}
          </Select>
        </Form.Item>
        <Form.Item label="型号" name="modelNumber">
          <Input placeholder="请输入型号" disabled/>
        </Form.Item>
        <Form.Item label="模板" name="template">
            <Select
              allowClear
              placeholder="请选择关联模板"
              showSearch
              filterOption={false}
            >
              {
                associated && associated.length>0 && associated.map(item => (
                  <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                ))
              }
            </Select>
        </Form.Item>
      </Form>
      <Result result={result} visible={visible} brands={props.brands} handleCancel={handleCancel} modalProperty={modalProperty} />
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
