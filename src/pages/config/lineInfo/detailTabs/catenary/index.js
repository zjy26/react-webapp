import React, { useState, useEffect } from 'react'
import { Button, Row, Col, Modal, message } from 'antd'
import CatenaryModal from './modal'
import { setTable, commonTable } from '../../../../common/table'
import { configLocation } from '../../../../../api'

const Catenary = props => {
  const {lineCode, MyContext, entity} = props
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

  const columns = [
    {
      title: '设备分类',
      dataIndex: 'cls',
      render: (text) => {
        const item = entity.classOption.find(obj => obj.code === text)
        if(item) {
          return item.desc
        }
      }
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      render: (text) => {
        const item = entity.brandOption.find(obj => obj.code === text)
        if(item) {
          return item.name
        }
      }
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
          <span>
            <Button type="link" size={'small'} onClick={(e)=>{checkItem("edit", record.id)}}>编辑</Button> &nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={(e)=>{deleteItem(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]

  useEffect(() => {
    setTable(configLocation.configCatenaryList, setData, setLoading, pager, setPager, [], {level: 4, line:lineCode})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //关闭弹窗
  const handleCancel = () => setVisible(false)

  const checkItem = (type, id) => {
    setVisible(true)
    switch (type) {
      case "add":
        setModalProperty({title: "新建", type: "add", id: null})
        break;
      case "edit":
        setModalProperty({title: "编辑", type: "edit", id: id})
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
      onOk: ()=> {
        configLocation.configCatenaryDelete(id)
        .then((res) =>{
          if(res.success === true) {
            message.success("删除成功")
            setDirty((dirty)=> dirty+1)
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
        <Col><Button type="danger" onClick={()=>checkItem("add", null)}>新建设备</Button></Col>
      </Row>
      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }

      <CatenaryModal {...{visible:visible, modalProperty, handleCancel, setDirty, MyContext}} />
    </React.Fragment>
  )
}

export default React.memo(Catenary)
