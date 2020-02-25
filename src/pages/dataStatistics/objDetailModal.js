import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Modal, Tabs, Table } from 'antd';

const brandDetailColumns = [
  {
    title: '品牌名称',
    dataIndex: 'brandName',
    key: 'brandName'
  },
  {
    title: '设备数量',
    dataIndex: 'objNum',
    key: 'objNum'
  },
  {
    title: '故障数量',
    dataIndex: 'faultNum',
    key: 'faultNum'
  },
  {
    title: '停用数量',
    dataIndex: 'stopNum',
    key: 'stopNum'
  },
  {
    title: '停用时长',
    dataIndex: 'stopLength',
    key: 'stopLength'
  },
  {
    title: '故障率',
    dataIndex: 'faultRate',
    key: 'faultRate'
  }
]

const mileageDetailColumns = [
  {
    title: '设备名称',
    dataIndex: 'objName',
    key: 'objName'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'runningMileage',
    key: 'runningMileage'
  },
  {
    title: '故障次数',
    dataIndex: 'faultNum',
    key: 'faultNum'
  },
  {
    title: '停用维护时间',
    dataIndex: 'stopMaintenanceTime',
    key: 'stopMaintenanceTime'
  }
]

const { TabPane } = Tabs;
const ObjDetailModal = props => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    brandDetailData: [],
    mileageDetailData: []
  })

   //获取列表数据
   useEffect(() => {
    Axios.get('/api/objStatisticsDetail').then(res =>{
      if(res.status === 200){
        setData({
          brandDetailData: res.data.brandDetailData,
          mileageDetailData: res.data.mileageDetailData
        });
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  return (
    <Modal
      title="查看详情"
      okText="确认"
      cancelText="取消"
      width="650px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Tabs  type="card">
        <TabPane tab="品牌统计" key="1">
          <Table columns={brandDetailColumns} dataSource={data.brandDetailData} size="small" />
        </TabPane>
        <TabPane tab="运行里程统计" key="2">
          <Table columns={mileageDetailColumns} dataSource={data.mileageDetailData} size="small" />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default ObjDetailModal;