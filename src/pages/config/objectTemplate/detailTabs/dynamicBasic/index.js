import React, { useState, useEffect, useContext } from 'react'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { Modal, Button, Row, Col, message, Divider } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import CheckModal from './modal'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const DynamicBasic = props => {
  const { MyContext } = props
  const { templateCode, paramsNameOption } = useContext(MyContext)

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
    setTable(configObjectTemplate.dynamicBaseList, setData, setLoading, pager, setPager, [], { template: templateCode })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      render: (text) => {
        const item = paramsNameOption.find(obj => obj.code === text)
        if(item) {
          return item.name
        } else {
          return text
        }
      }
    },
    {
      title: '数值',
      render: (_, record) => {
        if(record.style === "01") {
          return record.value
        } else {
          return `${record.param1}/${record.param2}`
        }
      }
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
        configObjectTemplate.dynamicBaseDelete(id)
          .then((res) => {
            if(res.success) {
              message.success("删除成功")
              setDirty((dirty) => dirty + 1)
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
        <Col><h3>动态基础信息</h3></Col>
        <Col><Button type="primary" onClick={() => { check("add", null) }} style={{ marginRight: 20 }}>新建</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "id"
        }}
      />

      <CheckModal {...{ visible, handleCancel, modalProperty, setDirty, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(DynamicBasic)
