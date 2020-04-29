import React, {useState} from 'react'
import { Modal, Button, Table, Form, Input, Row, Col, Select, Radio } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 },
  }
}

//参数标准弹窗
export const ParametersStandardModal = props => {

  const [childVisible, setChildVisible] = useState(false)
  const [childModalTitle, setChildModalTitle] = useState()
  const childHandleCancel = () => {
    setChildVisible(false)
  }


  const checkItem = (type, id) => {
    setChildVisible(true)
    if(type==="add") {
      setChildModalTitle("添加")
    } else {
      setChildModalTitle("编辑")
    }
  }
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {

      },
      onCancel() {
      },
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sn'
    },
    {
      title: '属性',
      dataIndex: 'property'
    },
    {
      title: '值',
      dataIndex: 'value'
    },
    {
      title: '备注',
      dataIndex: 'remarks'
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <span>
            <Button type="link" size={'small'} onClick={()=>{checkItem("edit", record.id)}}>编辑</Button>&nbsp;&nbsp;
            <Button type="link" size={'small'} onClick={()=>{deleteItem(record.id)}}>删除</Button>
          </span>
        )
      }
    }
  ]
  return (
    <>
      <Modal
        title="参数标准"
        visible={props.visible}
        onCancel={props.handleCancel}
        handleCancel={props.handleCancel}
        footer={[
          <Button key="cancel" onClick={()=>props.handleCancel()}>取消</Button>,
          <Button key="submit" danger>确定</Button>,
          <Button key="add" type="danger" onClick={()=>{checkItem("add", null)}}>添加</Button>,
        ]}
      >
        <Table columns={columns} dataSource={[{sn:'11'}]} rowKey="sn"/>
      </Modal>
      <CheckParametersStandardModal {...{childVisible, childModalTitle, childHandleCancel}}/>
    </>
  )
}

//参数标准新增编辑弹窗
const CheckParametersStandardModal = props => {
  const [form] = Form.useForm()

  const handleOk = () => {

  }

  return (
    <Modal
      getContainer={false}
      title={props.childModalTitle}
      okText="确认"
      cancelText="取消"
      visible={props.childVisible}
      onCancel={props.childHandleCancel}
      onOk={handleOk}
      zIndex={2000}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item label="属性" name="property">
          <Input placeholder="请输入属性"/>
        </Form.Item>
        <Form.Item label="值" name="value">
          <Input placeholder="请输入值"/>
        </Form.Item>
        <Form.Item label="备注" name="remarks">
          <Input placeholder="请输入备注"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}


//部件参数弹窗
export const PartsParametersModal = props => {
  const columns = [
    {
      title: '属性代码',
      dataIndex: 'code'
    },
    {
      title: '属性名称',
      dataIndex: 'descr'
    },
    {
      title: '属性说明',
      dataIndex: 'alias'
    },
    {
      title: '故障原因',
      dataIndex: 'reason'
    },
    {
      title: '处理方法',
      dataIndex: 'action'
    },
    {
      title: '备注',
      dataIndex: 'remarks'
    },
    {
      title: '属性值',
      dataIndex: 'value'
    },
    {
      title: '标准值',
      dataIndex: 'stdValue'
    },
    {
      title: '计量单位',
      dataIndex: 'uom'
    }
  ]
  return (
    <Modal
      title="部件参数"
      width={700}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Table columns={columns} dataSource={[{code:'11'}]} rowKey="code"/>
    </Modal>
  )
}

//新建编辑部件弹窗
const CheckPartsModal = props => {
  const [form] = Form.useForm()
  return (
    <Modal
      title={props.title}
      width={800}
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Form form={form} {...formItemLayout}>
        <Row gutter={24}>
          <Col span={24}><h3 style={{marginLeft:'3%'}}>基础信息</h3></Col>
          <Col span={12}>
            <Form.Item label="版本/镜像" name="version" rules={[{required: true, message: '请输入版本/镜像'}]}>
              <Input placeholder="请输入版本/镜像" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="编码" name="code">
              <Input placeholder="请输入编码" disabled/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="描述" name="descr">
              <Input placeholder="请输入描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="状态" name="enable">
            <Radio.Group>
              <Radio value={2}>启用</Radio>
              <Radio value={1}>未启用</Radio>
            </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备分类" name="cls" rules={[{required: true, message: '请选择设备分类'}]}>
              <Select placeholder="请选择设备分类" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="品牌" name="brand" rules={[{required: true, message: '请选择品牌'}]}>
              <Select placeholder="请选择品牌" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="型号" name="modelNumber" rules={[{required: true, message: '请输入型号'}]}>
              <Input placeholder="请输入型号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="规格" name="spec">
              <Input placeholder="请输入规格" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="comment">
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>

          <Col span={24}><h3 style={{marginLeft:'3%'}}>设备信息</h3></Col>
          <Col span={12}>
            <Form.Item label="设计寿命" name="designLife">
              <Input placeholder="请输入设计寿命" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="大修年限" name="repairLife">
              <Input placeholder="请输入大修年限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="更换年限" name="replaceLife">
              <Input placeholder="请输入更换年限" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="建议维护周期" name="maintenanceCycle">
              <Input placeholder="请输入建议维护周期" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制造商" name="manufact">
              <Select placeholder="请选择制造商" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="一次变比参数" name="transRatio1">
              <Input placeholder="请输入一次变比参数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="二次变比参数" name="transRatio2">
              <Input placeholder="请输入二次变比参数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="遵循标准" name="standard">
              <Input placeholder="请输入遵循标准" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备图片">

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="BIM结构图">

            </Form.Item>
          </Col>

          <Col span={24}><h3 style={{marginLeft:'3%'}}>企业信息</h3></Col>
          <Col span={12}>
            <Form.Item label="重要程度" name="importance">
              <Select placeholder="请选择重要程度" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ABC分类" name="classification">
              <Select placeholder="请选择ABC分类" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="固定资产分类" name="objectCls">
              <Select placeholder="请选择固定资产分类" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电压等级" name="voltageLevel">
              <Select placeholder="请选择电压等级" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="设备大类" name="mainCls">
              <Select placeholder="请选择设备大类" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="制E码/订货编号" name="ecode">
              <Input placeholder="请输入E码/订货编号" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
export default React.memo(CheckPartsModal)
