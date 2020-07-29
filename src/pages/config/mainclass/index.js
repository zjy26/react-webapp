import React, { useState, useEffect, useRef } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Card, Row, Col, Button, Input, message } from 'antd'
import styles from './Class.module.scss';
import { classManage } from '../../../api'
import AddModal from './addModal'
import AuditModal from '../../common/auditModal'
import { connect } from 'react-redux'


const MainClass = props => {
  const user = props.user.toJS();
  const [data, setData] = useState([])
  const [dirty, setDirty] = useState(0)
  const [activeId, setActiveId] = useState(null)
  const [changedName, setChangedName] = useState("")
  const inputRef = useRef(null)
  const addClass = () => {
    if(activeId){
      message.error("请先保存当前修改")
      return
    }else{
      setVisible({...visible,showAdd:true})
    }
  }
  // const auditModalShow = () => {
  //   if(activeId){
  //     message.error("请先保存当前修改")
  //     return
  //   }else{
  //     setVisible({...visible, showAudit:true})
  //   }
  // }
  const [visible, setVisible] = useState({
    showAdd:false,
    showAudit:false
  });
  const handleChange = (e) => {
    e.preventDefault();
    setChangedName(e.target.value)
  }
  const handleClickInput = (e) =>{
    e.preventDefault();
    e.target.focus()
  }
  const handleCancel = () => {
    setVisible({
      showAdd:false,
      showAudit:false
    });
  }
  const handleEditCancel = (e, item, status)=> {
    e.preventDefault()
    if(activeId && status){
      message.error("请先保存当前修改")
      return
    }
    setActiveId(status ? item.id : null)
    setChangedName(status ? item.descr : '')
  }
  const handleDelete = (e,id) => {
    e.preventDefault()
    if(activeId){
      message.error("请先保存当前修改")
      return
    }
    Modal.confirm({
      title: '确认删除',
      content: '是否删除该分类？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        classManage.deleteClass(id)
        .then((res)=>{
          if(res.actionErrors && res.actionErrors.length){
            message.error(res.actionErrors[0])
          }else{
            message.success('删除成功')
          }
          setDirty((dirty)=>dirty+1)
        })
      },
      onCancel() {
      },
    })
  }
  const handleSave = (e,item) => {
    e.preventDefault();
    if(item.descr === changedName){
      setActiveId(null)
      return false
    }
    if(changedName.replace(/\s+/g,"").length){
      Modal.confirm({
        title: '确认提示',
        content: '是否确认修改？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: ()=> {
          classManage.updateClass(item.id, {descr:changedName, _method: 'PUT'})
          .then(res => {
            message.success('修改成功')
            setDirty(dirty=>dirty+1)
          })
          .catch(error => {
            message.error('修改失败')
          })
        },
        onCancel() {
        },
      })
    }else{
      message.error('分类名称不可为空')
    }
  }

  useEffect(() => {
    document.title = "分类设置"
    setActiveId(null)
    classManage.mainClassList()
    .then(res => {
      if(res.models){
        setData(res.models)
      }else{
        setData([])
      }
    })
    .catch(() => {
      setData([])
      console.log("列表数据加载失败")
    })
  }, [dirty]);
  return(
    <div>
      <Row type="flex" justify="end" style={{margin:"5px 40px 5px 0"}}>
        <Button type="primary" style={{width:"88px"}} onClick={() => {addClass()}}>添加分类</Button>
        {/* <Button block type="default" className="topButton" style={{width:"88px",backgroundColor:"#D9D9D9",marginLeft:"10px"}} onClick={()=>{auditModalShow()}}>审计</Button> */}
      </Row>
      <div className={styles.container}>
        {
          data.map((item)=>{
            return(
              <a to={item.funUri} key={item.id}  href={window.apiBase+item.funUri}>
                <Card hoverable bordered={false} bodyStyle={{width:"100%"}}>
                  <div style={{height:"165px"}}>
                      <img src={window.apiBase+item.icon} alt="logo"></img>
                      {item.id === activeId ?
                        <Input defaultValue={item.descr} value={changedName} onChange={(e)=>{handleChange(e, item.code)}} onClick={(e)=>{handleClickInput(e)}} ref={inputRef}/> :
                        <div className="descr">{item.descr}</div>
                      }
                  </div>
                  {item.id === activeId ?
                    <Row>
                      <Col span={12} onClick={(e) => handleSave(e, item)}><div>保存</div></Col>
                      <Col span={12} onClick={(e) => handleEditCancel(e, item,false)}><div>取消</div></Col>
                    </Row> :
                    <Row>
                      <Col span={12} onClick={(e) => handleEditCancel(e, item, true)}><div>编辑</div></Col>
                      <Col span={12} onClick={(e) => handleDelete(e, item.id)}><div>删除</div></Col>
                    </Row>
                  }
                </Card>
              </a>
            )
          })
        }
      </div>
      <AddModal {...{setDirty, handleCancel, visible: visible.showAdd, org:user.org}}/>
      <AuditModal {...{handleCancel, visible: visible.showAudit}} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user'])
})

export default connect(mapStateToProps)(React.memo(MainClass))
