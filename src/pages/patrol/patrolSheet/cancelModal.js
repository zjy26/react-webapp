import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { patrolSheet } from '../../../api'

const CancelModal = props => {
  const [cancelReason,setCancelReason] = useState("");
  const handleOk = () => {
    if(cancelReason.match(/^\s*$/)){
      message.warning('请填写巡检取消原因')
    }else{
      let {people,...params} = props.currentId
      patrolSheet.patrolSheetUpdate(params.id, {
          id:params.id,
          cancelReason:cancelReason,
          patrolStatus:'Close'
        })
      .then((res)=>{
        setCancelReason("")
        props.handleCancel()
        message.success('巡检取消成功')
        props.setDirty((dirty)=>dirty+1)
      })
    }
  }

  return (
    <Modal
      title="取消巡检"
      okText="确认"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleOk}
    >
      <Input.TextArea
        placeholder="请输入取消巡检原因"
        onChange={event => {setCancelReason(event.target.value)}}
        autoSize={{ minRows: 8, maxRows: 12 }}
        maxLength={200}
        value={cancelReason}
      />
    </Modal>
  )
}

export default CancelModal;
