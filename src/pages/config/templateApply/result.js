import React from 'react'
import { Modal, Table, Button, Row, Col } from 'antd'
import { connect } from 'react-redux'


const Result = props => {
  const { result } = props

  const handleCancel = () => {
    props.handleCancel()
  }

  const unitColumns = [
    {
      title: '设备名称',
      dataIndex: 'object'
    },
    {
      title: '更换失败原因',
      dataIndex: 'err'
    }
  ]

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="更换结果"
      method="warning"
      width="600px"
      footer={[<Button type="danger" ghost key="back" onClick={handleCancel}>知道了</Button>]}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <div style={{ padding: '16px', background: '#fff' }}>本次共更换{result.totalNum}条数据,其中{result.successNum}条更换成功，{result.errNum}条更换失败</div>
      {result.errNum?<Table columns={unitColumns}
        dataSource={result.errList}
        rowKey="code" defaultExpandedRowKeys={[1]} pagination={false} />:null}

      <Row type="flex" justify="space-between" style={{ margin: 30 }}>
        <Col>
        </Col>
      </Row>
    </Modal>

  )
}
const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}

export default connect(mapStateToProps, null)(React.memo(Result))
