import React, { useState } from 'react'
import { TableList, SearchModule } from '../common/tableList'
import { Form, Input, Row, Col } from 'antd'
import { robotConfig } from '../../api'

const Index = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [filter, setFilter] = useState([])

  const [form] = Form.useForm()

  const content = <Form form={form} layout="vertical" name="form1">
    <Row justify="space-around">
      <Col span={6}>
        <Form.Item label="ID" name="id">
          <Input placeholder="请输入ID" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="ip" name="ip">
          <Input placeholder="请输入服务器ip" />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="port" name="port">
          <Input placeholder="请输入服务器端口" />
        </Form.Item>
      </Col>
    </Row>
  </Form>
  
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
  ];

  const getFields = (expand) => {
    const count = expand ? 10 : 6;
    const children = [];

    for (let i = 0; i < count; i++) {
      children.push(
        <Col span={8} key={i}>
          <Form.Item
            name={`field-${i}`}
            label={`Field ${i}`}
          >
            <Input placeholder="placeholder" />
          </Form.Item>
        </Col>,
      );
    }

    return children;
  };

  return (
    <div style={{margin: 20}}>
      <SearchModule getFields={(expand) => getFields(expand)} {...{setFilter}}/>
      <TableList 
        title="列表"
        listUrl={robotConfig.robotConfigList}
        detailUrl={robotConfig.robotConfigDetail}
        deleteUrl={robotConfig.robotConfigDelete}
        editUrl={robotConfig.robotConfigEdit}
        addUrl={robotConfig.robotConfigAdd}
        {...{setLoading, loading, setData, data, columns, dirty, setDirty, content, form, filter}}
      />
    </div>
  )
}

export default React.memo(Index)