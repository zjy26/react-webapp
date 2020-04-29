import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Row, Col, Form, Input, Select, DatePicker, TimePicker, Upload, message } from 'antd'
import moment from "moment"
import { configLocation } from '../../../../api'

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
  const {id, catenaryTypeOption, setLineCode} = props
  const [edit, setEdit] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const catenaryTypeValue = catenaryTypeOption.find(obj=> obj.code === initValues.catenaryType)
  const dateFormat = 'YYYY-MM-DD', timeFormat = "HH:mm"

  useEffect(()=>{
    configLocation.configLocationDetail(id)
    .then(res=> {
      if(res) {
        setLineCode(res.code)  //线路code
        setInitValues({
          ...res,
          lineLeader: res.lineLeader ? res.lineLeader.name : null,
          runTime: [res.runStartTime ? moment(res.runStartTime, timeFormat) : null, res.runEndTime ? moment(res.runEndTime, timeFormat) : null],
          commissionDate: res.commissionDate ? moment(res.commissionDate) : null
        })
        form.resetFields()
      }
    })
    .catch(()=>{
      console.log("业务基础数据详情获取失败")
    })

  }, [dirty, form, id, setLineCode])

  //保存
  const save = () => {
    form.validateFields()
    .then(values=> {
      const {runTime, ...data} = values
      const runTimeArr = values.runTime.map(item=>moment(item).format(timeFormat))
      const params = {
        ...data,
        commissionDate: values.commissionDate ? moment(values.commissionDate , dateFormat).valueOf() : null,
        runStartTime: runTimeArr[0] ? runTimeArr[0] : null,
        runEndTime: runTimeArr[1] ? runTimeArr[1] : null,
        _method:'PUT'
      }

      configLocation.configLocationUpdate(id, params)
      .then(()=>{
        setDirty(dirty=>dirty+1)
        message.success("保存成功")
        setEdit(false)
      })
    })
  }

  //取消
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }

  return (
    <React.Fragment>
      <Row>
        <Col span={2}><h3>基础信息</h3></Col>
        {
          edit ?
          <>
            <Col span={2}><Button type="primary" ghost onClick={save}>保存</Button></Col>
            <Col span={2}><Button type="primary" ghost onClick={cancel}>取消</Button></Col>
          </> :
          <Col span={2}><Button type="primary" ghost onClick={()=>{setEdit(true)}}>编辑</Button></Col>
        }
      </Row>

        <Form {...formItemLayout} form={form} initialValues={initValues}>
        {
          edit ?
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="线路代码" name="code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="线路描述" name="desc">
                <Input placeholder="请选择线路描述" />
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
                <Select placeholder="请选择触网类型" allowClear>
                  {
                    catenaryTypeOption.map(item=>(
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
            <Col span={12}>
              <Form.Item label="线长">
                {initValues.lineLeader}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="触网类型">
                {catenaryTypeValue ? catenaryTypeValue.name : initValues.catenaryType}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="备注">
                {initValues.comment}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="图形">
                <Upload listType="picture-card">
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="附件">
                <Upload>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        }
        </Form>
    </React.Fragment>
  )
}

export default React.memo(Basic)
