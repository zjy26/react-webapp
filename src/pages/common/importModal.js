import React from 'react';
import { Modal, Upload, Button, Icon, Row, Col } from 'antd';

const ImportModal = props => {
  return (
    <Modal
      title="文件导入"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Row>
        <Col span={4}><label>上传文件：</label></Col>
        <Col span={5}>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </Col>
        <Col span={6}>
          <Button type="link" size={'small'} style={{marginLeft:30}}>
            下载模板
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ImportModal;