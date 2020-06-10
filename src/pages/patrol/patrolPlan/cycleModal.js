import React, { useState, useEffect } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Modal, Select, DatePicker, TimePicker, Button, message } from 'antd'
import moment from "moment"
import { robotPlan } from '../../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

const CycleModal = props => {
  const [form] = Form.useForm()
  const [recValue, setRecValue] = useState(props.recurrence)

  useEffect(()=> {
    if(props.visible === true) {
      form.setFieldsValue({recurrence: props.recurrence})
      setRecValue(props.recurrence)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  let formItem = null
  const selectRecValue = recValue ? recValue : props.recurrence
  switch (selectRecValue) {
    case 2:
      formItem = <>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
      </>
      break;
    case 3:
      formItem = <>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
      </>
      break;
    case 4:
      formItem = <>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </div>
            )
          }}
        </Form.List>
      </>
      break;
    case 5:
      formItem = <>
        <Form.Item label="开始时间" name="startTime">
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
        <Form.Item label="星期" name="dow">
          <Select
            mode="multiple"
            placeholder="请选择星期"
            style={{ width: '70%' }}
          >
            {props.weekData.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </div>
            )
          }}
        </Form.List>
      </>
      break;
    case 6:
      formItem = <>
        <Form.Item label="开始时间" name="startTime" >
          <DatePicker showTime placeholder="请选择开始时间" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker showTime placeholder="请选择结束时间" />
        </Form.Item>
        <Form.Item label="启动时间" name="runTime">
          <TimePicker placeholder="请选择启动时间" />
        </Form.Item>
        <Form.Item label="日期" name="dom">
          <Select
            mode="multiple"
            placeholder="请选择日期"
            style={{ width: '70%' }}
          >
            {props.monthData.map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="patrolTime">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '巡检时间' : ''}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      noStyle
                    >
                      <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item style={{textAlign:"center"}}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add()
                    }}
                  >
                    <PlusOutlined />增加巡检时间
                  </Button>
                </Form.Item>
              </div>
            )
          }}
        </Form.List>
      </>
      break;
    default:
      formItem = null
  }

  const handleOk = () => {
    form.validateFields()
    .then(values=>{
      const patrolArr = values.patrolTime&&values.patrolTime.map(item=> item ? moment(item).format('HH:mm') : null)
      const params = {
        id: props.currentId,
        recurrence: values.recurrence,
        startTime: values.startTime ? moment(values.startTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        endTime: values.endTime ? moment(values.endTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        runTime: values.runTime ? moment(values.runTime).format('HH:mm:ss') : null,
        dom: values.dom ? values.dom.toString() : null,
        dow: values.dow ? values.dow.toString() : null,
        patrolTime: patrolArr
      }

      console.log(params)

      robotPlan.robotPlanEditTime(params)
      .then(res=>{
        message.success("周期编辑成功")
        props.handleCancel()
      })
      .catch(()=>{
        console.log("周期编辑失败")
      })
    })
  }

  return (
    <Modal
      getContainer={false}
      title="编辑周期(编辑后巡检计划次日生效)"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk= {handleOk}
      currentId={props.currentId}
      weekData={props.weekData}
      recurrenceData={props.recurrenceData}
      recurrence={props.recurrence}
      setDirty={props.setDirty}
    >
      <Form {...formItemLayout} form={form}>
        <Form.Item label="周期" name="recurrence" rules={[{required: true}]}>
          <Select placeholder="请选择周期"
            onChange={ value =>{
              setRecValue(value)
              form.resetFields(["startTime", "endTime", "runTime", "dom", "dow", "patrolTime"])
            }}
          >
            {
              props.recurrenceData.map(item=>
                <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
              )
            }
          </Select>
        </Form.Item>
        {formItem}
      </Form>
    </Modal>
  )
}

export default React.memo(CycleModal)
