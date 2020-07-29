import React, { useState, useEffect, useContext } from 'react'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
import { Modal, Button, Row, Col, message, Divider } from 'antd'
import { setTable, MainTable } from '../../../../common/table'
import CheckSettingModal from './modal'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'

const Setting = props => {
  const { MyContext } = props
  const { templateCode } = useContext(MyContext)

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
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})
  const [unitOption, setUnitOption] = useState([])

  useEffect(() => {
    //静态部件模板
    configObjectTemplate.unitTemplateList({ template: templateCode, isStatic: true })
      .then(res => {
        if (res && res.models) {
          setUnitOption(res.models)
        }
      })
  }, [templateCode])

  useEffect(() => {
    setTable(configObjectTemplate.settingValList, setData, setLoading, pager, setPager, [], { template: templateCode })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const columns = [
    {
      title: '关联部件',
      dataIndex: 'unit',
      render: (text) => {
        const item = unitOption.find(obj => obj.code === text)
        if (item) {
          return `${item.sn}-${item.name}`
        }
      }
    },
    {
      title: '组别',
      dataIndex: 'group'
    },
    {
      title: '保护类型',
      dataIndex: 'protectType'
    },
    {
      title: '运行方式',
      dataIndex: 'runType'
    },
    {
      title: '保护参数',
      dataIndex: 'protectParam'
    },
    {
      title: '设定参数',
      dataIndex: 'setPrarm'
    },
    {
      title: '整定值',
      dataIndex: 'defaultValue'
    },
    {
      title: '计量单位',
      dataIndex: 'uomDesc'
    },
    {
      title: '时限参数',
      dataIndex: 'timeLimitParam'
    },
    {
      title: '动作时限',
      dataIndex: 'actTimeLimit'
    },
    {
      title: '动作计量单位',
      dataIndex: 'actUom'
    },
    {
      title: '作用',
      dataIndex: 'effect',
    },
    {
      title: '关联属性报警',
      dataIndex: 'alarmPropertyDesc',
    },
    {
      title: '关联属性投用',
      dataIndex: 'applyPropertyDesc',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <FormOutlined onClick={() => { check("edit", record.id) }} />
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteItem(record.id) }} />
          </>
        )
      }
    }
  ]

  const handleCancel = () => {
    setVisible(false)
  }

  //新建编辑
  const check = (type, id) => {
    setVisible(true)
    setModalProperty({ title: type === "add" ? "新建" : "编辑", type: type, id: id })
  }

  //列表删除
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除',
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      onOk: () => {
        configObjectTemplate.settingValDelete(id)
          .then(() => {
            message.success("删除成功")
            setDirty((dirty) => dirty + 1)
          })
      },
      onCancel() {
      },
    })
  }

  return (
    <React.Fragment>
      <Row type="flex" justify="space-between">
        <Col><h3>整定值</h3></Col>
        <Col><Button type="primary" onClick={() => { check("add", null) }} style={{ marginRight: 20 }}>新建</Button></Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty,
          rowkey: "group",
          scroll: {x: 1600}
        }}
      />

      <CheckSettingModal {...{ visible, handleCancel, modalProperty, setDirty, MyContext, unitOption }} />
    </React.Fragment>
  )
}

export default React.memo(Setting)
