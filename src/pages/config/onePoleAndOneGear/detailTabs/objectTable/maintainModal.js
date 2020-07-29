import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, Row, Col, Select, message, DatePicker } from 'antd'
import { overheadLine } from '../../../../../api'
import moment from 'moment'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  }
}

const MaintainModal = props => {
  const { visible, handleCancel, setDirty, MyContext } = props
  const { maintainTypeOption, peopleOption, code } = useContext(MyContext)
  const [objData, setObjData] = useState([])
  const [form] = Form.useForm()
  const [type, setType] = useState("01")
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ type: "01" })
      setOkLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    overheadLine.overheadLineObjectList({ code: code })
      .then(res => {
        if (res.models) {
          setObjData(res.models)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        let { brand, modelNumber, clsName, ...data } = values
        let params = {
          ...data,
          overheadLine: code,
          startTime: values.startTime ? moment(new Date(values.startTime), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.startTime,
          endTime: values.endTime ? moment(new Date(values.endTime), 'YYYY-MM-DD HH:mm:ss').valueOf() : values.endTime
        }
        setOkLoading(true)
        overheadLine.objectRepairAdd(params)
          .then(res => {
            if (res.success) {
              message.success("新建成功")
              form.resetFields()
              setDirty(dirty => dirty + 1)
              handleCancel()
            }
          })
      })
      .catch(err => {

      })
  }

  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        getContainer={false}
        title="新建"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleOk}
        okButtonProps={{ loading: okLoading }}
      >
        <Form form={form} name="maintainForm" {...formItemLayout}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="类型" name="type" value={type} rules={[{ required: true, message: '请选择类型' }]}>
                <Select
                  placeholder="请选择类型"
                  onChange={val => {
                    setType(val)
                    form.resetFields()
                    form.setFieldsValue({ type: val })
                  }}
                >
                  {
                    maintainTypeOption && maintainTypeOption.length > 0 && maintainTypeOption.map(item => (
                      <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备描述" name="sn" rules={[{ required: true, message: '请选择关联设备' }]}>
                <Select placeholder="请选择设备"
                  onChange={
                    (value) => {
                      const objects = objData.find(obj => obj.id = value)
                      form.setFieldsValue({
                        oldbrand: objects.brdName,
                        oldmodelNumber: objects.modelNumber,
                        clsName: objects.clsName,
                        objectMark: objects.objectMark
                      })
                    }
                  }
                >
                  {
                    objData && objData.length > 0 && objData.map((item, index) => (
                      <Select.Option key={index} value={item.sn}>{item.descr}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备分类" name="clsName">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备品牌" name="oldbrand">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备型号" name="oldmodelNumber">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="设备标识" name="objectMark">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item label="维护/维修信息" name="descr" rules={[{ required: true, message: '请输入维护/维修信息' }]}>
                <Input.TextArea placeholder="请输入维护/维修信息" maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item label="处理信息" name="explanation">
                <Input.TextArea placeholder="请输入处理信息" maxLength={200} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="开始时间" name="startTime">
                <DatePicker placeholder="请输入开始时间" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="结束时间" name="endTime">
                <DatePicker placeholder="请输入结束时间" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="负责人" name="principal" rules={[{ required: true, message: '请选择负责人' }]}>
                <Select placeholder="请选择负责人"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  allowClear
                >
                  {
                    peopleOption.length > 0 && peopleOption.map(item => (
                      <Select.Option key={item.id} value={item.id} code={item.code}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </React.Fragment>
  )
}
export default React.memo(MaintainModal)
