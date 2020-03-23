import React, {useState} from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Button, Icon, message } from 'antd'
import moment from "moment"
import { robotPlan } from '../../api'
import styles from './PatrolPlan.module.scss'

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

let id = 0
const CycleModal = props => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields } = props.form
  const [recValue, setRecValue] = useState(props.recurrence)

  //删除巡检时间
  const remove = k => {
    const keys = getFieldValue('keys');
    if (keys.length === 1) {
      return
    }
    setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  //增加巡检时间
  const add = () => {
    const keys = getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    setFieldsValue({
      keys: nextKeys,
    })
  }

  getFieldDecorator('keys', { initialValue: [] })
  const keys = getFieldValue('keys');
  const patrolTimeItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? '巡检时间' : ''}
      required={false}
      key={k}
    >
      {getFieldDecorator(`patrolTime[${k}]`)(
        <TimePicker format={"HH:mm"} placeholder="请选择巡检时间" />
      )}
      {keys.length > 1 ? (
        <Icon
          type="minus-circle-o"
          className={styles.dynamicBtn}
          onClick={() => remove(k)}
        />
      ) : null}
    </Form.Item>
  ))

  let formItem = null
  const selectRecValue = recValue ? recValue : props.recurrence
  switch (selectRecValue) {
    case 2:
      formItem = <Form.Item label="开始时间">
        {getFieldDecorator('startTime')(
          <DatePicker showTime placeholder="请选择开始时间" />
        )}
      </Form.Item>
      break;
    case 3:
      formItem = <div>
        <Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item>
        <Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item>
      </div>
      break;
    case 4:
      formItem = <div>
        <Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item>
        <Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item>
        {patrolTimeItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <Icon type="plus" />增加巡检时间
          </Button>
        </Form.Item>
      </div>
      break;
    case 5:
      formItem = <div>
        <Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item>
        <Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item>
        <Form.Item label="星期">
          {getFieldDecorator('dow')(
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
          )}
        </Form.Item>
        {patrolTimeItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <Icon type="plus" />增加巡检时间
          </Button>
        </Form.Item>
      </div>
      break;
    case 6:
      formItem = <div>
        <Form.Item label="开始时间">
          {getFieldDecorator('startTime')(
            <DatePicker showTime placeholder="请选择开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime')(
            <DatePicker showTime placeholder="请选择结束时间" />
          )}
        </Form.Item>
        <Form.Item label="启动时间">
          {getFieldDecorator('runTime')(
            <TimePicker placeholder="请选择启动时间" />
          )}
        </Form.Item>
        <Form.Item label="日期">
          {getFieldDecorator('dom')(
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
          )}
        </Form.Item>
        {patrolTimeItems}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={add} style={{ width: '30%' }}>
            <Icon type="plus" />增加巡检时间
          </Button>
        </Form.Item>
      </div>
      break;
    default:
      formItem = null
  }

  const handleOk = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const hour2s = []
        const minute2s = []
        if(values.patrolTime && values.patrolTime.length>0) {
          const newArr = values.patrolTime.filter(item => item)
          if(newArr.length>0) {
            const timeArr = newArr.map(item=>moment(item).format('HH:mm'))
            timeArr.forEach(item=>{
              hour2s.push(item.slice(0, 2))
              minute2s.push(item.slice(3, 5))
            })
          }
        }

        const params = {
          id: props.currentId,
          recurrence: values.recurrence,
          startTime: values.startTime ? moment(values.startTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
          endTime: values.endTime ? moment(values.endTime , 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
          hour: values.runTime ? moment(values.runTime).format('HH:mm:ss').slice(0,2) : null,
          minute: values.runTime ? moment(values.runTime).format('HH:mm:ss').slice(3,5) : null,
          second: values.runTime ? moment(values.runTime).format('HH:mm:ss').slice(6,8) : null,
          dom: values.dom ? values.dom.toString() : null,
          dow: values.dow ? values.dow.toString() : null,
          hour2s: values.patrolTime ? hour2s.toString() : null,
          minute2s: values.patrolTime ? minute2s.toString() : null,
        }
        robotPlan.robotPlanEditTime(params)
        .then(res=>{
          message.success("周期编辑成功")
        })
        .catch(err=>{
          console.log("周期编辑失败")
        })
      }
    })
  }

  return (
    <Modal
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
      <Form {...formItemLayout}>
        <Form.Item label="周期">
          {getFieldDecorator('recurrence', {
            initialValue: props.recurrence,
            rules: [{required: true}],
          })(
            <Select placeholder="请选择周期"
              onChange={value =>{
                setRecValue(value)
                resetFields()
              }
            }>
              {
                props.recurrenceData.map(item=>
                  <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                )
              }
            </Select>
          )}
        </Form.Item>
        {formItem}
      </Form>
    </Modal>
  )
}

export default React.memo(Form.create()(CycleModal))
