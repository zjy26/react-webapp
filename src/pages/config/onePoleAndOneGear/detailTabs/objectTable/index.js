import React, { useState, useEffect, useContext, useRef } from 'react'
import { MenuOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';
import { Modal, Button, Table, Pagination, Checkbox, Menu, Input, Tag, Row, Dropdown, Col, Tabs, message, Space } from 'antd'
import moment from 'moment'
import ObjectDetilModal from './objectDetilModal'
import NewUnit from './newUnit'
import ObjectModal from './objectModal'
import PropStdModal from './propStdModal'
import CheckModal from './checkModal'
import commonStyles from '../../../../Common.module.scss'
import ChangeObjectModal from './changeObjectModal'
import MaintainModal from './maintainModal'
import EditModal from './editModal'
import { overheadLine } from '../../../../../api'

const ObjectTable = props => {
  const { MyContext, user } = props
  const { code, id, peopleOption, brandOption/*,unitClassOption*/ } = useContext(MyContext)
  const [objId, setObjId] = useState(null)
  const [template, setTemplate] = useState(null)
  const [filter, setFilter] = useState([])
  const [state, setState] = useState({
    paneKey: '1'
  })
  const [isChecked, setChecked] = useState(false)//是否全选
  const [selectedCodes, setSelectedCodes] = useState([]);//已选择的codes
  const [allCodes, setAllCodes] = useState([])//本页的所有table
  const [searchProps, setSearchProps] = useState({
    column: "",
    text: ""
  })
  const [paging, setPaging] = useState({
    currentPage: 1,
    pageSize: 50,
    total: 0
  })
  const [paging2, setPaging2] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  const [paging3, setPaging3] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  const [modalTitle, setModalTitle] = useState("新增设备")
  const [loading, setLoading] = useState(true)
  const [objData, setObjData] = useState([])
  const [objChangeData, setObjChangeData] = useState([])
  const [objRepairData, setObjRepairData] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [dirty, setDirty] = useState(0)
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})
  const [child, setChild] = useState({})
  const templateRef = useRef(null)

  const handleReset1 = (clearFilters, setSearchProps, setFilter) => {
    clearFilters()
    setFilter([])
    setDirty(dirty => dirty + 1)
    setSearchProps({
      text: ""
    })
  }

  const getColumnSearchProp = (dataIndex, dataName, searchProps, setSearchProps, setFilter) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`筛选${dataName}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            筛选
          </Button>
          <Button onClick={() => handleReset1(clearFilters, setSearchProps, setFilter)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: text =>
      searchProps.column === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchProps.text]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : (
          text
        ),
  })

  useEffect(() => {
    let pageSize = paging.pageSize;
    let start = (paging.currentPage - 1) * pageSize
    let currentPage = paging.currentPage
    overheadLine.overheadLineObjectList({ page: currentPage, start: start, limit: pageSize, code: code, filter: JSON.stringify(filter) })
      .then(res => {
        if (res.models) {
          setAllCodes(res.models.map(item => { return (item.id) }))
          setPaging(paging => {
            const aa = {
              ...paging,
              total: res.total
            }
            return aa
          })
          setObjData(res.models)
          setLoading(false)
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })

    let pageSize2 = paging2.pageSize;
    let start2 = (paging2.currentPage - 1) * pageSize
    let currentPage2 = paging2.currentPage

    overheadLine.objectChangeList({ page: currentPage2, start: start2, limit: pageSize2, overheadline: code })
      .then(res => {
        if (res.models) {
          setPaging2(paging2 => {
            const aa = {
              ...paging2,
              total: res.total
            }
            return aa
          })
          setObjChangeData(res.models)
          setLoading(false)
        }

      })
      .catch(() => {
        console.log("列表数据加载失败")
      })

    let pageSize3 = paging3.pageSize;
    let start3 = (paging3.currentPage - 1) * pageSize
    let currentPage3 = paging3.currentPage
    overheadLine.objectRepairList({ page: currentPage3, start: start3, limit: pageSize3, overheadline: code })
      .then(res => {
        if (res.models) {
          setPaging3(paging3 => {
            const aa = {
              ...paging3,
              total: res.total
            }
            return aa
          })
          setObjRepairData(res.models)
          setLoading(false)
        }

      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const objColumns = [
    {
      title: null,
      dataIndex: 'changeTag',
      width: 30,
      render: (text, record) => {
        return (
          text && text > 0 ?
            <Tag color="red">更换</Tag> : null
        )
      }
    },
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '设备描述',
      dataIndex: 'descr',
      ...getColumnSearchProp('descr', "设备描述", searchProps, setSearchProps, setFilter)
    },
    {
      title: '设备分类',
      dataIndex: 'clsName'
    },
    {
      title: '品牌',
      dataIndex: 'brdName',
      filters: brandOption.map(o => { return { value: o.name, text: o.name } }),
      filterMultiple: false
    },
    {
      title: '型号',
      dataIndex: 'modelNumber',
      ...getColumnSearchProp('modelNumber', "型号", searchProps, setSearchProps, setFilter)
    },
    {
      title: '启用日期',
      dataIndex: 'commissDate',
      render: (text, record) => text ? moment(record.commissDate).format('YYYY-MM-DD') : null
    },
    {
      title: '设备标识',
      dataIndex: 'objectMark',
      ...getColumnSearchProp('objectMark', "设备标识", searchProps, setSearchProps, setFilter)
    },
    {
      title: '形式',
      dataIndex: 'shape'
    },
    {
      title: '长度',
      dataIndex: 'length'
    },
    {
      title: '道岔号',
      dataIndex: 'turnout'
    },
    {
      title: '另一根锚段号',
      dataIndex: 'anchorSection'
    },
    {
      title: '另一根股道数',
      dataIndex: 'stationTrack'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={() => { partsParameters(record) }}>新增部件</Button>&nbsp;&nbsp;
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="check" onClick={() => { objDetil(record.id) }}>查看详情</Menu.Item>
                  <Menu.Item key="edit" onClick={() => { objEdit(record.id) }}>编辑</Menu.Item>
                  <Menu.Item key="delete" onClick={() => { deleteObject(record.id) }}>删除</Menu.Item>
                </Menu>
              }
            >
              <MenuOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
          </span>
        )
      }
    }
  ]

  const changeColumns = [
    {
      dataIndex: 'type',
      width: 80,
      render: (text => {
        return (
          text === '01' ?
            <Tag color="red">设备</Tag> : <Tag color="green">部件</Tag>
        )
      })
    },
    {
      title: '设备/部件描述',
      render: (text, record) => {
        return record.objectDesc ? record.objectDesc : record.unitDesc
      }
    },
    {
      title: '设备/部件分类',
      dataIndex: 'clsName'
    },
    {
      title: '原设备/部件品牌',
      dataIndex: 'orgBrand'
    },
    {
      title: '新设备/部件品牌',
      dataIndex: 'preBrand'
    },
    {
      title: '新设备/部件型号',
      dataIndex: 'presentModelNumber'
    },
    {
      title: '更换原因',
      dataIndex: 'reason',
      ellipsis: true
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      render: (text, record) => {
        if (peopleOption) {
          const item = peopleOption.find(obj => obj.id.toString() === text)
          if (item)
            return item.name
        }
      }
    },
    {
      title: '更换时间',
      dataIndex: 'replaceTime',
      render: (text, record) => text ? moment(record.replaceTime).format('YYYY-MM-DD') : null
    }
  ]

  const partsParameters = (record) => {
    setObjId(record.id)
    setTemplate(record.template)
    setVisible({ ...visible, showUnit: true })
  }

  const objDetil = (id) => {
    setObjId(id)
    setVisible({ ...visible, showDetil: true })
  }

  const getColumnSearchProps = (dataIndex, name) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`筛选 ${name}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            筛选
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      ) : (
          text
        ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('')
  };

  const objEdit = (id) => {
    setModalTitle("编辑")
    setObjId(id)
    setVisible({ ...visible, showObject: true })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const deleteObject = (id) => {
    overheadLine.overHeadLineObjectDelete(id, { _method: 'delete' })
      .then(res => {
        if (res) {
          message.success("删除成功")
          setDirty(dirty + 1)
        }
      })
  }

  const onChangePane = (key) => {
    setState({
      paneKey: key,
    });
  };

  const maintainColumns = [
    {
      dataIndex: 'type',
      width: 80,
      render: (text => {
        return (
          text === '01' ?
            <Tag color="red">维修</Tag> : <Tag color="green">维护</Tag>
        )
      })
    },
    {
      title: '设备描述',
      dataIndex: 'overheadLineObject'
    },
    {
      title: '维护/维修信息',
      dataIndex: 'descr',
      ellipsis: true
    },
    {
      title: '处理信息',
      dataIndex: 'explanation',
      ellipsis: true
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text, record) => {
        return (
          text ? moment(text).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text, record) => {
        return (
          text ? moment(text).format('YYYY-MM-DD') : ''
        )
      }
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      render: (text, record) => {
        if (peopleOption) {
          const item = peopleOption.find(obj => obj.id.toString() === text)
          if (item)
            return item.name
        }
      }
    }
  ]

  const unitColumns = [
    {
      title: null,
      dataIndex: 'changeTag',
      width: 30,
      render: (text, record) => {
        return (
          text && text > 0 ?
            <Tag color="red">更换</Tag> : null
        )
      }
    },
    {
      title: '序号',
      dataIndex: 'unitSn',
      render: (text) => {
        return text ? text : undefined
      }
    },
    // {
    //   title: '描述',
    //   dataIndex: 'desc',
    //   ...getColumnSearchProps("desc","描述")
    // },
    {
      title: '部件名称',
      dataIndex: 'desc',
      ...getColumnSearchProps("desc", "部件名称")
    },
    // {
    //   title: '分类',
    //   dataIndex: 'firstLevelCls',
    //   filters: unitClassOption.map(o=>{return{value:o.model.desc, text:o.model.desc}}),
    //   onFilter: (value, record) => record.firstLevelCls ? record.firstLevelCls.indexOf(value) === 0 : null
    // },
    {
      title: '品牌',
      dataIndex: 'brand',
      filters: brandOption.map(o => { return { value: o.name, text: o.name } }),
      onFilter: (value, record) => record.brand ? record.brand.indexOf(value) === 0 : null
    },
    {
      title: '型号',
      dataIndex: 'modelNumber',
      ...getColumnSearchProps("modelNumber", "型号")
    },
    {
      title: '规格',
      dataIndex: 'spec',
      ...getColumnSearchProps("spec", "规格")
    },
    {
      title: '元器件编号',
      dataIndex: 'componentNumber',
      ...getColumnSearchProps("componentNumber", "元器件编号")
    },
    // {
    //   title: '设计寿命',
    //   dataIndex: 'designLife'
    // },
    // {
    //   title: '更换年限',
    //   dataIndex: 'replaceLife'
    // },
    {
      title: '关键部件',
      dataIndex: 'criticality',
      filters: [{ text: "是", value: "true" }, { text: "否", value: "false" }],
      onFilter: (value, record) => record.criticality.toString() ? record.criticality.toString().indexOf(value) === 0 : null,
      filterMultiple: false,
      render: (text) => {
        if (text) {
          return "是"
        } else {
          return "否"
        }
      }
    },
    // {
    //   title: '变比',
    //   render:(text,record)=>{
    //     return (record.transRatio1?record.transRatio1:"") + '/' + (record.transRatio2?record.transRatio2:"")
    //   }
    // },
    {
      title: '启用日期',
      dataIndex: 'commissDate',
      render: (text, record) => text ? moment(record.commissDate).format('YYYY-MM-DD') : null
    },
    // {
    //   title: '制造商',
    //   dataIndex: 'manufact'
    // },
    // {
    //   title: 'E码/订货编号',
    //   dataIndex: 'fcCode'
    // },
    {
      title: '部件标识',
      dataIndex: 'objectMark'
    },
    {
      title: '操作',
      render: (text, record) => {

        return (
          record.unitSn ?
            <span>
              <Button key="propStdStatic" type="link" size={'small'} onClick={() => propStdStatic(record.unitTemplateCode)}>参数标准</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="edit" onClick={() => { edit("static", record) }}>编辑</Menu.Item>
                    <Menu.Item key="detail" onClick={() => { showDetil("static", record) }}>查看详情</Menu.Item>
                  </Menu>
                }
              >
                <MenuOutlined style={{ cursor: 'pointer' }} />
              </Dropdown>
            </span>
            :
            <span>
              <Button key="detail" type="link" size={'small'} onClick={() => propStd(record.unitTemplateCode)}>参数标准</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="detail" onClick={() => { showDetil("dynamic", record) }}>查看详情</Menu.Item>
                    <Menu.Item key="edit" onClick={() => { check("edit", record) }}>编辑</Menu.Item>
                    <Menu.Item key="delete" onClick={() => { deleteItem(record.id, record.d9OverheadLineObjectId, record.templateCode) }}>删除</Menu.Item>
                  </Menu>
                }
              >
                <MenuOutlined style={{ cursor: 'pointer' }} />
              </Dropdown>
            </span>

        )
      }
    }
  ]

  //参数标准
  const propStd = (code) => {
    setModalProperty({
      unitTemplate: code
    })
    setVisible({ showParametersStandard: true })
  }

  //参数标准
  const propStdStatic = (code) => {
    setModalProperty({
      unitSn: 1,
      unitTemplate: code
    })
    setVisible({ showParametersStandard: true })
  }

  const pageSizeChange = (current, pageSize) => {
    setPaging({
      ...paging,
      pageSize: pageSize
    })
    setDirty(dirty + 1)
  }

  const pageSizeChange2 = (current, pageSize) => {
    setPaging2({
      ...paging2,
      pageSize: pageSize
    })
    setDirty(dirty + 1)
  }

  const pageSizeChange3 = (current, pageSize) => {
    setPaging3({
      ...paging3,
      pageSize: pageSize
    })
    setDirty(dirty + 1)
  }

  //设备部件删除
  const deleteItem = (id, d9OverheadLineObjectId, templateCode) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        overheadLine.objectUnitDelete(id, { _method: 'DELETE' })
          .then(() => {
            renderChildData(true, d9OverheadLineObjectId, templateCode)
            message.success("删除成功")

          })
      },
      onCancel() {
      },
    })
  }

  const createBarExtraContent = () => {
    if (state.paneKey === '1') {
      return (
        <div>
          <Button type="primary" onClick={addObject}>新建</Button>
        </div>)
    } else if (state.paneKey === '2') {
      return (
        <div>
          <Button type="primary" onClick={addChangeObject}>新建</Button>
        </div>
      )
    } else if (state.paneKey === '3') {
      return (
        <div>
          <Button type="primary" onClick={addMaintenance}>新建</Button>
        </div>
      )
    }
  }

  //新建
  const addObject = () => {
    setModalTitle("新增设备")
    setObjId(null)
    setVisible(true)
    setVisible({ ...visible, showObject: true })
  }

  //新建部件更换记录
  const addChangeObject = () => {
    setVisible({ ...visible, showChangeObject: true })
  }

  //列表逐条数据选择
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedCodes(selectedRowKeys);
      if (selectedRowKeys && selectedRowKeys.length === allCodes.length) {//全选了
        setChecked(true);
      } else {
        setChecked(false)
      }
    },
    selectedRowKeys: selectedCodes
  }

  //新建维护记录
  const addMaintenance = () => {
    setVisible({ ...visible, showAddMaintenance: true })
  }

  //预设值列表(点击展开时请求)
  const renderChildData = (expanded, id, template) => {
    if (expanded) {
      overheadLine.unitTemplateList({ id: id, template: template })
        .then(res => {
          if (res.objectUnitList) {
            const obj = {}
            const brands = []
            for (var i = 0; i < res.objectUnitList.length; i++) {
              res.objectUnitList[i].d9OverheadLineObjectId = id
              res.objectUnitList[i].templateCode = template
              brands.push(res.objectUnitList[i].brand)
            }
            for (var j = 0; i < res.objectUnitList.length; j++) {
              res.objectUnitList[i].brands = brands
            }
            obj[id] = res.objectUnitList
            setChild((child) => {
              return {
                ...child,
                ...obj
              }
            })
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        }
        )
    }
  }

  //新建编辑
  const check = (type, record) => {
    setModalProperty({ title: type === "detail" ? "查看详情" : "编辑", fcCode: record.fcCode, objectMark: record.objectMark, mainId: record.d9OverheadLineObjectId, templateCode: record.templateCode, type: type, id: record.id, edit: type === "detail" ? true : false })
    setVisible({ ...visible, showCheckModal: true })
  }

  //编辑
  const edit = (type, record) => {
    setModalProperty({ title: "编辑", type: type, desc: record.desc, fcCode: record.fcCode, objectMark: record.objectMark, mainId: record.d9OverheadLineObjectId, templateCode: record.templateCode, unitSn: record.unitSn, id: record.id ? record.id : record.unitTemplateId, objectId: record.id, edit: true, cls: record.firstLevelCls, brand: record.brand, modelNumber: record.modelNumber, spec: record.spec, commissDate: record.commissDate })
    setVisible({ ...visible, showCheckModal: true })
  }

  //查看详情
  const showDetil = (type, record) => {
    setModalProperty({ title: "查看详情", type: type, commissDate: record.commissDate, fcCode: record.fcCode, objectMark: record.objectMark, id: record.id ? record.id : record.unitTemplateId, edit: false, detil: record.id ? false : true })
    setVisible({ ...visible, showCheckModal: true })
  }

  const pageNumberOnChange = (page) => {
    setPaging({
      ...paging,
      currentPage: page
    })
    setDirty(dirty + 1)
  }

  const pageNumberOnChange2 = (page) => {
    setPaging2({
      ...paging2,
      currentPage: page
    })
    setDirty(dirty + 1)
  }

  const pageNumberOnChange3 = (page) => {
    setPaging3({
      ...paging3,
      currentPage: page
    })
    setDirty(dirty + 1)
  }

  const unitListexpanded = (record) => {
    return (
      <Table
        rowKey="id"
        columns={unitColumns}
        dataSource={child[record.id]}
        pagination={false}
      />
    );
  }

  const onCheckBox = (event) => {
    if (event.target.checked) {
      setSelectedCodes(allCodes)
      setChecked(true)
    } else {
      setSelectedCodes([])
      setChecked(false)
    }
  }

  function onChange(pagination, filters, sorter) {
    const filterArr = []
    filterArr.push({ property: "brdName", value: filters.brdName ? filters.brdName[0] : "" })
    filterArr.push({ property: "descr", value: filters.descr ? filters.descr[0] : "" })
    filterArr.push({ property: "modelNumber", value: filters.modelNumber ? filters.modelNumber[0] : "" })
    filterArr.push({ property: "objectMark", value: filters.objectMark ? filters.objectMark[0] : "" })
    setFilter(filterArr)
    setDirty(dirty => dirty + 1)
  }

  //搜索
  const search = () => {
    if (templateRef.current.state.value) {
      setFilter([{ "property": "clsName", "value": templateRef.current.state.value }])
    } else {
      setFilter([])
    }

    setDirty(dirty => dirty + 1)
  }

  return (
    <React.Fragment>
      <Row className={commonStyles.searchForm}>
        <Col span={5}><Input placeholder="请输入设备分类" ref={templateRef} onPressEnter={search} /></Col>
        <Col offset={1}><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>
      <div style={{ margin: '0 30px' }}>
        <Tabs defaultActiveKey="1" onChange={onChangePane} tabBarExtraContent={createBarExtraContent()}>
          <Tabs.TabPane tab="设备管理" key="1">
            <Table columns={objColumns} rowSelection={rowSelection} dataSource={objData} loading={loading} onChange={onChange}
              expandedRowRender={(record) => unitListexpanded(record)}
              onExpand={(expanded, record) => renderChildData(expanded, record.id, record.template)
              }
              rowKey="id" pagination={false} />
            <Col>
              <Checkbox checked={isChecked} onChange={onCheckBox}>全选</Checkbox>
              <Button type="danger" ghost onClick={() => { setVisible({ ...visible, showEditModal: true }) }}>批量修改</Button>
            </Col>
            <Row type="flex" justify="end" style={{ margin: 30 }}>
              <Col><Pagination onShowSizeChange={pageSizeChange} pageSize={paging.pageSize} onChange={pageNumberOnChange} total={paging.total} current={paging.currentPage} showSizeChanger showQuickJumper /></Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="更换设备" key="2">
            <Table columns={changeColumns} dataSource={objChangeData} loading={loading}
              rowKey="id" pagination={false} />
            <Row type="flex" justify="end" style={{ margin: 30 }}>
              <Col><Pagination onShowSizeChange={pageSizeChange2} pageSize={paging2.pageSize} onChange={pageNumberOnChange2} total={paging2.total} current={paging2.currentPage} showSizeChanger showQuickJumper /></Col>
            </Row>
            {/* {objData.map((item, index) => {
            if(item.item === '11'){
              return(
            <Card hoverable key={index} bordered={false} rowKey={index} bodyStyle={{width:"100%"}}>
                <Row align="middle">
                <Col span={1}>
                    <p style={{color:"red"}}>{item.item}</p>
                  </Col>
                  <Col span={4}>
                    <p>原设备品牌西门子</p>
                    <p>原设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>新设备品牌西门子</p>
                    <p>新设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>更换原因默认15个字</p>
                    <p>关联工单1211321221121</p>
                  </Col>
                  <Col span={4}>
                    <p>更换时间2020-12-12</p>
                    <p>负责人李丽丽</p>
                  </Col>
                </Row>
              </Card>
              )
        } else if(item.item === '22'){
          return(
            <Card key={index} hoverable bordered={false} bodyStyle={{width:"100%"}}>
                <Row align="middle">
                <Col span={1}>
                    <p style={{color:"green"}}>{item.item}</p>
                </Col>
                <Col span={4}>
                    <p>设备分类</p>
                    <p>柔性触网</p>
                  </Col>
                  <Col span={4}>
                    <p>原设备品牌西门子</p>
                    <p>原设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>新设备品牌西门子</p>
                    <p>新设备型号HM-HL</p>
                  </Col>
                  <Col span={4}>
                    <p>更换原因默认15个字</p>
                    <p>关联工单1211321221121</p>
                  </Col>
                  <Col span={4}>
                    <p>更换时间2020-12-12</p>
                    <p>负责人李丽丽</p>
                  </Col>
                </Row>
              </Card>
              )
            } else {
              return ''
            }
          })
          }
          <Row type="flex" justify="space-between" style={{margin:30}}>
            <Col><Pagination showSizeChanger showQuickJumper /></Col>
          </Row> */}
          </Tabs.TabPane>
          <Tabs.TabPane tab="维护信息" key="3">
            <Table rowKey="id" columns={maintainColumns} dataSource={objRepairData} pagination={false} />
            <Row type="flex" justify="end" style={{ margin: 30 }}>
              <Col><Pagination onShowSizeChange={pageSizeChange3} pageSize={paging3.pageSize} onChange={pageNumberOnChange3} total={paging3.total} current={paging3.currentPage} showSizeChanger showQuickJumper /></Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
        <NewUnit {...{ handleCancel, objId, id: id, MyContext, template, setDirty, visible: visible.showUnit, renderChildData }} />
        <ObjectDetilModal {...{ handleCancel, objId, user, MyContext, visible: visible.showDetil }} />
        <ObjectModal {...{ handleCancel, line: props.line, MyContext, renderChildData, objId, setDirty, modalTitle, visible: visible.showObject }} />
        <PropStdModal {...{ visible: visible.showParametersStandard, modalProperty, handleCancel }} />
        <CheckModal {...{ visible: visible.showCheckModal, setDirty, template, modalProperty, renderChildData, MyContext, handleCancel }} />
        <ChangeObjectModal {...{ handleCancel, MyContext, renderChildData, objData, line: props.line, setDirty, visible: visible.showChangeObject }} />
        <MaintainModal {...{ handleCancel, MyContext, setDirty, visible: visible.showAddMaintenance }} />
        <EditModal {...{ handleCancel, MyContext, setDirty, visible: visible.showEditModal, selectedCodes }} />

      </div>

    </React.Fragment>
  )
}

export default React.memo(ObjectTable)
