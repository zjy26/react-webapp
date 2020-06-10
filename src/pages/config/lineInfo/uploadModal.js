import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload, Button, Row, Col } from 'antd'

const UploadModal = props => {
  return (
    <Modal
      maskClosable={false}
      title={props.title}
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      {
        props.title === "上传附件" ?
          <Row>
            <Col span={4}><label>附件：</label></Col>
            <Col span={20}>
              <Upload>
                <Button>上传附件</Button>
              </Upload>
            </Col>
          </Row> :
          <Row>
            <Col span={4}><label>图形：</label></Col>
            <Col span={20}>
              <Upload
                listType="picture-card"
              >
                <PlusOutlined />
              </Upload>
            </Col>
          </Row>
      }
    </Modal>
  );
}

export default React.memo(UploadModal)
