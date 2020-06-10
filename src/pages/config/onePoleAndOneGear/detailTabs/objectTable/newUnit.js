import React, {useState, useEffect} from 'react'
import { Modal, Table, Checkbox,Button, Pagination, Row, message, Col } from 'antd'
import { connect } from 'react-redux'
import {overheadLine} from '../../../../../api/index'
import AddModal from './addModal'


const NewUnit = props => {
  const { MyContext} = props
  const {objId,template} = props
  const [data, setData] = useState([])
  const [dirty, setDirty] = useState([])
  const [isChecked, setChecked] = useState(false)//是否全选
  const [selectedCodes, setSelectedCodes] = useState([]);//已选择的codes
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [visible, setVisible] = useState(false)
  const [paging, setPaging] = useState({
    currentPage:1,
    pageSize: 10,
    total:0
  })

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage:page
    })
    setDirty(dirty+1)
  }
  const pageSizeChange = (current,pageSize) => {
      setPaging({
          ...paging,
          pageSize:pageSize
      })
      setDirty(dirty+1)
  }

  useEffect(()=>{
    if(objId){
      overheadLine.dynamicUnitTemplateList({template:template})
      .then(res =>{
        if(res && res.models){
          setPaging(paging => {
            const aa={
              ...paging,
              total:res.total
            }
            return aa
          })
          setData(res.models)
          setSelectedCodes([])
          setChecked(false)
          setAllCodes(res.models.map(item => {return(item.code)}))
        }
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objId,dirty,props.visible])

  const handleSubmit =  () => {
      if(selectedCodes){
        overheadLine.objectUnit({templateCodes:selectedCodes.toString(),d9OverheadLineObjectId:objId})
      .then(res => {
        if(res){
          message.success("新建成功")
          props.handleCancel()
          props.setDirty((dirty)=>dirty+1)
          props.renderChildData(true, objId,template)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
      }
    }

  const unitColumns = [
    // {
    //   title: '代码',
    //   dataIndex: 'code',
    //   hidden:true
    // },
    {
      title: '分类',
      dataIndex: 'clsName'
    },
    {
      title: '描述',
      dataIndex: 'descr'
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
    // {
    //   title: '元器件编号',
    //   dataIndex: 'componentNumber',
    //   hidden:true
    // },
    {
      title: '设计寿命',
      dataIndex: 'designLife'
    },
    {
      title: '更换年限',
      dataIndex: 'replaceLife'
    },
    {
      title: '关键部件',
      dataIndex: 'criticality',
      render: text => {
        const descr = text === 1 ? "是" : "否"
        return descr
      }
    },
    {
      title: '变比一次参数',
      dataIndex: 'transRatio1'
    },
    {
      title: '变比两次参数',
      dataIndex: 'transRatio2'
    },
    {
      title: '制造商',
      dataIndex: 'manufactName'
    }
    // ,
    // {
    //   title: 'E码/订货编号',
    //   dataIndex: 'ecode',
    //   hidden:true
    // }
  ]

  const addUnit = () => {
    setVisible(true)
  }

  const handleCancel = ()=>{
    setVisible(false)
  }

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

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="新增部件"
      okText="确认"
      cancelText="取消"
      width="1600px"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
    >
    <Col span={23} style={{textAlign:"right"}}>
        <Button type="danger" onClick={addUnit} hidden>新建</Button>
    </Col>
    <Table columns={unitColumns}
      rowSelection={rowSelection}
          dataSource = {data}
          rowKey="code" defaultExpandedRowKeys={[1]} pagination={false}/>
    <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
        <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
        </Col>
        <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
      </Row>
      <AddModal {...{visible: visible, handleCancel, MyContext, template, setDirty}} />
    </Modal>

  )
}
const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}

export default connect(mapStateToProps, null)(React.memo(NewUnit))
