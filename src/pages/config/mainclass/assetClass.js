/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { Modal, Row, Dropdown, Menu, Col, Button, Table, message, Divider } from 'antd'
import ClassModal from './classModal'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import { ExclamationCircleOutlined, RightOutlined, DownOutlined, DeleteOutlined, FormOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { assetClass } from '../../../api'
import { connect } from 'react-redux'
import commonStyles from '../../Common.module.scss'


const ObjectClass = props => {
  const user = props.user.toJS();
  const [visible, setVisible] = useState({
    showClass: false,
    showAudit: false,
    showImport: false
  })
  const [dirty, setDirty] = useState(0)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [modalTitle, setModalTitle] = useState("添加")
  const [currentId, setCurrentId] = useState(0)
  const [parItem, setParItem] = useState({})
  let level = 1;
  const find = (arr, id) => {
    arr.forEach((item) => {
      level +=1;
      if(item["children"].find(value => value["id"]===id)){
        setParItem({item:item,level:level})
        return item
      }
      else if(item.children.length > 0){
        find(item.children, id)
      }
    })
  }

  const handleCancel = () => {
    setVisible({
      showClass: false,
      showAudit: false,
      showImport: false
    });
  }

  //新建
  const newModal = (record, option) => {
    setModalTitle(option ? '编辑' : '添加')
    record["edit"]=option
    setCurrentId(record)
    level = 1
    find(data, record.id)
    setVisible({
      ...visible,
      showClass: true
    });
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认提示',
      icon: <ExclamationCircleOutlined />,
      content: '是否删除此层级，删除后所属子级会一起删除，且数据不能恢复？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        assetClass.deleteClassifiaction(id, {_method:"DELETE"})
        .then(res =>{
          if(res.actionErrors && res.actionErrors.length){
            message.error(res.actionErrors[0])
          }else{
            message.success('删除成功')
          }
          setDirty(dirty => dirty+1)
        })
      },
      onCancel() {
      },
    })
  }
  //列表条目
  const columns = [
    {
      title: '设备分类名称',
      width: '50%',
      dataIndex: 'text'
    },
    {
      title: '编码',
      ellipsis: true,
      dataIndex: 'code',
      render: (text, record) => {
        return (
          record.model.code ? record.model.code : ''
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
      render: (text, record) => {
        return (
          record.model.remarks ? record.model.remarks : ''
        )
      }
    },
    {
      width:'15%',
      title: '操作',
      align: 'center',
      render: (text, record) => {
        const addIcon = record['readOnly'] && !record['canCreate'] ? <Button type="link" disabled style={{padding:0,margin:0,border:"none"}}><PlusSquareOutlined/></Button> :  <PlusSquareOutlined  onClick={()=>{newModal(record,false)}}/>
        const editIcon = record['readOnly'] ? <Button type="link" disabled style={{padding:0,margin:0,border:"none"}}><FormOutlined/></Button> : <FormOutlined onClick={()=>{newModal(record,true)}}/>
        const deleteIcon = record['readOnly'] ? <Button type="link" disabled style={{padding:0,margin:0,border:"none"}}><DeleteOutlined/></Button> : <DeleteOutlined onClick={()=>{handleDelete(record.id)}}/>
        return(
          <>
            {addIcon}
            <Divider type="vertical" />
            {editIcon}
            <Divider type="vertical" />
            {deleteIcon}
          </>
        )
      }
    }
  ];
  //获取列表数据
  useEffect(() => {
    document.title = "设备分类"
    setLoading(true)
    assetClass.objectClassList({org:user.org})
    .then(res => {
      if(res){
        setData([res])
        setLoading(false)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  }, [dirty,user.org]);

  return (
    <React.Fragment>
      <Row>
        <Button ghost type="link" onClick={()=>{props.history.goBack()}}><img src={window.publicUrl + "/images/back.svg"}/></Button>
        <h2>设备分类</h2>
      </Row>
      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col></Col>
        <Col>
          <Button type="primary">下载</Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="switch" onClick={()=>{setVisible({...visible, showImport:true})}}>信息导入</Menu.Item>
                <Menu.Item key="audit" onClick={()=>{setVisible({...visible, showAudit:true})}}>审计</Menu.Item>
              </Menu>
            }
          >
          <Button>更多功能<DownOutlined /></Button>
        </Dropdown>
        </Col>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        expandable={{
          indentSize:50,
          expandIcon: ({ expanded, onExpand, record }) =>{
            return (
              expanded ? (
                <DownOutlined onClick={e => onExpand(record, e)} />
              ) : (
                <RightOutlined onClick={e => onExpand(record, e)} />
              )
            )
          }

        }}
      />

      <ClassModal {...{handleCancel, setData, currentId, setDirty, visible: visible.showClass, title: modalTitle, org: user.org, parItem: parItem}}/>
      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
      <ImportModal {...{handleCancel, visible: visible.showImport}} />
    </React.Fragment>
  )
}
const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user'])
})

export default connect(mapStateToProps)(React.memo(ObjectClass))
