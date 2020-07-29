import React, { useState, useEffect } from 'react'
import { Modal, Table } from 'antd'
import { configObjectTemplate } from '../../../../api/config/objectTemplate'

const Apply = props => {
  const { modalProperty, visible, handleCancel, location } = props

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    if (visible === true) {
      setLoading(true)
      configObjectTemplate.templateApply({objectTemplate: modalProperty.templateCode})
      .then(res => {
        if(res && res.models) {
          setData(res.models)
          setLoading(false)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'desc'
    },
    {
      title: '编码',
      dataIndex: 'code'
    },
    {
      title: '线路',
      render: (_, record) => {
        if (location && location.line) {
          const item = location.line.find(obj => obj.value === record.site.slice(0, 4))
          if (item)
            return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (_, record) => {
        if (location && location.site) {
          const item = location.site.find(obj => obj.value === record.site)
          if (item)
            return item.label
        }
      }
    },
    {
      title: '分类',
      dataIndex: 'functionalType',
      render: (_, record) => record._displayName.functionalType
    },
    {
      title: '品牌',
      dataIndex: 'brdName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    }
  ]

  return (
    <React.Fragment>
      <Modal
        maskClosable={false}
        title="应用范围"
        width={800}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Table rowKey="id" loading={loading} columns={columns} dataSource={data} pagination={false} scroll={{ y: 400 }} />
      </Modal>
    </React.Fragment>
  )
}

export default React.memo(Apply)
