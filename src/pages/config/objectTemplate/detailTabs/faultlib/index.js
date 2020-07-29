import React, { useState, useEffect, useContext } from 'react'
import { Row, Col, Button } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const Test = props => {
  const { objectClass,MyContext } = props
  const { objectFunctionTypeOption } = useContext(MyContext)

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

  useEffect(() => {
    setTable(configObjectTemplate.faultLibList, setData, setLoading, pager, setPager, [], { functionType: objectClass })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const columns = [
    {
      title: '功能类型描述',
      dataIndex: 'functionType',
      width:150,
      render:(text,record)=>{
        const item = objectFunctionTypeOption.find(obj => obj.code === text)
        if(item){
          return item.name
        }

      }
    },
    {
      title: '现象',
      dataIndex: 'descr',
      ellipsis: true
    },
    {
      title: '原因',
      dataIndex: 'reason',
      ellipsis: true
    },
    {
      title: '措施',
      dataIndex: 'action',
      ellipsis: true
    }
  ]



  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>故障知识库</h3></Col>
        { <Col><Button type="primary" onClick={() => { window.location.href=("/iomm/iomm/faultlibs/index" )}} style={{ marginRight: 20 }}>新建</Button></Col> }
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "id"
        }}
      />
    </React.Fragment>
  )
}

export default React.memo(Test)
