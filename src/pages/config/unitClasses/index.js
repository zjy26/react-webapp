import React, { useState, useEffect } from 'react'
import { Row, Button, Table, Divider, message, Modal, Col } from 'antd'
import { connect } from 'react-redux'
import { unitClasses } from '../../../api'
import AddModal from './addModal'
import EditModal from './editModal'
import commonStyles from '../../Common.module.scss'
import { UpOutlined, DownOutlined, DeleteOutlined, FormOutlined, PlusSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const addLevel = (data, level) => {
  data.forEach(item => {
    item['level'] = level
    if (item.children.length) {
      let nextLevel = level + 1
      addLevel(item.children, nextLevel)
    }
  })
}

const UnitClasses = props => {
  const [data, setData] = useState([])
  const [read, setRead] = useState(false)
  const [editNew, setEditNew] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [currentId, setCurrentId] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = '部件分类'
    setLoading(true)
    unitClasses.unitClassesList({
      fun: 'asset.unit',
      node: 'root',
      mosFun: 'asset.unitClass',
      org: "*"
    })
      .then(res => {
        if (res !== null && res.children !== null) {
          addLevel([res], 1)
          setData([res])
          setLoading(false)
        } else {
          setData([])
        }
      })
      .catch(() => {
        setData([])
        console.log("数据加载失败")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty])

  const destoryItem = (record) => {
    if (record !== null) {
      Modal.confirm({
        title: '删除提示',
        icon: <ExclamationCircleOutlined />,
        content: '是否删除此层级，删除后所属子级会一起删除，且数据不能恢复？',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          unitClasses.unitClassesDelete(record, { _method: "DELETE" })
            .then(res => {
              if (res.actionErrors && res.actionErrors.length) {
                message.error(res.actionErrors[0])
              } else {
                message.success('删除成功')
              }
              setDirty(dirty => dirty + 1)
            })
            .catch(error => {
              message.error('删除失败')
            })
        },
        onCancel() {
        },
      })
    } else {
      message.success('请先选中记录！')
    }
  }

  const columns = [
    {
      title: '描述',
      dataIndex: 'text',
      render: (text, record) => {
        return (
          record.id === 'root' ? '供电公司' : text
        )
      }
    },
    {
      title: '分类代码',
      dataIndex: 'code',
      render: (text, record) => {
        return (
          record !== null ? record.model ? record.model.code : '' : null
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      render: (text, record) => {
        return (
          record !== null ? record.model ? record.model.remarks : '' : null
        )
      }
    },
    {
      title: "操作",
      dataIndex: "",
      width: '20%',
      align: 'center',
      render: (text, record) => {
        const addIcon = <PlusSquareOutlined onClick={() => {
          console.log(record)
          setCurrentId(record)
          setEditNew(true)
          console.log(record.level)
        }} />

        const editIcon = record.id !== 'root' ?
          <FormOutlined
            onClick={() => {
              setCurrentId(record)
              setRead(true)
            }} />
          :
          <Button type="link" disabled style={{ padding: 0, margin: 0, border: "none" }}>
            <FormOutlined />
          </Button>

        const deleteIcon = record.id !== 'root' ?
          <DeleteOutlined onClick={() => {
            destoryItem(record.id)
          }} />
          :
          <Button type="link" disabled style={{ padding: 0, margin: 0, border: "none" }}>
            <DeleteOutlined />
          </Button>
        return (
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
  ]

  return (
    <React.Fragment>
      <Row>
        <Button ghost type="link" onClick={() => { props.history.goBack() }}><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Button>
        <h2>部件分类</h2>
      </Row>
      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col></Col>
        <Col>
          <Button type="primary">下载</Button>
        </Col>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        loading={loading}
        key={loading}
        rowKey="id"
        expandable={{
          defaultExpandAllRows: true,
          indentSize: 70,
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children && record.children.length ? expanded ? (
              <DownOutlined onClick={e => onExpand(record, e)} />
            ) : (
                <UpOutlined onClick={e => onExpand(record, e)} />
              ) : null
        }}
      />
      <AddModal {...{ editNew, setEditNew, currentId, setDirty }} />
      <EditModal {...{ read, setRead, currentId, id: currentId.model, setDirty }} />
    </React.Fragment>

  )
}

const mapStateToProps = (state) => ({
  user: state.getIn(['common', 'user']),
  userLine: state.getIn(['common', 'userLine'])
})

export default connect(mapStateToProps, null)(React.memo(UnitClasses))
