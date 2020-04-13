import React, { useState } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Select } from 'antd';
import { robotPlan } from '../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const {Option} = Select;
const objNameOption = ['一号变压器', '二号变压器'];
const AddObjModal = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [obj, setObj] = useState({})
  const [selectedItems, setItems] = useState([]);
  const filteredOptions = objNameOption.filter(o => !selectedItems.includes(o));
  const selectChange = selectedItems => {
    setItems( selectedItems )
    setObj({...obj, objects: selectedItems })
  };

  const handleOk = e =>{
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        robotPlan.robotPlanObjList()
        .then(res=>{
          props.setRobotObjList(res.robotPlanLocObjs)
          props.handleCancel()
        })
        .catch(err=>{
          console.log("设备添加失败")
        })
      }
    })
  }

  return (
    <Modal
      title="添加设备"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleOk}
      site={props.site}
      setRobotObjList = {props.setRobotObjList}
    >
      <Form {...formItemLayout}>
        <Form.Item label="物理位置编码">
          {getFieldDecorator("robotPatrolLoc", {
            initialValue: obj.robotPatrolLoc,
            rules: [{required: true}],
          })(
            <span>
              <Select placeholder="请选择物理位置编码" style={{ width: '70%' }}
                onChange={(value)=>{
                  setObj({...obj, robotPatrolLoc: value })
                }}
              >
                <Option value="1">35KV开关柜</Option>
                <Option value="2">股道</Option>
              </Select>
            </span>
          )}
        </Form.Item>

        <Form.Item label="设备名称">
          {getFieldDecorator('objects', {
            initialValue: obj.objects,
            rules: [{required: true}],
          })(
            <span>
              <Select
                mode="multiple"
                placeholder="请选择设备名称"
                value={selectedItems}
                onChange={selectChange}
              >
                {filteredOptions.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </span>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(Form.create()(AddObjModal))