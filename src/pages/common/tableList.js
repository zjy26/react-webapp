import React, { useEffect, useState } from 'react'
import { Table, Row, Col, Space, Button, Tooltip, Divider, Popconfirm, message, Modal, Form } from 'antd'
import { FormOutlined, DeleteOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'

const ContentModal = (props) => {
  const { visible, setVisible, modalTitle, modalType, modalContentId, content, form, editUrl, addUrl, detailUrl, setDirty } = props
  useEffect(() => {
    if(visible){
      if(modalType === "edit") {
        detailUrl(modalContentId)
        .then(res => {
          form.setFieldsValue({...res})
        })
      } else {
        form.setFieldsValue({
          id: null,
          port: null,
          ip: null
        })
      }
    }
  }, [visible, modalType])

  const handleOk = () => {
    form.validateFields()
    .then(values => {
      if(modalType === "edit") {
        editUrl()
        .then(res => {
          if(res && res.actionErrors) {
            message.error(res.actionErrors.toString())
          } else if(res && res.success) {
            message.success("编辑成功")
            setDirty(dirty => dirty +1)
          } else {
            message.error("编辑失败")
          }
        })
        .catch(err => console.error(`${err}: 编辑失败`))
      } else {
        addUrl()
        .then(res => {
          if(res && res.actionErrors) {
            message.error(res.actionErrors.toString())
          } else if(res && res.success) {
            message.success("新建成功")
            setDirty(dirty => dirty +1)
          } else {
            message.error("新建失败")
          }
        })
        .catch(err => console.error(`${err}: 新建失败`))
      }
    })
  }
  return (
    <Modal
      getContainer={false}
      width={800}
      title={modalTitle} 
      visible={visible} 
      onOk={handleOk} 
      onCancel={() => setVisible(false)}
    >
      {content}
    </Modal>
  )
}

export const TableList = (props) => {
  const { title, toolbar, loading, setLoading, options, columns, data, scroll, setData, dirty, setDirty, content, form, filter,  listUrl, deleteUrl, editUrl, addUrl, detailUrl } = props
  const [visible, setVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState("新建")
  const [modalType, setModalType] = useState("edit")
  const [modalContentId, setModalContentId] = useState("")
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })

  useEffect(() => {
    setLoading(true)
    listUrl({filter: JSON.stringify(filter)})
    .then(res => {
      setData(res)
      setLoading(false)
      setPager({
        ...pager,
        total: res.total
      })
      // if(res && res.modesl) {
      //   setLoading(false)
      //   setData(res.models)
      // }
    })
    .catch(err => console.error(`${err}: 请求失败`))
  }, [dirty, filter])

  //删除
  const deleteItem = (id) => {
    deleteUrl(id)
    .then(res => {
      if(res && res.actionErrors) {
        message.error(res.actionErrors.toString())
      } else if(res && res.success) {
        message.success("删除成功")
        setDirty(dirty => dirty +1)
      } else {
        message.error("删除失败")
      }
    })
    .catch(err => console.error(`${err}: 删除失败`))
  }

  //新建、编辑
  const showModal = (type, id) => {
    setVisible(true)
    setModalTitle(type==="edit" ? "编辑" : "新建")
    setModalType(type)
    setModalContentId(id)
  }

  return (
    <React.Fragment>
      <Table
        rowKey="id"
        title={
          () => <Row justify='space-between'>
            <Col><h3>{title}</h3></Col>
            <Col>
              <Space>
                {
                  toolbar
                  ? toolbar
                  : <Button type="primary" onClick={()=>showModal("new", "")}>新建</Button>
                }
              </Space>
            </Col>
          </Row>
        }
        loading={loading}
        columns={[
          ...columns,
          options
          ? options
          : {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            fixed: 'right',
            width: 200,
            render: (_, record) => {
              return (
                <>
                  <Tooltip title="编辑" placement="bottom">
                    <FormOutlined onClick={()=>showModal("edit", record.id)} />
                  </Tooltip>
                  <Divider type="vertical" />
                  <Popconfirm title="是否删除此配置，删除后数据不能恢复？"
                    onConfirm={() => { deleteItem(record.id) }}
                  >
                    <Tooltip title="删除" placement="bottom"><DeleteOutlined /></Tooltip>
                  </Popconfirm>
                </>
              )
            }
          }
        ]}
        dataSource={data}
        scroll={scroll}
        pagination={{
          showTotal: () => `共 ${pager.total} 条`,
          current: pager.current,
          total: pager.total,
          pageSize: pager.limit,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: (current, pageSize) => {
            setPager({
              ...pager,
              current: 1,
              page: 1,
              start: 0,
              limit: pageSize
            })
            setDirty(dirty => dirty +1)
          },
          onChange: ((page, pageSize) => {
            setPager({
                ...pager,
                current: page,
                page: page,
                start: page>1 ? pageSize*(page-1) : 0,
                limit: pageSize
            })
            setDirty(dirty => dirty +1)
          })
        }}
      />
      <ContentModal {...{visible, setVisible, modalTitle, modalType,  content, form, editUrl, addUrl, detailUrl, modalContentId, setDirty }} />
    </React.Fragment>
  )
}

export const SearchModule = (props) => {
  const { getFields, setFilter } = props
  const [searchForm] = Form.useForm()
  const [expand, setExpand] = useState(false)

  const onFinish = () => {
    searchForm.validateFields()
    .then(values => {
      const filterArr = []
      const objArr= Object.keys(values)
      objArr.forEach(key => {
        if(values[key]) {
          let filterObj = {}
          filterObj["property"] = key
          filterObj["value"] = values[key].toString()
          filterArr.push(filterObj)
        }
      })
      setFilter(filterArr)
    })
  }
  return (
    <Form
      form={searchForm}
      onFinish={onFinish}
    >
      <Row gutter={24}>{getFields(expand)}</Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => {
              searchForm.resetFields();
            }}
          >
            重置
          </Button>
          <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <>收起<UpOutlined /></> : <>展开<DownOutlined /></>}
          </a>
        </Col>
      </Row>
    </Form>
  )
}