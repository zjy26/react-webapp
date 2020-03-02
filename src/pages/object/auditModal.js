import React from 'react';
import { Modal, Timeline } from 'antd';

const AuditModal = props => {
  return (
    <Modal
      title="审计"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Timeline>
        <Timeline.Item>
          <p>2019-09-01 09:00陈九九</p>
          <p>操作内容……</p>
        </Timeline.Item>
        <Timeline.Item>
          <p>2019-10-01 09:00陈九九</p>
          <p>操作内容……</p>
        </Timeline.Item>
        <Timeline.Item color="gray">
          <p>2019-11-01 09:00陈九九</p>
          <p>操作内容……</p>
        </Timeline.Item>
        <Timeline.Item color="gray">
          <p>2019-12-01 09:00陈九九</p>
          <p>操作内容……</p>
        </Timeline.Item>
      </Timeline>
    </Modal>
  )
}

export default AuditModal;