import React, {useEffect, useState}from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment'
import { robotMaintain } from '../../api'

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

const { confirm } = Modal


const AddRecordModal = props => {
  const { getFieldDecorator, validateFields, resetFields } = props.form
  const [obj, setObj] = useState({})

  useEffect(() => {
    //查看详情
    if(props.visible===true && props.title === "编辑维护记录") {
      robotMaintain.robotMaintainDetail(props.currentId)
      .then((res) =>{
        if(res){
          setObj({
            ...res,
            startDate: moment(res.startDate),
            endDate: moment(res.endDate)
          })
        }
      })
    } else {
      resetFields()
    }
  }, [props.visible, props.currentId, resetFields, props.title])

  const showConfirm = (params) => {
    confirm({
      title: '是否确认完成维护，确认后设备维护信息不能修改',
      onOk() {
        if(props.title==="编辑维护记录") {
          robotMaintain.robotMaintainEdit(props.currentId, params)
          .then((res)=>{
            props.handleCancel()
            props.setDirty((dirty)=>dirty+1)
          })
        } else {
          if(props.addSingle === false) {
            robotMaintain.robotObjectMaintainAdd({...params, objectIds:props.objectIds.toString()})
            .then((res)=>{
              props.setDirty((dirty)=>dirty+1)
              props.handleCancel()
              resetFields()
            })
            .catch(error => {
              message.error("添加失败")
            })
          } else {
            robotMaintain.robotMaintainAdd({...params, robotObject:props.currentId})
            .then((res)=>{
              props.setDirty((dirty)=>dirty+1)
              props.handleCancel()
              resetFields()
            })
            .catch(error => {
              message.error("添加失败")
            })
          }
        }
      },
      onCancel() {},
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const params= {
          ...values,
          startDate: moment(new Date(values.startDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
          endDate: moment(new Date(values.endDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
        }
        showConfirm(params);
      }
    })
  }

  return (
    <Modal
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      currentId={props.currentId}
      objectIds={props.objectIds}
      setDirty={props.setDirty}
      addSingle={props.addSingle}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout}>
        <Form.Item label="开始时间">
          {getFieldDecorator('startDate', {
            rules: [{required: true}],
            initialValue: obj.startDate,
          })(<DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />)}
        </Form.Item>
        <Form.Item label="负责人">
          {getFieldDecorator('principal', {
            initialValue: obj.principal,
          })(<Input placeholder="请填写负责人"/>)}
        </Form.Item>
        <Form.Item label="完成时间">
          {getFieldDecorator('endDate', {
            rules: [{required: true}],
            initialValue: obj.endDate,
          })(<DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />)}
        </Form.Item>
        <Form.Item label="停用时长">
          {getFieldDecorator('stopTime', {
             initialValue: obj.stopTime,
          })(<Input placeholder="请填写停用时长"/>)}
        </Form.Item>
        <Form.Item label="处理人员">
          {getFieldDecorator('executor', {
            initialValue: obj.executor,
          })(<Input placeholder="请填写处理人员"/>)}
        </Form.Item>
        <Form.Item label="故障原因">
          {getFieldDecorator('why', {
          })(
            <Select placeholder="请选择故障原因" style={{ width:  "315px" }}>
              <Select.Option value="1">内部原因</Select.Option>
              <Select.Option value="2">外部原因</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="维护记录">
          {getFieldDecorator('maintenance', {
            initialValue: obj.maintenance,
          })(<Input.TextArea placeholder="请填写维护记录"/>)}
        </Form.Item>
        <Form.Item label="处理方案">
          {getFieldDecorator('dispose', {
            initialValue: obj.dispose,
          })(<Input.TextArea placeholder="请填写处理方案"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create()(AddRecordModal);
