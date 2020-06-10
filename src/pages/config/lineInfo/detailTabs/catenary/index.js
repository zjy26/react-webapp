import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Modal, message, Divider } from 'antd'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import CatenaryModal from './modal'
import { setTable, MainTable } from '../../../../common/table'
import { configLocation } from '../../../../../api/config/lineInfo'

const Catenary = props => {
  const { lineCode, MyContext, entity } = props
  const [data, setData] = useState([])  //列表数据
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})

  const clsArr = []
  entity.classOption.map(data => {
    return clsArr.push(...data.children)
  })

  const columns = [
    {
      title: '设备分类',
      dataIndex: 'clsDesc'
    },
    {
      title: '品牌',
      dataIndex: 'brandName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '规格',
      dataIndex: 'spec'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <FormOutlined onClick={(e) => { checkItem("edit", record.id) }} />
            <Divider type="vertical" />
            <DeleteOutlined onClick={(e) => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    setTable(configLocation.configCatenaryList, setData, setLoading, pager, setPager, [], { level: 4, line: lineCode })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //关闭弹窗
  const handleCancel = () => setVisible(false)

  const checkItem = (type, id) => {
    setVisible(true)
    switch (type) {
      case "add":
        setModalProperty({ title: "新建", type: "add", id: null })
        break;
      case "edit":
        setModalProperty({ title: "编辑", type: "edit", id: id })
        break;
      default:
    }
  }

  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        configLocation.configCatenaryDelete(id)
          .then((res) => {
            if (res.success === true) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
            } else {
              message.error("删除失败!")
            }
          })
      },
      onCancel() {
      },
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>设备信息</h3></Col>
        <Col><Button type="primary" onClick={() => checkItem("add", null)} style={{ marginRight: 20 }}>新建设备</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "id",
        }}
      />

      <CatenaryModal {...{ visible: visible, modalProperty, handleCancel, setDirty, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(Catenary)
