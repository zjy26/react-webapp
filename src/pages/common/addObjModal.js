import React, {useState} from 'react';
import { Modal, Form, Select, Button } from 'antd';

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
const AddObjModal = props => {
  const { getFieldDecorator } = props.form;
  const [selectedItems, setItems] = useState([]);
  const filteredOptions = objNameOption.filter(o => !selectedItems.includes(o));
  const selectChange = selectedItems => {
    setItems( selectedItems )
  };
  return (
    <Modal
      title="添加设备"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label="物理位置编码">
          {getFieldDecorator("objCode", {
            rules: [{required: true}],
          })(
            <span>
              <Select placeholder="请选择物理位置编码" style={{ width: '70%' }}>
                <Option value="1">35KV开关柜</Option>
                <Option value="2">股道</Option>
              </Select>
              <Button shape="circle" icon="plus"/>
              <Button shape="circle" icon="minus" />
            </span>
          )}
        </Form.Item>

        <Form.Item label="设备名称">
          {getFieldDecorator('objName', {
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

export default Form.create()(AddObjModal);