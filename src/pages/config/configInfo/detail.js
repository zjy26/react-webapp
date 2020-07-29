import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Row, Col, Divider, Radio, Modal, message } from 'antd'
import { ExclamationCircleOutlined, FormOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import DetailModal from './detailModal'
import { setTable, MainTable, getColumnSearchProps } from '../../common/table'
import { configEntity } from '../../../api/config/configInfo'
import commonStyles from '../../Common.module.scss'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const Detail = props => {
  const { id } = props.match.params

  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [edit, setEdit] = useState(false)
  const [visible, setVisible] = useState(false)
  const [modalProperty, setModalProperty] = useState({})
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })
  const [data, setData] = useState([]) //业务数据详情列表
  const [searchProps, setSearchProps] = useState({
    column: "",
    text: ""
  })
  const [filter, setFilter] = useState([])

  const handleCancel = () => {
    setVisible(false)
  }

  const columns = [
    {
      title: '代码',
      dataIndex: 'code'
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      ...getColumnSearchProps('name', "名称", searchProps, setSearchProps)
    },
    {
      title: '描述',
      dataIndex: 'descr',
      ellipsis: true
    },
    {
      title: '优先级',
      dataIndex: 'priority'
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      render: (text) => {
        if (text === false) {
          return "启用"
        } else {
          return "停用"
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'comment',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 260,
      render: (text, record) => {
        return (
          <>
            <FileSearchOutlined onClick={() => { checkList("check", record.id) }} hidden />
            <Divider type="vertical" />
            <FormOutlined
              onClick={
                () => edit ? message.info('基础信息处于编辑状态，请先保存或取消') : checkList("edit", record.id)
              }
            />
            <Divider type="vertical" />
            <DeleteOutlined onClick={() => { deleteList(record.id) }} hidden />
          </>
        )
      }
    }
  ]

  useEffect(() => {
    document.title = "业务基础数据"

    configEntity.configEntityDetail(id)
      .then(res => {
        setInitValues(res)
        form.resetFields()
      })
      .catch(() => {
        console.log("业务基础数据详情获取失败")
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, id])

  useEffect(() => {
    setTable(configEntity.configEntityCodeList, setData, setLoading, pager, setPager, filter, null, id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dirty])

  //基本信息编辑保存
  const save = () => {
    form.validateFields()
      .then(values => {
        form.isFieldsTouched() ?
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              const params = { ...values, code: id, _method: 'PUT' }
              configEntity.configEntityUpdate(id, params)
                .then((res) => {
                  if (res.success) {
                    setInitValues(values)
                    message.success("保存成功")
                    setEdit(false)
                  } else {
                    message.error(res.fieldErrors.name)
                  }
                })
            }
          })
          : setEdit(false)
      })
  }

  //取消编辑
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }


  //业务数据新增编辑查看
  const checkList = (type, id) => {
    switch (type) {
      case "add":
        setModalProperty({ title: "新建", type: "add", childId: null })
        break;
      case "edit":
        setModalProperty({ title: "编辑", type: "edit", childId: id })
        break;
      default:
        setModalProperty({ title: "查看详情", type: "check", childId: id })
    }
    setVisible(true)
  }

  //业务列表数据删除
  const deleteList = (id) => {
    edit ? message.info('基础信息处于编辑状态，请先保存或取消') :
      Modal.confirm({
        title: '是否确认删除',
        icon: <ExclamationCircleOutlined />,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          configEntity.configEntityCodeDelete(id)
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
      <Row>
        <Link to="/config/config-info"><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Link>
        <h2 style={{ margin: '-5px 0 10px 20px' }}>业务基础数据详情</h2>
      </Row>

      <div className={commonStyles.basicForm}>
        <Row>
          <Col span={20}><h3>基础信息</h3></Col>
          {
            edit ?
              <Col span={4} align="right">
                <Button type="link" onClick={save}>保存</Button>
                <Button type="link" onClick={cancel}>取消</Button>
              </Col> :
              <Col span={4} align="right">
                <Button type="link" onClick={() => { setEdit(true) }}>编辑</Button>
              </Col>
          }
        </Row>
        <Form
          {...formItemLayout}
          name="configInfoDetail"
          form={form}
          initialValues={initValues}
          style={{ margin: 20 }}
        >
          {
            edit ?
              <Row>
                <Col span={8}>
                  <Form.Item
                    label="业务数据名称"
                    name="name"
                    rules={[
                      { whitespace: true, message: '内容不能为空' },
                      { required: true, message: '请输入业务数据名称' },
                      { max: 20, message: '最大长度为20个字符' }
                    ]}
                  >
                    <Input placeholder="请输入业务数据名称" />
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
                    <Radio.Group>
                      <Radio value={2}>代码</Radio>
                      <Radio value={1}>分类</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="代码类型" name="codeType">
                    <Select placeholder="请选择代码类型">
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={2}>数字及文本</Select.Option>
                      <Select.Option value={1}>数字</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="应用类型" name="category">
                    <Radio.Group disabled>
                      <Radio value={1}>业务</Radio>
                      <Radio value={2}>系统</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="描述" name="descr">
                    <Input.TextArea placeholder="请输入描述" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="备注" name="comment">
                    <Input.TextArea placeholder="请输入备注" />
                  </Form.Item>
                </Col>
              </Row>
              :
              <Row>
                <Col span={8}>
                  <Form.Item label="业务数据名称">
                    {initValues.name}
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="类型">
                    {initValues.type}
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="代码类型">
                    {initValues.codeType}
                  </Form.Item>
                </Col>
                <Col span={12} hidden>
                  <Form.Item label="应用类型">
                    {initValues.category === 1 ? "业务" : "系统"}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="描述">
                    {initValues.descr}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="备注">
                    {initValues.comment}
                  </Form.Item>
                </Col>
              </Row>
          }
        </Form>
      </div>
      <Row type="flex" justify="space-between" className={commonStyles.topHeader}>
        <Col><h3>业务数据详情</h3></Col>
        <Col>
          <Button
            type="primary"
            onClick={
              () => edit ? message.info('基础信息处于编辑状态，请先保存或取消') : checkList("add", null)
            }>
            添加
          </Button>
        </Col>
      </Row>

      <MainTable
        {...{
          columns, data, loading, pager, setPager, setDirty, setFilter,
          rowkey: "code",
        }}
      />

      <DetailModal {...{ visible, handleCancel, modalProperty, entity: id, setDirty }} />
    </React.Fragment>
  )
}

export default React.memo(Detail)
