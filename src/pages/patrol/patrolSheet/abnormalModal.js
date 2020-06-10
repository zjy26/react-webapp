import React, { useState, useEffect } from 'react';
import { Modal, Table, Row, Col, Checkbox, Button, Pagination, message } from 'antd';
import { patrolSheet } from '../../../api'

const AbnormalModal = props => {
  const [data, setData] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(0);
  const [selectedCodes, setSelectedCodes] = useState([]);//已选择的codes
  const [isChecked, setChecked] = useState(false)//是否全选
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })

  //列表条目
  const columns = [
    {
      title: '物理位置编码',
      dataIndex: 'locationCode',
      render:(text,record) => {
        return(
          record.robotPatrolLocDesc
        )
      }
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentCode',
      render:(text,record) => {
        return(
          record.objDesc
        )
      }
    },
    {
      title: '属性',
      dataIndex: 'propertyDesc',
    },
    {
      title: '巡检数据',
      dataIndex: 'patrolResult',
    },
    {
      title: '预设值',
      dataIndex: 'settingValue',
    },
    {
      title: 'CIOS对应值',
      dataIndex: 'cios',
    },
    {
      title: '巡检结果',
      dataIndex: 'isError',
      render: (text, record) => {
        return (
          record.isError ? '正常' : String(record.isError) === 'false' ? '异常' : '--'
        )
      }
    },
    {
      title: '人工确定',
      dataIndex: 'isSure',
      render: (text, record) => {
        return (
          record.isSure ? '正常' : String(record.isSure) === 'false' ? '异常' : '--'
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (index, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={(e)=>{manualConfirmed(record.code,e)}} value={false}>异常</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={(e)=>{manualConfirmed(record.code,e)}} value={true}>正常</Button>
          </span>
        )
      }
    }
  ];
  //列表逐条数据选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCodes(selectedRowKeys);
      if(selectedRowKeys.length === allCodes.length){//全选了
        setChecked(true);
      }else{
        setChecked(false)
      }
    },
    selectedRowKeys:selectedCodes
  }

  const onCheckBox = (event ) => {
    if(event.target.checked){
      setSelectedCodes(allCodes)
      setChecked(true)
    }else{
      setSelectedCodes([])
      setChecked(false)
    }
  }

  const manualConfirmed = (id, e) => {
    const manualValue = e.target.value
    const codeStr = (id === 0 ? selectedCodes.join(",") : id)
    if(codeStr){
      patrolSheet.patrolSheetManual({codes:codeStr,isSureString:manualValue})
      .then((res) =>{
        if(JSON.parse(manualValue)){
          message.info('已人为判断为正常')
        }else{
          message.info('已人为判断为异常')
        }
        setDirty((dirty)=> dirty+1)
      })
      .catch(() => {
        message.warning('变更失败')
      })
    }else{
      return
    }

  }

  const pageNumberOnChange = (page) => {
    setPaging(paging => {
      const newPaging = {
        ...paging,
        currentPage:page
      }
      return newPaging
    })
    setDirty(dirty+1)
  }
  const pageSizeChange = (current,pageSize) => {
    setPaging(paging => {
      const newPaging = {
        ...paging,
        pageSize:pageSize
      }
      return newPaging
    })
    setDirty(dirty+1)
  }
  //获取列表数据
  useEffect(() => {
    setLoading(true)
    //列表数据
    patrolSheet.patrolSheetError({
      page:paging.currentPage,
      start:(paging.currentPage - 1) * paging.pageSize,
      limit:paging.pageSize,
      id:props.currentId
    })
    .then(res => {
      setSelectedCodes([])
      setChecked(false)
      setAllCodes(res.models.map(item => {return(item.code)}))
      setData(res.models)
      setPaging(paging => {
        const newPaging = {
          ...paging,
          total:res.total
        }
        return newPaging
      })
      setLoading(false)
    })
    .catch(() => {
      setLoading(true);
      console.log("列表数据加载失败")
    })
  }, [dirty,props.currentId,paging.currentPage,paging.pageSize]);

  return (
    <Modal
      title="异常数据"
      okText="确认"
      cancelText="取消"
      width = "1080px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} rowKey="code" pagination={false} loading={loading}/>
      <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
          <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
          <Button type="danger" ghost value={false} onClick={(e)=>{manualConfirmed(0,e)}}>异常</Button>
          <Button type="danger" ghost value={true} onClick={(e)=>{manualConfirmed(0,e)}}>正常</Button>
        </Col>
        <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
      </Row>
    </Modal>
  )
}

export default AbnormalModal;
