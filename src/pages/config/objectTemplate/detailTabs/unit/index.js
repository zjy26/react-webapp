import React, { useState, useEffect, useContext } from 'react'
import { MenuOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Button, Tabs, Dropdown, Menu, message } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import AddPartsModal from './modal/addModal'
import CheckPartsModal from './modal/checkModal'
import ParametersStandardModal from './modal/propStdModal'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const Unit = props => {
  const { MyContext, versionCode } = props
  const { templateCode, unitClassOption, brandOption } = useContext(MyContext)

  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [staticData, setStaticData] = useState([])
  const [dynamicData, setDynamicData] = useState([])
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [activeKey, setActiveKey] = useState("static")
  const [visible, setVisible] = useState({})
  const [modalProperty, setModalProperty] = useState({})

  //部件列表
  useEffect(() => {
    if (activeKey === "static") {
      setTable(configObjectTemplate.unitTemplateList, setStaticData, setLoading, pager, setPager, [], { template: templateCode, isStatic: true })
    } else {
      setTable(configObjectTemplate.unitTemplateList, setDynamicData, setLoading, pager, setPager, [], { template: templateCode, isStatic: false })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, activeKey])

  const columns = [
    {
      title: activeKey === "static" ? "序号" : null,
      dataIndex: 'sn'
    },
    {
      title: '代码',
      dataIndex: 'code'
    },
    // {
    //   title: '分类',
    //   dataIndex: 'utcls'
    // },
    // {
    //   title: '描述',
    //   dataIndex: 'descr'
    // },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '品牌',
      dataIndex: 'utbrand'
    },
    {
      title: '型号',
      dataIndex: 'utmodelNumber'
    },
    {
      title: '规格',
      dataIndex: 'utspec'
    },
    {
      title: '元器件编号',
      dataIndex: 'componentNumber'
    },
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
        const descr = text ? "是" : "否"
        return descr
      }
    },
    // {
    //   title: '变比',
    //   render:(text,record)=>{
    //     return record.transRatio1 +'/'+record.transRatio2
    //   }
    // },
    // {
    //   title: '变比一次参数',
    //   dataIndex: 'transRatio1'
    // },
    // {
    //   title: '变比两次参数',
    //   dataIndex: 'transRatio2'
    // },
    {
      title: '制造商',
      dataIndex: 'manufactName'
    },
    // {
    //   title: 'E码/订货编号',
    //   dataIndex: 'ecode'
    // },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <Button key="detail" type="link" size={'small'} onClick={() => propStd(record.sn, record.code)}>参数标准</Button>
            <Dropdown
              overlay={
                <Menu>
                  {/* <Menu.Item key="check" onClick={()=>{partsParameters(record.id)}}>部件参数</Menu.Item> */}
                  <Menu.Item key="edit" onClick={() => { check("edit", record.id) }}>编辑</Menu.Item>
                  <Menu.Item key="detail" onClick={() => { check("detail", record.id) }}>查看详情</Menu.Item>
                  <Menu.Item key="delete" onClick={() => { deleteItem(record.id) }}>删除</Menu.Item>
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

  const handleCancel = () => {
    setVisible({})
  }

  //新建查看
  const check = (type, id) => {
    if (type === "add") {
      setVisible({ showAdd: true })
      setModalProperty({ title: '新建', type: type })
    } else if ((type === "detail")) {
      setVisible({ showCheck: true })
      setModalProperty({ id: id, type: type })
    } else if ((type === "edit")) {
      setVisible({ showAdd: true })
      setModalProperty({ id: id, type: type, title: '编辑' })
    }
  }

  //列表删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        configObjectTemplate.unitTemplateDelete(id)
          .then((res) => {
            if (res && res.success) {
              setDirty((dirty) => dirty + 1)
              message.success("删除成功")
            }
          })
      },
      onCancel() {
      },
    })
  }

  //参数标准
  const propStd = (sn, code) => {
    setModalProperty({
      unitTemplate: code
    })
    setVisible({ showParametersStandard: true })
  }

  return (
    <React.Fragment>
      <Tabs
        activeKey={activeKey}
        onChange={key => setActiveKey(key)}
        tabBarExtraContent={<Button type="primary" onClick={() => { check("add", null) }}>新建</Button>}
        style={{ margin: '0 30px' }}
      >
        <Tabs.TabPane tab="静态部件" key="static">
          <MainTable
            {...{
              columns, loading, pager, setPager, setDirty,
              rowkey: "code",
              data: staticData,
              scroll: { x: 1600 }
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="动态部件" key="dynamic">
          <MainTable
            {...{
              columns, loading, pager, setPager, setDirty,
              data: dynamicData,
              rowkey: "code",
              scroll: { x: 1600 }
            }}
          />
        </Tabs.TabPane>
      </Tabs>

      <AddPartsModal {...{ visible: visible.showAdd, modalProperty, handleCancel, versionCode, MyContext, activeKey, setDirty }} />
      <CheckPartsModal {...{ visible: visible.showCheck, handleCancel, modalProperty, unitClassOption, brandOption }} />
      <ParametersStandardModal {...{ visible: visible.showParametersStandard, modalProperty, handleCancel, activeKey, MyContext }} />
    </React.Fragment>
  )
}

export default React.memo(Unit)
