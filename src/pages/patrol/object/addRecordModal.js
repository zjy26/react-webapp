import React, {useEffect, useState}from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment'
import { robotMaintain } from '../../../api'

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
  const [form] = Form.useForm()
  const [setObj] = useState({})

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
      form.resetFields()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, props.currentId, form.resetFields, props.title])

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
            robotMaintain.robotObjectMaintainAdd({...params, objectIds:props.selectedCodes.toString()})
            .then((res)=>{
              props.setDirty((dirty)=>dirty+1)
              props.handleCancel()
              form.resetFields()
            })
            .catch(error => {
              message.error("添加失败")
            })
          } else {
            robotMaintain.robotMaintainAdd({...params, robotObject:props.currentId})
            .then((res)=>{
              props.setDirty((dirty)=>dirty+1)
              props.handleCancel()
              form.resetFields()
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

  const handleSubmit = () => {
    form.validateFields()
    .then(values=>{
      const params= {
        ...values,
        startDate: moment(new Date(values.startDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
        endDate: moment(new Date(values.endDate), 'YYYY-MM-DD HH:mm:ss').valueOf(),
      }
      showConfirm(params);

  })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      currentId={props.currentId}
      objectIds={props.selectedCodes}
      setDirty={props.setDirty}
      addSingle={props.addSingle}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
      <Form {...formItemLayout} form={form} name="addRecordFrom">
        <Form.Item label="开始时间" name='startDate' rules={[{required: true, message: '请选择开始时间'}]}>
          <DatePicker showTime placeholder="请选择开始时间" style={{width: "315px"}} />
        </Form.Item>
        <Form.Item label="负责人" name="principal">
          <Input placeholder="请填写负责人"/>
        </Form.Item>
        <Form.Item label="完成时间" name="endDate" rules={[{required: true, message: '请选择完成时间'}]}>
          <DatePicker showTime placeholder="请选择完成时间" style={{width: "315px"}} />
        </Form.Item>
        <Form.Item label="停用时长" name="stopTime">
          <Input placeholder="请填写停用时长"/>
        </Form.Item>
        <Form.Item label="处理人员" name="executor">
          <Input placeholder="请填写处理人员"/>
        </Form.Item>
        <Form.Item label="故障原因" name="why">
            <Select placeholder="请选择故障原因" style={{ width:  "315px" }}>
              <Select.Option value="1">内部原因</Select.Option>
              <Select.Option value="2">外部原因</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item label="维护记录" name="maintenance">
          <Input.TextArea placeholder="请填写维护记录"/>
        </Form.Item>
        <Form.Item label="处理方案" name="dispose">
          <Input.TextArea placeholder="请填写处理方案"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo((AddRecordModal))
