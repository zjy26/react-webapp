import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, message } from 'antd'
import { upload } from '../../../api/index'
import { EditUpload } from '../../common/upload'

const UploadModal = props => {
  const { uploadProperty, visible, handleCancel } = props
  const [fileList, setFileList] = useState({
    lineInfoHt: [],
    lineInfo: []
  })
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if(visible) {
      setOkLoading(false)
      setFileList({
        lineInfoHt: [],
        lineInfo: []
      })
    }
  }, [visible])

  const handleOk = () => {
    setOkLoading(true)
    const ids = []
    for (var i in fileList) {
      fileList[i].forEach(item => {
        if(item.status === "done") {
          ids.push(item.uid)
        }
      })
    }

    upload({
      ids: ids.toString(),
      record: uploadProperty.record
    })
    .then(res => {
      if(res && res.success) {
        message.success("上传成功")
        handleCancel()
      } else {
        message.error("上传失败")
        setOkLoading(false)
      }
    })
  }

  return (
    <Modal
      maskClosable={false}
      title={uploadProperty.title}
      okText="确认"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: okLoading }}
    >
      {
        uploadProperty.title === "上传附件" ?
          <Row>
            <Col span={4}><label>附件：</label></Col>
            <Col span={20}>
              <EditUpload
                model = 'lineInfo'
                fileList = {fileList.lineInfo}
                setFileList = {setFileList}
                option = "lineInfo"
              />
            </Col>
          </Row> :
          <Row>
            <Col span={4}><label>图形：</label></Col>
            <Col span={20}>
              <EditUpload
                model = 'lineInfo-ht'
                fileList = {fileList.lineInfoHt}
                setFileList = {setFileList}
                option = "lineInfoHt"
              />
            </Col>
          </Row>
      }
    </Modal>
  );
}

export default React.memo(UploadModal)
