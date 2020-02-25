import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Table, Button } from 'antd';
import DetailModal from './detailModal';

const ObjectEvaluation = props => {
  const [data, setData] = useState([]);  //表格数据
  const [visible, setVisible] = useState(false); //弹窗状态
  const [modalTitle, setModalTitle] = useState(null); //弹窗标题
  const [loading, setLoading] = useState(true);

  //列表条目
  const columns = [
    {
      title: '序号',
      key: 'code',
      dataIndex: 'code',
      width: 100
    },
    {
      title: '专业',
      key: 'professional',
      dataIndex: 'professional',
      width: 100
    },
    {
      title: '线路',
      key: 'line',
      dataIndex: 'line',
      width: 100
    },
    {
      title: '站点',
      key: 'site',
      dataIndex: 'site',
      width: 100
    },
    {
      title: '设备类型',
      key: 'objType',
      dataIndex: 'objType',
      width: 100
    },
    {
      title: '设备名称',
      dataIndex: 'objName',
      width: 100
    },
    {
      title: '厂家',
      dataIndex: 'manufacturer',
      width: 100
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 100
    },
    {
      title: '设备投用时间',
      dataIndex: 'objUseTime',
      width: 120
    },
    {
      title: '设备大修周期',
      dataIndex: 'objMaintenanceCycle',
      width: 120
    },
    {
      title: '使用年限',
      dataIndex: 'useTime',
      width: 100
    },
    {
      title: '预防性维护周期',
      dataIndex: 'preventiveMaintenanceCycle',
      width: 130
    },
    {
      title: '上次试验时间',
      dataIndex: 'lastTestTime',
      width: 120
    },
    {
      title: '预防性试验设备评估结论',
      dataIndex: 'preventiveTestObjEvaluation',
      width: 190
    },
    {
      title: '预防性试验情况（是/否）',
      dataIndex: 'preventiveTestSituation',
      width: 200
    },
    {
      title: '年度计划维护频次',
      dataIndex: 'annualPlanMaintenanceFrequency',
      width: 150
    },
    {
      title: '最近维护时间',
      dataIndex: 'lastMaintenanceTime',
      width: 120
    },
    {
      title: '物耗成本',
      dataIndex: 'materialCost',
      width: 100
    },
    {
      title: '设备使用年限',
      dataIndex: 'objUsedYears',
      width: 120
    },
    {
      title: '故障率',
      dataIndex: 'faultRate',
      width: 100
    },
    {
      title: '设备状态',
      dataIndex: 'objState',
      width: 100
    },
    {
      title: '备件储备',
      dataIndex: 'partsReserve',
      width: 100
    },
    {
      title: '技术能力',
      dataIndex: 'technicalAbility',
      width: 100
    },
    {
      title: '物耗值',
      dataIndex: 'materialValue',
      width: 100
    },
    {
      title: '风险权重',
      dataIndex: 'riskWeighting',
      width: 100
    },
    {
      title: '负荷能力',
      dataIndex: 'loadCapacity',
      width: 100
    },
    {
      title: '综合评分',
      dataIndex: 'comprehensiveScore',
      width: 100
    },
    {
      title: '设备评级',
      dataIndex: 'objRating',
      width: 100
    },
    {
      title: '设备维修策略',
      dataIndex: 'objMaintenanceStrategy',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 130,
      render: (text, record) => {
        return (
          <div>
            <Button type="link" size={'small'} onClick={()=>{check(record)}}>查看</Button>
            <Button type="link" size={'small'} onClick={()=>{edit(record)}}>编辑</Button>
          </div>
        )
      }
    }
  ];

  //获取列表数据
  useEffect(() => {
    Axios.get('/api/objectEvaluation').then(res =>{
      if(res.status === 200){
        setData(res.data);
        setLoading(false);
      }
    }).catch((err) =>{
        setLoading(true);
        console.log("列表数据加载失败")
    });
  }, [loading]);

  //关闭弹窗
  const handleCancel = () => {
    setVisible(false);
  }

  //查看
  const check = (record) => {
    setModalTitle("查看");
    setVisible(true);
    console.log(record)
  }

  //编辑
  const edit = (record) => {
    setModalTitle("编辑");
    setVisible(true);
    console.log(record)
  }

  return (
    <div>
      <Table
        rowKey="code"
        columns={columns}
        dataSource={data} 
        scroll={{ x: 1300 }}
      />

      <DetailModal title={modalTitle} {...{visible, handleCancel}}/>
    </div>
  )
}

export default ObjectEvaluation;
