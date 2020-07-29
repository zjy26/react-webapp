import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Form, Input, Select, DatePicker, TimePicker, Upload, message, Modal } from 'antd'
import moment from "moment"
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
  },
}

const Basic = props => {
  const { id, catenaryTypeOption, setLineCode, setEditStatus } = props
  const [edit, setEdit] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const dateFormat = 'YYYY-MM-DD', timeFormat = "HH:mm"
  const [fileList, setFileList] = useState({
    lineInfo: [],
    lineInfoHt: []
  })

  useEffect(() => {
    configLocation.configLocationDetail(id)
      .then(res => {

        if (res) {
          setLineCode(res.code)  //线路code

          const catenaryTypeArr = res.catenaryType && res.catenaryType.split(",")
          const descrArr = catenaryTypeArr && catenaryTypeArr.map(item => {
            const data = catenaryTypeOption.length > 0 && catenaryTypeOption.find(obj => obj.code === item)
            return "".concat(data.name)
          })

          setInitValues({
            ...res,
            lineLeader: res.lineLeader ? res.lineLeader.name : null,
            runTime: [res.runStartTime ? moment(res.runStartTime, timeFormat) : "", res.runEndTime ? moment(res.runEndTime, timeFormat) : ""],
            commissionDate: res.commissionDate ? moment(res.commissionDate) : null,
            catenaryType: res.catenaryType ? res.catenaryType.split(",") : [],
            catenaryTypeDesc: descrArr ? descrArr.join("，") : null
          })
          form.resetFields()
        }
      })
      .then(() => {
        showFile(id, "lineInfo-ht", setFileList, "lineInfoHt")
        showFile(id, "lineInfo", setFileList, "lineInfo")
      })
      .catch(() => {
        console.log("基础信息详情获取失败")
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catenaryTypeOption, dirty])

  //保存
  const save = () => {
    form.validateFields()
      .then(values => {
        form.isFieldsTouched() ?
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              const { runTime, ...data } = values
              const runTimeArr = values.runTime && values.runTime.map(item => moment(item).format(timeFormat))
              const params = {
                ...data,
                commissionDate: values.commissionDate ? moment(values.commissionDate, dateFormat).valueOf() : null,
                runStartTime: runTimeArr ? runTimeArr[0] : null,
                runEndTime: runTimeArr ? runTimeArr[1] : null,
                catenaryType: values.catenaryType.length > 0 ? values.catenaryType.toString() : null,
                _method: 'PUT'
              }

              configLocation.configLocationUpdate(id, params)
                .then(() => {
                  setDirty(dirty => dirty + 1)
                  message.success("保存成功")
                  setEdit(false)
                })
            }
          })
          : setEdit(false)
      })
      .then(() => {
        //附件上传
        const ids = []
        for (var i in fileList) {
          fileList[i].forEach(item => {
            if(item.status === "done") {
              ids.push(item.uid)
            }
          })
        }
        upload({
          ids: ids.toString(),
          record: id
        })
        .then(res => {
          if(res && res.success) {
            setFileList({
              lineInfo: fileList.lineInfo.filter((item) => item.status === "done"),
              lineInfoHt: fileList.lineInfoHt.filter((item) => item.status === "done")
            })
          }
        })
      })
  }

  //取消
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }

  setEditStatus(edit)  //用于其他tab点击前确认基础信息是否保存

  return (
    <React.Fragment>
      <Row>
        <Col span={20}><h3>基础信息</h3></Col>
        {
          edit ?
            <Col span={4} align="right">
              <Button type="link" onClick={save}>保存</Button>
              <Button type="link" onClick={cancel}>取消</Button>
            </Col> :
            <Col span={4} align="right">
              <Button type="link" onClick={() => { setEdit(true) }}>编辑</Button>
            </Col>
        }
      </Row>

      <Form name="lineBasicForm" {...formItemLayout} form={form} initialValues={initValues} style={{ margin: 20 }}>
        {
          edit ?
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="线路代码" name="code">
                  <Input disabled />
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
                  <DatePicker placeholder="请选择开始运营日期" format={dateFormat} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="日运营时间" name="runTime">
                  <TimePicker.RangePicker format={timeFormat} />
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
                <Form.Item label="备注" name="comment">
                  <Input.TextArea placeholder="请输入备注" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="图形">
                  <EditUpload
                    model = 'lineInfo-ht'
                    id = {id}
                    type = {1}
                    fileList = {fileList.lineInfoHt}
                    setFileList = {setFileList}
                    option = "lineInfoHt"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="附件">
                  <EditUpload
                    model = 'lineInfo'
                    id = {id}
                    type = {1}
                    fileList = {fileList.lineInfo}
                    setFileList = {setFileList}
                    option = "lineInfo"
                  />
                </Form.Item>
              </Col>
            </Row> :
            <Row>
              <Col span={12}>
                <Form.Item label="线路代码">
                  {initValues.code}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="线路描述">
                  {initValues.desc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="开始运营日期">
                  {initValues.commissionDate ? moment(initValues.commissionDate).format(dateFormat) : null}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="日运营时间">
                  {initValues.runStartTime} - {initValues.runEndTime}
                </Form.Item>
              </Col>
              <Col span={12} hidden>
                <Form.Item label="线长">
                  {initValues.lineLeader}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="触网类型">
                  {initValues.catenaryTypeDesc}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="备注">
                  {initValues.comment}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="图形">
                  <Upload fileList={fileList.lineInfoHt} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="附件">
                  <Upload fileList={fileList.lineInfo} disabled />
                </Form.Item>
              </Col>
            </Row>
        }
      </Form>
    </React.Fragment>
  )
}

export default React.memo(Basic)
