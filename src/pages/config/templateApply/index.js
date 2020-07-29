import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button,TreeSelect, message, Select, Input, Tooltip, Table, Checkbox, Divider, Pagination, Modal, Space } from 'antd'
import AuditModal from '../../common/auditModal'
import ImportModal from '../../common/importModal'
import { ExclamationCircleOutlined, DeleteOutlined, DiffOutlined, CloudUploadOutlined } from '@ant-design/icons'
import EditModal from './editModal'
import { brands } from '../../../api'
import { templateApply } from '../../../api/config/templateApply'
import { connect } from 'react-redux'
import commonStyles from '../../Common.module.scss'
import { getClass} from './store/actionCreators'
import debounce from 'lodash/debounce'

const TemplateApply = props => {
  const {getClassDispatch} = props
  const [brandData, setBrandData] = useState()
  const locationTree = props.location.toJS()
  const [form] = Form.useForm()
  const [data, setData] = useState([])  //列表数据
  const [siteOption, setSiteOption] = useState([])
  const [loading, setLoading] = useState(false)
  const [isChecked, setChecked] = useState(false)//是否全选
  const [selectedCodes, setSelectedCodes] = useState([]) //已选择的记录的codes
  const [selectdRows, setSelectdRows] = useState([]) //已选择的记录
  const [filter, setFilter] = useState([])
  const [line, setLine] = useState(null)
  const [modalProperty, setModalProperty] = useState({})
  const [paging, setPaging] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [visible, setVisible] = useState({
    showAudit: false,
    showImport: false,
    showUpload: false
  })
  const [dirty, setDirty] = useState(0)

  const handleCancel = () => {
    setVisible({
      showAudit: false,
      showImport: false,
      showUpload: false,
      showNew: false
    })
  }

  //列表条目
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'desc'
    },
    {
      title: '线路',
      dataIndex: 'siteLine'
    },
    {
      title: '站点',
      dataIndex: 'siteStation',
    },
    {
      title: '分类',
      dataIndex: 'functionalType',
      render: (text, record) => {
        return (
          record._displayName.functionalType
        )
      }
    },
    {
      title: '品牌',
      dataIndex: 'brdName'
    },
    {
      title: '型号',
      dataIndex: 'modelNumber'
    },
    {
      title: '应用模板',
      dataIndex: 'templateName'
    }, {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
            <Tooltip title="删除"><DeleteOutlined onClick={() => { deleteTemplate(record.id) }} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="变更"><DiffOutlined onClick={ () =>{templateEdit(record,"edit")}} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="数据同步"><CloudUploadOutlined  onClick={ () =>{synchronization(record.id)}}/></Tooltip>
          </>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "模板应用"
    //设备分类
    getClassDispatch({
      org: props.user.toJS().org,
      fun: 'asset.classification',
      clsFun: 'asset.classification',
    })
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    setLoading(true)
    let sysFilterSql=[]
    if(line){
      sysFilterSql="obj_site like '" +line+"%'"
    }
    templateApply.objList({start: start, limit: pageSize, filter: JSON.stringify(filter),sysFilterSql:sysFilterSql})
    .then(res => {
      if (res && res.models) {
        setSelectedCodes([])
        setChecked(false)
        setAllCodes(res.models.map(item => { return (item.id) }))
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  //删除
  const deleteTemplate = (id) => {
    Modal.confirm({
      title: '删除设备所应用的模板，将清空删除设备属性、部件、整定值等信息。此操作不可恢复，是否确定变更？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        templateApply.deleteObjectTemplate({objectIds:id})
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  //删除
  const deleteTemplates = (id) => {
    Modal.confirm({
      title: '删除设备所应用的模板，将清空设备属性、部件、整定值等模板应用。此操作不可恢复，是否确定删除？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        templateApply.deleteObjectTemplate({objectIds:selectedCodes.toString()})
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  //列表逐条数据选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectdRows(selectedRows)
      setSelectedCodes(selectedRowKeys)
      if (selectedRowKeys && selectedRowKeys.length === allCodes.length) {//全选了
        setChecked(true)
      } else {
        setChecked(false)
      }
    },
    selectedRowKeys: selectedCodes
  }

  //变更
  const templateEdit = (record,type) => {
    setModalProperty({
      cls:record.functionalType,
      clsDesc:record._displayName.functionalType,
      brand:record.brand,
      brandName:record.brdName,
      templateName:record.templateName,
      template:record.template,
      modelNumber:record.modelNumber,
      id:record.id,
      type:type
    })
    setVisible({...visible, showEdit:true})
  }

  //批量变更
  const templateEdits = () => {
    console.log(selectdRows)
    if(selectdRows.length > 0) {
      //匹配分类、品牌、型号一致
      let brand = selectdRows.every( item => item.brand === selectdRows[0].brand )
      let modelNumber = selectdRows.every( item => item.modelNumber === selectdRows[0].modelNumber )
      let functionalType = selectdRows.every( item => item.functionalType === selectdRows[0].functionalType )

      if( brand && modelNumber && functionalType ) {
        setModalProperty({
          cls:selectdRows[0].functionalType,
          clsDesc:selectdRows[0]._displayName.functionalType,
          brand:selectdRows[0].brand,
          brandName:selectdRows[0].brdName,
          templateName:selectdRows[0].templateName,
          template:selectdRows[0].template,
          modelNumber:selectdRows[0].modelNumber
        })
        setVisible({showEdit:true})
      } else {
        Modal.warning({
          title: '您选择的设备包含多种分类、品牌、型号的组合，请选择唯一分类、品牌、型号后再进行模板变更操作'
        })
      }

    } else {
      message.warning("请选择需要变更更的模板记录")
    }
  }

  const synchronization = (id) => {
    const key = 'updatable'
    message.loading({ content: '设备信息同步中，请稍等...', key })
    templateApply.synObjectTemplate({objectId:id})
      .then(res => {
        if(res && res.success) {
          message.success({ content: '设备信息同步已完成!', key, duration: 2 })
        }
      })
  }

  const onCheckBox = (event) => {
    if (event.target.checked) {
      setSelectedCodes(allCodes)
      setSelectdRows(data)
      setChecked(true)
    } else {
      setSelectedCodes([])
      setSelectdRows([])
      setChecked(false)
    }
  }

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage: page
    })
    setDirty(dirty + 1)
  }

   //品牌搜索时请求
   const handleSearch = debounce((key) => {
    brands({
      limit: 30,
      filter: JSON.stringify([{ property: 'name', value: key }])
    })
      .then(res => {
        setBrandData(res.models)
      })
  }, 500)

  const pageSizeChange = (current, pageSize) => {
    setPaging({
      ...paging,
      pageSize: pageSize
    })
    setDirty(dirty + 1)
  }

  //搜索
  const search = async () => {
    try {
      const values = await form.validateFields()
      const filterArr = []
      for (var key of Object.keys(values)) {
        const filterObj = {}
        filterObj["property"] = key
        filterObj["value"] = values[key] ? values[key] : ""

        if (key === "objDesc" && values[key]) {
          filterObj["property"] = "desc"
        }
        if (key === "clsDesc" && values[key]) {
          filterObj["property"] = "functionalType"
        }
        if (key === "brandDesc" && values[key]) {
          filterObj["property"] = "brand"
        }

        if (key === "modelNumber" && values[key]) {
          filterObj["property"] = "modelNumber"
        }
        if (key === "selectSite1" && values[key]) {
          filterObj["property"] = "site"
        }
        if (filterObj.value && key!=='siteLine') {
          filterArr.push(filterObj)
        }
      }
      setFilter(filterArr)
      setPaging({
        ...paging,
        currentPage: 1,
        pageSize: 10,
        start: 0,
      })
      setDirty(dirty => dirty + 1)
    }
    catch { }
  }

  //渲染设备分类
  const renderCls = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.text} disabled>{renderCls(item.children)}</TreeSelect.TreeNode>
      }
      return <TreeSelect.TreeNode key={item.model.code} value={item.model.code} title={item.model.desc}></TreeSelect.TreeNode>
    })
  }

  return (
    <div>
      <div className={commonStyles.searchForm}>
        <Form form={form} name="searchForm">
          <Row>
            <Col span={5}>
              <Form.Item name="objDesc" id="obj">
                <Input placeholder="请输入设备名称" />
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Form.Item name="clsDesc">
                <TreeSelect
                  showSearch
                  placeholder="请选择设备分类"
                  treeDefaultExpandAll
                  allowClear
                  treeNodeFilterProp="title"
                >
                  {renderCls(props.class.toJS())}
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col span={5} offset={1}>
              <Form.Item name="brandDesc">
              <Select
                    placeholder="请选择新设备品牌"
                    showSearch
                    allowClear
                    filterOption={false}
                    onSearch={handleSearch}
                    onChange={
                      (value) => {
                        form.setFieldsValue({presentTemplate:null})
                      }
                    }
                  >
                    {
                      brandData && brandData.length > 0 && brandData.map(item => (
                        <Select.Option key={item.id} value={item.code} code={item.code}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
              </Form.Item>
            </Col>
            <Col span={5} offset={1} id="modelNumberArea">
              <Form.Item name="modelNumber">
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
            <Col span={5} id="lineArea">
              <Form.Item name="siteLine">
                <Select
                  placeholder="请选择线路"
                  allowClear
                  getPopupContainer={() => document.getElementById('lineArea')}
                  onChange={
                    (value) => {
                      setSiteOption([])
                      setLine(value)
                      form.setFieldsValue({ selectSite1: undefined})
                      locationTree.lineSite && locationTree.lineSite.forEach(item => {
                        if (item.value === value) {
                          setSiteOption(item.children)
                        }
                      })
                    }
                  }
                >
                  {locationTree.line && locationTree.line.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}  offset={1} id="site1Area">
              <Form.Item name="selectSite1">
                <Select
                  placeholder="请选择站点"
                  allowClear
                  getPopupContainer={() => document.getElementById('site1Area')}
                >
                  {
                    siteOption.length > 0 && siteOption.map(item => (
                      <Select.Option key={item.value} sn={item.sn} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col offset={1} ><Button type="primary" onClick={search}>搜索</Button></Col>
          </Row>
        </Form>
      </div>

      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>模板应用列表</h3></Col>
        {/* <Col >
          <Button type="primary" onClick={addItem}>新建</Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="import" onClick={() => { setVisible({ ...visible, showImport: true }) }}>信息导入</Menu.Item>
                <Menu.Item key="download">下载</Menu.Item>
                <Menu.Item key="audit" onClick={() => { setVisible({ ...visible, showAudit: true }) }}>审计</Menu.Item>
              </Menu>
            }
          >
            <Button>更多功能<DownOutlined /></Button>
          </Dropdown>
        </Col> */}
      </Row>

      <Table loading={loading} rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={data} scroll={{ x: 1600 }} pagination={false} />
      <Row type="flex" justify="space-between" style={{ padding: '16px', background: '#fff' }}>
        <Col>
          <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
          <Space>
            <Button type="danger" ghost onClick={deleteTemplates}>批量删除</Button>
            <Button type="danger" ghost onClick={templateEdits}>批量变更</Button>
          </Space>
        </Col>
        <Col>
          <Pagination
            onShowSizeChange={pageSizeChange}
            pageSize={paging.pageSize}
            onChange={pageNumberOnChange}
            total={paging.total}
            current={paging.currentPage}
            showSizeChanger
            showQuickJumper
            showTotal={() => `共 ${paging.total} 条`}
          />
        </Col>
      </Row>

      <AuditModal {...{ handleCancel, visible: visible.showAudit }} />
      <ImportModal {...{ handleCancel, visible: visible.showImport }} />
      <EditModal visible={visible.showEdit} brands={props.brands} modalProperty={modalProperty} {...{ selectedCodes, handleCancel, setDirty }} />

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location']),
    brands: state.getIn(['common', 'brands']),
    user: state.getIn(['common', 'user']),
    class: state.getIn(['templateApply', 'class']),
  }
}


const mapDispatchOBJ = {
  getClassDispatch: getClass
}

export default connect(mapStateToProps, mapDispatchOBJ)(React.memo((TemplateApply)))
