import React, { useState, useEffect } from 'react';
import { dataStatistics } from '../../../api'
import { Modal, Tabs, Table } from 'antd';

const brandDetailColumns = [
  {
    title: '品牌名称',
    dataIndex: 'BRD_NAME',
    key: 'BRD_NAME'
  },
  {
    title: '设备数量',
    dataIndex: 'OBJCOUNT',
    key: 'OBJCOUNT'
  },
  {
    title: '故障数量',
    dataIndex: 'FAILURECOUNT',
    key: 'FAILURECOUNT'
  },
  {
    title: '停用数量',
    dataIndex: 'STOPCOUNT',
    key: 'STOPCOUNT'
  },
  {
    title: '停用时长',
    dataIndex: 'SUMSTOPTIME',
    key: 'SUMSTOPTIME'
  },
  {
    title: '故障率',
    dataIndex: 'FAILURERATE',
    key: 'FAILURERATE'
  }
]

const mileageDetailColumns = [
  {
    title: '设备名称',
    dataIndex: 'RO_NAME',
    key: 'RO_NAME'
  },
  {
    title: '类型',
    dataIndex: 'RO_TYPE',
    key: 'RO_TYPE'
  },
  {
    title: '运行里程（km）',
    dataIndex: 'RUNDISTANCE',
    key: 'RUNDISTANCE'
  },
  {
    title: '故障次数',
    dataIndex: 'FAILURECOUNT',
    key: 'FAILURECOUNT'
  },
  {
    title: '停用维护时间',
    dataIndex: 'STOPTIME',
    key: 'STOPTIME'
  }
]

const { TabPane } = Tabs;
const ObjDetailModal = props => {
  const [data, setData] = useState({
    brandDetailData:[],
    mileageDetailData:[]
  });

  //获取列表数据
  useEffect(() => {
    var brand;
    dataStatistics.robotObjGroupByBrandList({robotIds:props.detailData.robotIds,queryDate:props.detailData.queryDate})
    .then(res => {
      if(res.robotObjOrderByBrandList){
        brand = res.robotObjOrderByBrandList
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    dataStatistics.robotObjGroupBycodeList({robotIds:props.detailData.robotIds,queryDate:props.detailData.queryDate})
    .then(res => {
      if(res.robotObjOrderByCodeList){
        setData({
          brandDetailData:brand,
          mileageDetailData:res.robotObjOrderByCodeList
        })
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, props.detailData.currentId]);

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
