import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Pagination, Table, Button } from 'antd'
import { overheadLine } from '../../../../../api'
import moment from 'moment'
import AddTestModal from './modal'

const TestingRecord = props => {
  const { MyContext, setBase } = props
  const { overheadLineDebugItemOption, code } = useContext(MyContext)

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [data, setData] = useState([])
  const [paging, setPaging] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage: page
    })
    setDirty(dirty + 1)
  }
  const pageSizeChange = (current, pageSize) => {
    setPaging({
      ...paging,
      pageSize: pageSize
    })
    setDirty(dirty + 1)
  }

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'item',
      render: (text, record) => {
        if (overheadLineDebugItemOption) {
          const item = overheadLineDebugItemOption.find(obj => obj.code === record.item)
          if (item)
            return item.name
        }
      }
    },
    {
      title: '原始值',
      dataIndex: 'oldValue'
    },
    {
      title: '原改后值',
      dataIndex: 'value'
    },
    {
      title: '填写日期',
      dataIndex: 'date',
      render: (text, record) => {
        return (
          text ? moment(text).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '填写人',
      dataIndex: 'people'
    }
  ]

  useEffect(() => {
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    let currentPage = paging.currentPage
    overheadLine.overheadLineDebugList({ page: currentPage, start: start, limit: pageSize, code: code })
      .then(res => {
        if (res && res.models) {
          setPaging(paging => {
            const aa = {
              ...paging,
              total: res.total
            }
            return aa
          })
          setData(res.models)
          setLoading(false)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //新建编辑
  const check = (type, id) => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>调试记录</h3></Col>
        <Col><Button type="primary" onClick={() => { check("add", null) }} style={{ marginRight: 20 }}>新建</Button></Col>
      </Row>
      <Table columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id" defaultExpandedRowKeys={[1]} pagination={false} />
      <Row type="flex" justify="end" style={{ margin: 30 }}>
        <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
      </Row>
      <AddTestModal {...{ visible, setDirty, setBase, MyContext, handleCancel }} />
    </React.Fragment>

  )
}

export default React.memo(TestingRecord)
