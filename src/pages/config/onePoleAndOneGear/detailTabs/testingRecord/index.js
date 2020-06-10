import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Pagination, Table } from 'antd'
import { overheadLine } from '../../../../../api'
import { moment } from 'moment'


const TestingRecord = props  => {
  const {MyContext} = props
  const { overheadLineDebugItemOption,id} = useContext(MyContext)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'item',
      render: (text, record) => {
        if(overheadLineDebugItemOption) {
          const item = overheadLineDebugItemOption.find(obj=>obj.code===record.item)
          if(item)
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
      render: (text, record) =>{
        return (
          text ? moment(record.startDate).format('YYYY-MM-DD') : ''
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
    overheadLine.overheadLineDebugList({page:currentPage,start:start,limit:pageSize,code:id})
    .then(res => {
      if(res){
        setPaging(paging => {
          const aa={
            ...paging,
            total:res.total
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
  },[])

  return (
    <React.Fragment>
      <Col style={{paddingRight: 20}}><h3>调试记录</h3></Col>
      <Table columns={columns}
          dataSource = {data}
          loading={loading}
          rowKey="id" defaultExpandedRowKeys={[1]} pagination={false}/>
      <Row type="flex" justify="end" style={{margin:30}}>
            <Col><Pagination showSizeChanger showQuickJumper /></Col>
          </Row>
    </React.Fragment>
  )
}

export default React.memo(TestingRecord)
