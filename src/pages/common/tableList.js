import React, { useEffect, useState } from 'react'
import { Table, Row, Col, Space, Button, Tooltip, Divider, Popconfirm, message, Modal, Form } from 'antd'
import { FormOutlined, DeleteOutlined, UpOutlined, DownOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

//搜索
export const SearchModule = (props) => {
  const { total, getFields, setFilter } = props
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
    <div style={{ backgroundColor: '#fff' }}>
      <Form
        form={searchForm}
        onFinish={onFinish}
        style={{margin: 20, padding: 25}}
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
            {
              total > 6 ?
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
              : null
            }

          </Col>
        </Row>
      </Form>
    </div>
  )
}

//新建、编辑弹窗
const ContentModal = (props) => {
  const { visible, setVisible, modalProperty, content, form, url, setDirty, modalSubmit } = props
  const [okLoading, setOkLoading] = useState(false)
  useEffect(() => {
    if(visible){
      setOkLoading(false)
      if(modalProperty && modalProperty.type === "edit") {
        form.setFieldsValue({id: 2})
        url.detail(modalProperty.id)
        .then(res => {
          form.setFieldsValue({...res})
        })
      } else {
        form.resetFields()
      }
    }
  }, [visible, modalProperty])

  const handleOk = () => {
    form.validateFields()
    .then(values => {
      setOkLoading(true)
      if(modalProperty.type === "edit") {
        url.edit(modalProperty.id, {...values, _method:'PUT'})
        .then(res => {
          if(res && res.actionErrors) {
            message.error(res.actionErrors.toString())
            setOkLoading(false)
          } else if(res && res.success) {
            message.success("编辑成功")
            setDirty(dirty => dirty +1)
            setVisible(false)
          } else {
            message.error("编辑失败")
            setOkLoading(false)
          }
        })
        .catch(err => console.error(`${err}: 编辑失败`))
      } else {
        url.add({...values, _method: 'PUT'})
        .then(res => {
          if(res && res.actionErrors) {
            message.error(res.actionErrors.toString())
            setOkLoading(false)
          } else if(res && res.success) {
            message.success("新建成功")
            setDirty(dirty => dirty +1)
            setVisible(false)
          } else {
            message.error("新建失败")
            setOkLoading(false)
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
      title={modalProperty.title}
      visible={visible}
      onOk={modalSubmit ? modalSubmit : handleOk}
      onCancel={() => setVisible(false)}
      okButtonProps={{ loading: okLoading }}
    >
      {content}
    </Modal>
  )
}

//列表
export const TableList = (props) => {
  const { title, toolbar, loading, setLoading, options, columns, data, scroll, setData, dirty, setDirty, content, form, filter, url, modalSubmit, detailLink } = props
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({
    type: "type",
    title: "新建",
    id: null,
  })
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })

  useEffect(() => {
    setLoading(true)
    url.list({filter: JSON.stringify(filter)})
    .then(res => {
      if(res) {
        setLoading(false)
        setData(res)
        setPager({
          ...pager,
          total: res.total
        })
      }
    })
    .catch(err => console.error(`${err}: 请求失败`))
  }, [dirty, filter])

  //删除
  const deleteItem = (id) => {
    url.delete(id)
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
    setModalProperty({type, id, title: type==="edit" ? "编辑" : "新建"})
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
                  : detailLink ? <Link to={detailLink + null}><Button type="primary">新建</Button></Link> : <Button type="primary" onClick={()=>showModal("new", null)}>新建</Button>
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
                  {
                    detailLink
                    ? <Tooltip title="查看详情" placement="bottom">
                        <Link to={detailLink + record.id}><FileSearchOutlined /></Link>
                      </Tooltip>
                    : <Tooltip title="编辑" placement="bottom">
                        <FormOutlined onClick={()=>showModal("edit", record.id)} />
                      </Tooltip>
                  }
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
      <ContentModal {...{visible, setVisible, modalProperty, content, form, url, setDirty, modalSubmit, detailLink}} />
    </React.Fragment>
  )
}
