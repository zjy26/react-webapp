import React, { useState, useEffect, useRef } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { Form,Row, Col, Input, Select, Button, Cascader, DatePicker, Tag, Menu, Dropdown } from 'antd';
import { Link } from 'react-router-dom'
import AddModal from './addModal'
import CancelModal from './cancelModal'
import AbnormalModal from './abnormalModal'
import ImportModal from '../../common/importModal'
import AuditModal from '../../common/auditModal'
import PatrolVideoModal from './patrolVideoModal'
import { patrolSheet } from '../../../api'
import { connect } from 'react-redux'
import moment from 'moment'
import {setTable, commonTable } from '../../common/table'
import { getSheetType } from './store/actionCreators'

const { Option } = Select;
const brands = [];
for (let i = 10; i < 36; i++) {
  brands.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const { CheckableTag } = Tag;
const PatrolSheet = props => {
  const { getSheetTypeDispatch } = props
  const locationTree = props.location.toJS()
  const patrolSheetType = props.patrolSheetType.toJS()
  const [form] = Form.useForm()
  const [dirty, setDirty] = useState(0)
  const [data, setData] = useState([]);  //列表数据
  const [itemValues] = useState([]);  //详情数据
  const [tagChecked, setTagChecked] = useState({  //筛选标签选择状态
    all: true,
    wait: true,
    patrol: true,
    finish: true,
    cancel: true,
    close: true
  });
  const [visible, setVisible] = useState({  //弹窗
    showDetail: false,
    showAdd: false,
    showCancel: false,
    showAbnormal: false,
    showImport: false,
    showAudit: false,
    showVideo: false
  });
  const [toModal, setToModal] = useState({
    toCancel:null,
    toAbnormal:null,
    toVideo:null
  })
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [attFilter, setAttFilter] = useState(null)
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true);
  const editRef = useRef();

  //关闭弹窗
  const handleCancel = () => {
    setVisible({
      showDetail: false,
      showAdd: false,
      showCancel: false,
      showAbnormal: false,
      showImport: false,
      showAudit: false,
      showVideo: false
    });
  }
  // //新建
  // const newModal = ()=> {
  //   setVisible({...visible, showAdd: true});
  //   patrolSheet.patrolSheetNew()
  //   .then(res => {
  //     return res
  //   })
  // }
  //取消
  const showCancelModal = (value) => {
    setToModal({
      ...toModal,
      toCancel:value
    })
    setVisible({...visible, showCancel:true})
  }
  const showAbnormalModal = (value) => {
    setToModal({
      ...toModal,
      toAbnormal:value.id
    })
    setVisible({...visible, showAbnormal:true})
  }
  const showVidoModal = (value) => {
    setToModal({
      ...toModal,
      toVideo:value
    })
    setVisible({...visible, showVideo:true})
  }
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields()
      .then(values => {
        let {rangeDate,peopleName,...filterData} = values
        let params = {
          peopleName:peopleName,
        }
        rangeDate = rangeDate ? (rangeDate.length ? rangeDate : undefined) : undefined
        if(rangeDate){
          params['startDate'] = moment(new Date(rangeDate[0])).format('YYYY-MM-DD')
          params['endDate'] = moment(new Date(rangeDate[1])).format('YYYY-MM-DD')
        }
        let filterStr = [];
        if(filterData['desc']){
          filterStr.push({"property":"desc","value":filterData['desc']})
        }
        if(filterData['site'] && filterData['site'].length){
          filterStr.push({"property":"site","value":filterData['site'][1]})
        }
        if(filterData['isError']){
          filterStr.push({"property":"isError","value":filterData['isError'] > 0 ? (filterData['isError'] > 1 ? '' : true) : false})
        }
        //filterStr.push({"property":"patrolStatus","value":"APPR"})
        setAttFilter(params)
        setFilter(filterStr.length ? filterStr : null)
        setPager({
          ...pager,
          current: 1,
          page: 1,
          start: 0,
        })
        setDirty(dirty => dirty + 1)
      })
      .catch(errorInfo => {
      });
  }

  // //编辑巡检
  // const edit = (id)=> {
  //   Axios.get('/api/patrolSheetList/'+id)
  //   .then((res) =>{
  //     if(res.status === 200){
  //       setItemValues(res.data);
  //       setVisible({...visible, showAdd: true});
  //       editRef.current.edit();
  //     }
  //   })
  // }

  //更多功能按钮
  const menu = (
    <Menu>
      <Menu.Item key="import" onClick={ ()=>{setVisible({...visible, showImport:true})} }>信息导入</Menu.Item>
      <Menu.Item key="download">下载</Menu.Item>
      <Menu.Item key="audit" onClick={ ()=>{setVisible({...visible, showAudit:true})} }>审计</Menu.Item>
    </Menu>
  );

  //列表条目
  const columns = [
    {
      width: '15%',
      title: '名称',
      dataIndex: 'desc',
      render: (text, record) => {
        return (
          <Link to={"/patrol-sheet-detail/"+record.id+"/patrolSheet/detail"}>{text}</Link>
        )
      },
      ellipsis: true,
    },
    {
      title: '线路',
      dataIndex: 'site',
      render: (text, record) => {
        if(locationTree&&locationTree.line) {
          const item = locationTree.line.find(obj=>obj.value===record.site.slice(0,4))
          return item.label
        }
      }
    },
    {
      title: '站点',
      dataIndex: 'site',
      render: (text, record) => {
        if(locationTree&&locationTree.site) {
          const item = locationTree.site.find(obj=>obj.value===record.site)
          console.log(item)
          return item.label
        }
      }
    },
    {
      title: '负责人',
      dataIndex: 'people',
      render:(text, record) => record._displayName.people
    },
    {
      title: '巡检时间',
      dataIndex: 'patrolDate',
      render: (text, record) => moment(record.patrolDate).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '状态',
      dataIndex: 'patrolStatus',
      render:(text, record) => {
        if(patrolSheetType&&patrolSheetType.length) {
          const item = patrolSheetType.find(obj=>obj.code===record.patrolStatus)
          return item.name
        }
      }
    },
    {
      title: '巡检结果',
      dataIndex: 'isError',
      render: (text, record) => {
        return (
        record.isError ?
        <span>正常</span> :
        <Button type="link" size={'small'} style={{padding:0}} onClick={() => showAbnormalModal(record)}>异常</Button>
        )
      }
    },
    {
      title: '人工确定',
      dataIndex: 'isSure',
      render: (text, record) => {
        return (
          record.isSure ? '正常' : String(record.isSure) === 'false' ? <Button type="link" size={'small'} style={{padding:0}} onClick={() => showAbnormalModal(record)}>异常</Button> : '--'
        )
      }
    },
    {
      ellipsis: true,
      title: '取消原因',
      dataIndex: 'CancelReason',
      render:(text, record) => {
        return (
          record.cancelReason ?
          <span>{ record.cancelReason}</span>:
          '--'
        )
      }
    },
    {
      width:'12%',
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        switch(record.patrolStatus){
          case 'CLOSE':
            return (
              <span>
                <Button type="link" size={'small'} >下载报告单</Button>
              </span>
            );
          case 'CANCL':
            return (
              '--'
            );
          case 'COMP':
            return (
              <span>
                <Button type="link" size={'small'} >查看详情</Button>
                <Button type="link" size={'small'} >下载报告单</Button>
              </span>
            );
          case 'APPR':
            return (
              <span>
                <Button type="link" size={'small'} onClick={() => {showVidoModal(record)}}>查看视频</Button>
              </span>
            );
            case 'WAPPR':
              return (
                <span>
                  <Button type="link" size={'small'} onClick={()=>{showCancelModal(record)}}>取消巡检</Button>
                  <Button type="link" size={'small'} >编辑巡检</Button>
                </span>
              );
            default:
              return '--'
        }
      }
    }
  ];

  useEffect(() => {
    document.title = "巡检单"
    getSheetTypeDispatch()
    setTable(patrolSheet.patrolSheetList, setData, setLoading, pager, setPager, filter, attFilter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty,getSheetTypeDispatch])

  return (
    <div>
      <Form form={form} layout="horizontal" style={{margin: 30}}>
        <Row gutter={64}>
          <Col span={4}>
            <Form.Item name="desc">
              <Input placeholder="请输入巡检单名称" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="peopleName">
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="isError">
              <Select placeholder="请选择巡检结果" allowClear={true} >
                <Option value={-1}>异常</Option>
                <Option value={1}>正常</Option>
                <Option value={2}>无结果</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="site">
              <Cascader placeholder="请选择线路/站点" options={locationTree.lineSite} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="rangeDate">
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={(e)=>handleSubmit(e)}>筛选</Button>
          </Form.Item>
        </Row>
      </Form>

      <div>
        <Row>
          <Col span={2} style={{textAlign: "center"}}><label>标签:</label></Col>
          <Col span={17}>
            <CheckableTag checked={tagChecked.all} onChange={(checked)=>{setTagChecked({all: checked, wait: checked, patrol: checked, finish: checked, cancel: checked, close: checked})}}>全部</CheckableTag>
            <CheckableTag checked={tagChecked.wait} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, wait: checked})}}>待巡检</CheckableTag>
            <CheckableTag checked={tagChecked.patrol} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, patrol: checked})}}>巡检中</CheckableTag>
            <CheckableTag checked={tagChecked.finish} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, finish: checked})}}>已完成</CheckableTag>
            <CheckableTag checked={tagChecked.cancel} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, cancel: checked})}}>已取消</CheckableTag>
            <CheckableTag checked={tagChecked.close} onChange={(checked)=>{setTagChecked({...tagChecked, all: false, close: checked})}}>已关闭</CheckableTag>
          </Col>
          <Col span={2}>
            <Button type="danger">新建</Button>
            </Col>
            <Col span={3}>
            <Dropdown overlay={menu}>
              <Button type="danger">更多功能<DownOutlined /></Button>
            </Dropdown>
          </Col>
        </Row>
      </div>
      { commonTable(columns, data, "id", loading, setDirty, pager, setPager, {}) }
      <AddModal visible={visible.showAdd} {...{itemValues, handleCancel}} wrappedComponentRef={editRef} locationTree={props.locationTree}/>
      <CancelModal visible={visible.showCancel} {...{handleCancel, setDirty}} currentId={toModal.toCancel}/>
      <AbnormalModal visible={visible.showAbnormal} {...{handleCancel}} currentId={toModal.toAbnormal}/>
      <ImportModal visible={visible.showImport} {...{handleCancel}}/>
      <AuditModal visible={visible.showAudit} {...{handleCancel}}/>
      <PatrolVideoModal visible={visible.showVideo} {...{handleCancel}} currentId={toModal.toVideo}/>
    </div>
  );
}
const mapStateToProps = (state) => ({
  location: state.getIn(['common', 'location']),
  patrolSheetType: state.getIn(['patrolSheet', 'sheetType'])
})
const mapDispatchToProps = (dispatch) => {
  return {
    getSheetTypeDispatch() {
      dispatch(getSheetType())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PatrolSheet));
