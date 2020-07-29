import React, { useEffect, useState, useContext } from 'react'
import { Form, Modal, Input, Row, Col, Select, Radio, Upload, message, Button, InputNumber } from 'antd'
import { configLocation } from '../../../../../api/config/lineInfo'
import { upload } from '../../../../../api/index'
import { EditUpload, showFile } from '../../../../common/upload'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
}

const SiteModal = props => {
  const { modalProperty, visible, setDirty, handleCancel, MyContext } = props
  const { entity, lineCode, org } = useContext(MyContext)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [prefix, setPrefix] = useState()
  const [siteOption, setSiteOption] = useState([])
  const [siteDirty, setSiteDirty] = useState(0)
  const [okLoading, setOkLoading] = useState(false)

  const [fileList, setFileList] = useState({
    stationHt: [],
    stationImage: []
  })

  useEffect(() => {
    if (visible) {
      setOkLoading(false)
      modalProperty.type === "add" ?
        configLocation.configLocationNew({ level: 4, line: lineCode })
          .then((res) => {
            setPrefix(res.code)
            const { code, ...data } = res
            setInitValues({
              ...data,
              code: null,
              mapField: res.mapField ? res.mapField : undefined,
              siteFunction: res.siteFunction ? res.siteFunction : undefined,
              style: res.style ? res.style : undefined,
              locationType: res.locationType ? res.locationType : undefined,
            })
            form.resetFields()
            setFileList({
              stationHt: [],
              stationImage: []
            })
          })
        :
        configLocation.configLocationDetail(modalProperty.siteId)
          .then(res => {
            if (res) {
              const siteFunctionValue = entity.siteFunctionOption.find(obj => obj.code === res.siteFunction)
              const styleValue = entity.styleOption.find(obj => obj.code === res.style)
              const locationTypeValue = entity.locationTypeOption.find(obj => obj.code === res.locationType)
              const siteField = siteOption.find(obj => obj.code === res.mapField)

              modalProperty.type === "check" ?
                setInitValues({
                  ...res,
                  isDutyPoint: res.isDutyPoint ? "是" : "否",
                  siteFunction: siteFunctionValue ? siteFunctionValue.name : null,
                  style: styleValue ? styleValue.name : null,
                  locationType: locationTypeValue ? locationTypeValue.name : null,
                  mapField: siteField ? `${res.mapField}-${siteField.desc}` : null
                })
                :
                setInitValues({
                  ...res,
                  mapField: res.mapField ? res.mapField : undefined,
                  siteFunction: res.siteFunction ? res.siteFunction : undefined,
                  style: res.style ? res.style : undefined,
                  locationType: res.locationType ? res.locationType : undefined,
                })

              form.resetFields()
            }
          })
          .then(() => {
            showFile(modalProperty.siteId, "station-ht", setFileList, "stationHt")
            showFile(modalProperty.siteId, "station-image", setFileList, "stationImage")
          })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.locationTypeOption, entity.siteFunctionOption, entity.styleOption, lineCode, modalProperty.siteId, modalProperty.type, visible, siteOption])

  //当前线路所有站点
  useEffect(() => {
    if (visible) {
      configLocation.configLocationList({ level: 4, line: lineCode })
        .then(res => {
          if (res && res.models) {
            setSiteOption(res.models)
          }
        })
    }
  }, [lineCode, siteDirty, visible])

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setOkLoading(true)
        switch (modalProperty.type) {
          case "add":
            const { code, ...data } = values
            const params = {
              ...data,
              level: 4,
              org: org,
              code: `${prefix}${values.code}`
            }
            configLocation.configLocationAdd(params)
              .then((res) => {
                if (res && res.success) {
                  handleCancel()
                  setDirty((dirty) => dirty + 1)
                  message.success("新建成功")
                  setSiteDirty(siteDirty => siteDirty + 1)
                  return res
                } else {
                  message.error(res.actionErrors[0])
                  setOkLoading(false)
                }
              })
              .then(data => {
                if (data && data.id) {
                  const ids = []
                  for (var i in fileList) {
                    fileList[i].forEach(item => {
                      if (item.status === "done") {
                        ids.push(item.uid)
                      }
                    })
                  }
                  upload({
                    ids: ids.toString(),
                    record: data.id
                  })
                }
              })
            break;
          case "edit":
            configLocation.configLocationUpdate(modalProperty.siteId, { ...values, _method: 'PUT' })
              .then((res) => {
                if (res && res.success) {
                  message.success("编辑成功")
                  setDirty(dirty => dirty + 1)
                  handleCancel()
                  setSiteDirty(siteDirty => siteDirty + 1)
                } else {
                  message.error('编辑失败')
                  setOkLoading(false)
                }
              })
              .then(() => {
                const ids = []
                for (var i in fileList) {
                  fileList[i].forEach(item => {
                    if (item.status === "done") {
                      ids.push(item.uid)
                    }
                  })
                }
                upload({
                  ids: ids.toString(),
                  record: modalProperty.siteId
                })
              })
            break;
          default:
            handleCancel()
        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      title={modalProperty.title}
      okText="确认"
      cancelText="取消"
      width="700px"
      onOk={handleSubmit}
      visible={visible}
      onCancel={handleCancel}
      footer={
        modalProperty.type === "check" ? null :
          [
            <Button key="cancel" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={okLoading} onClick={handleSubmit}>确定</Button>
          ]
      }
    >
      <Form name="lineLocationForm" {...formItemLayout} form={form} initialValues={initValues}>
        {
          modalProperty.type === "check" ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="序号">
                  {initValues.sn}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点代码">
                  {initValues.code}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="站点名称">
                  {initValues.desc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备归属站点">
                  {initValues.mapField}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {initValues.telPhone}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="地址">
                  {initValues.address}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站类型">
                  {initValues.siteFunction}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="变电所类型">
                  {initValues.style}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站位置类型">
                  {initValues.locationType}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="建设期">
                  {initValues.buildPeriod}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="值守点">
                  {initValues.isDutyPoint}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HT图形">
                  <Upload fileList={fileList.stationHt} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="平面图">
                  <Upload fileList={fileList.stationImage} disabled />
                </Form.Item>
              </Col>
            </Row>
            :
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="序号"
                  name="sn"
                  rules={[{ required: true, message: '请输入序号' }]}
                >
                  <InputNumber placeholder="请输入序号" min={1} precision={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                {
                  modalProperty.type === "add" ?
                    <Form.Item
                      label="站点代码"
                      name="code"
                      rules={[
                        { whitespace: true, message: '内容不能为空' },
                        { required: true, message: '请输入站点代码' }
                      ]}
                    >
                      <Input addonBefore={prefix} maxLength={2} placeholder="请输入站点代码" />
                    </Form.Item>
                    :
                    <Form.Item label="站点代码" name="code">
                      <Input disabled />
                    </Form.Item>
                }
              </Col>
              <Col span={12}>
                <Form.Item
                  label="站点名称"
                  name="desc"
                  rules={[
                    { max: 20, message: '最大长度为20个字符' },
                    { whitespace: true, message: '内容不能为空' },
                    { required: true, message: '请输入站点名称' }
                  ]}
                >
                  <Input placeholder="请输入站点名称" maxLength={20} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="设备归属站点" name="mapField">
                  <Select
                    placeholder="请选择设备归属站点"
                    allowClear
                    showSearch
                  >
                    {
                      siteOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.code}-{item.desc}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="联系电话"
                  name="telPhone"
                  rules={[{
                    required: false,
                    pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    message: '请输入正确的手机号'
                  }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="地址" name="address">
                  <Input placeholder="请输入地址" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站类型" name="siteFunction">
                  <Select placeholder="请选择车站类型" allowClear>
                    {
                      entity.siteFunctionOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="变电所类型" name="style">
                  <Select placeholder="请选择变电所类型" allowClear>
                    {
                      entity.styleOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="车站位置类型" name="locationType">
                  <Select placeholder="请选择车站位置类型" allowClear>
                    {
                      entity.locationTypeOption.map(item => (
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="建设期" name="buildPeriod">
                  <Input placeholder="请输入建设期" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="值守点" name="isDutyPoint">
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HT图形">
                  <EditUpload
                    model='station-ht'
                    fileList={fileList.stationHt}
                    setFileList={setFileList}
                    option="stationHt"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="平面图">
                  <EditUpload
                    model='station-image'
                    fileList={fileList.stationImage}
                    setFileList={setFileList}
                    option="stationImage"
                  />
                </Form.Item>
              </Col>
            </Row>
        }
      </Form>
    </Modal>
  )
}

export default React.memo(SiteModal)
