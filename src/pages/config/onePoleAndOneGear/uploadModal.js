import React from 'react'
import { Modal, Upload, Icon, Row, Col } from 'antd'

const UploadModal = props => {
  return (
    <Modal
      maskClosable={false}
      title="上传附件"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Row>
        <Col span={4}><label>附件：</label></Col>
        <Col span={20}>
          <Upload
            listType="picture-card"
          >
            <Icon type="plus" />
          </Upload>
          <div>不超过20M,格式为jpg，png</div>
        </Col>
      </Row>
    </Modal>
  )
}

export default React.memo(UploadModal)
