import React, { useState, useEffect, useContext } from 'react'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { Modal, Button, Row, Col, message, Divider } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import CheckTestModal from './modal'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const Test = props => {
  const { MyContext } = props
  const { templateCode } = useContext(MyContext)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
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

  useEffect(() => {
    setTable(configObjectTemplate.testTemplateList, setData, setLoading, pager, setPager, [], { template: templateCode })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '属性名称',
      dataIndex: 'descr'
    },
    {
      title: '属性代码',
      dataIndex: 'property'
    },
    {
      title: '属性说明',
      dataIndex: 'alias',
      ellipsis: true
    },
    {
      title: '标准值',
      dataIndex: 'stdValue'
    },
    {
      title: '计量单位',
      dataIndex: 'uomDesc'
    },
    {
      title: '动作时限',
      dataIndex: 'actTimeLimit'
    },
    {
      title: '动作计量单位',
      dataIndex: 'actUom'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <FormOutlined onClick={() => { check("edit", record.id) }} />
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]

  const handleCancel = () => {
    setVisible(false)
  }

  //新建编辑
  const check = (type, id) => {
    setVisible(true)
    setModalProperty({ title: type === "add" ? "新建" : "编辑", type: type, id: id })
  }

  //列表删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        configObjectTemplate.testTemplateDelete(id)
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>试验数据</h3></Col>
        <Col><Button type="primary" onClick={() => { check("add", null) }} style={{ marginRight: 20 }}>新建</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "sn"
        }}
      />

      <CheckTestModal {...{ visible, handleCancel, modalProperty, setDirty, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(Test)
