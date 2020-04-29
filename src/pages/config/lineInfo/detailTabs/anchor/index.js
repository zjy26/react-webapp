import React, { useState, useEffect, useContext } from 'react'
import { Button, Row, Col, Dropdown, Menu, Modal, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import AnchorModal from './modal'
import { setTable, commonTable } from '../../../../common/table'
import { configLocation } from '../../../../../api'

const Anchor = props => {
  const {MyContext} = props
  const {lineCode, intervalList} = useContext(MyContext)
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
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '锚段描述',
      dataIndex: 'descr'
    },
    {
      title: '锚段号',
      dataIndex: 'code'
    },
    {
      title: '锚段长度',
      dataIndex: 'length'
    },
    {
      title: '关联区间',
      dataIndex: 'interval',
      render: (text) => {
        const intervalArr = text.split(",")
        const intArr = intervalArr.map(item=> +item)
        const descrArr = intArr.map(item => {
          const data = intervalList.find(obj => obj.id === item)
          return "".concat(data ? data.descr : "")
        })
        return descrArr.join("，")
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button key="check" type="link" size={'small'} onClick={(e)=>{checkItem("check", record.id)}}>查看详情</Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="edit" onClick={(e)=>{checkItem("edit", record.id)}}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={(e)=>{deleteItem(record.id)}}>删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                <DownOutlined />
              </Button>
            </Dropdown>
          </span>
        )
      }
    }
  ]

  useEffect(() => {
    setTable(configLocation.configAnchorlList, setData, setLoading, pager, setPager, [], {line:lineCode})
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
        setModalProperty({title: "查看详情", type: "check", id: id})
    }
  }

  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        configLocation.configAnchorDelete(id)
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
        <Col><h3>锚段信息</h3></Col>
        <Col><Button type="danger" onClick={()=>checkItem("add", null)}>新建锚段</Button></Col>
      </Row>
      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }

      <AnchorModal {...{visible:visible, modalProperty, handleCancel, setDirty, MyContext}} />
    </React.Fragment>
  )
}

export default React.memo(Anchor)
