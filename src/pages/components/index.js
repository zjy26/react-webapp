import React, { useState } from 'react'
import { SearchModule, TableList } from '../../pages/common/tableList'
import { Form, Col, Input, Select, DatePicker, Row } from 'antd'
import { robotConfig } from '../../api'
import moment from 'moment'

const Index = () => {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dirty, setDirty] = useState(0)
  const [filter, setFilter] = useState([])

  const [modalForm] = Form.useForm()

  const getFields = (expand) => {
    const count = expand ? 10 : 6;
    const items = [
      <Col span={8} key={1}>
        <Form.Item
          name="title"
          label="公告标题"
        >
          <Input placeholder="请输入公告标题" />
        </Form.Item>
      </Col>,
      <Col span={8} key={2}>
        <Form.Item
          name="createdbyFullname"
          label="发布人"
        >
          <Select placeholder="请选择发布人" />
        </Form.Item>
      </Col>,
    ]
    const children = items.slice(0,count)
    return children;
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      ellipsis: true,
    },
    {
      title: '服务器IP',
      dataIndex: 'ip'
    },
    {
      title: '服务器端口',
      dataIndex: 'port'
    },
    {
      title: '视频推流地址',
      dataIndex: 'cameraStreamUrl'
    },
  ]

  const content = <Form name="systemNoticeForm" form={modalForm} layout="vertical">
    <Row justify="space-around">
      <Col span={6}>
        <Form.Item
          label="服务器IP"
          name="ip"
          rules={[
            { whitespace: true, message: '内容不能为空' },
            { required: true, message: '请输入公告标题' }
          ]}
        >
          <Input placeholder="请输入公告标题" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label="发布时间段"
          name="time"
        >
          <DatePicker.RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label="公告内容"
          name="content"
        >
          <Input.TextArea placeholder="请输入公告内容" />
        </Form.Item>
      </Col>
    </Row>
  </Form>

  const modalSubmit = () => {
    modalForm.validateFields()
    .then(values => {
      console.log(values)
    })
  }
  return (
    <React.Fragment>
      <SearchModule {...{ getFields, setFilter, total: 2 }}/>
      <TableList
        title="系统公告"
        url={{
          list: robotConfig.robotConfigList,
          detail: robotConfig.robotConfigDetail,
          delete: robotConfig.robotConfigDelete,
          edit: robotConfig.robotConfigEdit,
          add: robotConfig.robotConfigAdd
        }}
        form={modalForm}
        //detailLink="/components/detail/"
        {...{loading, setLoading, data, setData, columns, filter, dirty, setDirty, content, modalSubmit}}
      />
    </React.Fragment>
  )
}

export default React.memo(Index)
