import React, { useState, useEffect } from 'react';
import { Modal, Table, Row, Col, Checkbox, Button, Pagination } from 'antd';
import Axios from 'axios';

//列表逐条数据选择
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  }
};
const AbnormalModal = props => {
  const [data, setData] = useState([]);  //列表数据
  const [loading, setLoading] = useState(true);
  //列表条目
  const columns = [
    {
      title: '物理位置编码',
      dataIndex: 'locationCode'
    },
    {
      title: '设备名称',
      dataIndex: 'objName',
    },
    {
      title: '属性',
      dataIndex: 'attribute',
    },
    {
      title: '巡检数据',
      dataIndex: 'data',
    },
    {
      title: '预设值',
      dataIndex: 'presetValue',
    },
    {
      title: 'CIOS对应值',
      dataIndex: 'cios',
    },
    {
      title: '巡检结论',
      dataIndex: 'conclusion',
    },
    {
      title: '判定结果',
      dataIndex: 'result',
      render: () => {
        return (
          <span>
            <Button type="link" size={'small'}>异常</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'}>正常</Button>
          </span>
        )
      }
    }
  ];

  //获取列表数据
  useEffect(() => {
    Axios.get('/api/abnormalList').then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);
  return (
    <Modal
      title="异常数据"
      okText="确认"
      cancelText="取消"
      width = "850px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={false}/>
      <Row type="flex" justify="space-between" style={{margin:30}}>
        <Col>
          <Checkbox>全选</Checkbox>
          <Button type="danger" ghost>异常</Button>
          <Button type="danger" ghost>正常</Button>
        </Col>
        <Col><Pagination total={20} showSizeChanger showQuickJumper /></Col>
      </Row>
    </Modal>
  )
}

export default AbnormalModal;