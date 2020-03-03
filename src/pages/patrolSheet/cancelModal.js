import React from 'react';
import { Modal, Input } from 'antd';

const CancelModal = props => {
  return (
    <Modal
      title="取消巡检"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Input.TextArea placeholder="请输入取消巡检原因"/>
    </Modal>
  )
}

export default CancelModal;