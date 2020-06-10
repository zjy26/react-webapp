import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Select, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { properties } from '../../../../../api'
import { configObjectTemplate } from '../../../../../api/config/objectTemplate'
import { setTable, MainTable } from '../../../../common/table'

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
const PropStdModal = props => {
  const {modalProperty, MyContext} = props
  const [childVisible, setChildVisible] = useState(false)
  const [childModalProperty, setChildModalProperty] = useState({})
  const childHandleCancel = () => {
    setChildVisible(false)
  }
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [data, setData] = useState([])
  const [pager, setPager] = useState({
    total: 0,
    current: 1,
    page: 1,
    start: 0,
    limit: 20
  })


  useEffect(() => {

    setTable(configObjectTemplate.unitPropStdList, setData, setLoading, pager, setPager, {}, {unitTemplate: modalProperty.unitTemplate})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, modalProperty.unitTemplate])

  const checkItem = (type, id) => {
    setChildVisible(true)
    setChildModalProperty({
      type: type,
      id: id,
      title: type === "add" ? "添加" : "编辑"
    })
  }
  const deleteItem = (id) => {
    Modal.confirm({
      title: '是否确认删除？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        configObjectTemplate.unitPropStdDelete(id)
        .then(() =>{
          message.success("删除成功")
          setDirty((dirty)=> dirty+1)
        })
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
      dataIndex: 'propertyDesc'
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
    <React.Fragment>
      <Modal
        maskClosable={false}
        title="参数标准"
        visible={props.visible}
        onCancel={props.handleCancel}
        handleCancel={props.handleCancel}
        zIndex={500}
        footer={[
          <Button key="cancel" onClick={()=>props.handleCancel()}>取消</Button>,
          <Button key="submit" onClick={()=>props.handleCancel()} danger>确定</Button>,
          <Button key="add" type="danger" hidden onClick={()=>{checkItem("add", null)}}>添加</Button>,
        ]}
      >
        <MainTable
          {...{ columns, data, loading, setDirty, pager, setPager,
            rowkey:"id",
          }}
        />
      </Modal>
      <CheckParametersStandardModal {...{modalProperty, childVisible, childModalProperty, childHandleCancel, setDirty, MyContext}}/>
    </React.Fragment>
  )
}

//参数标准新增编辑弹窗
const CheckParametersStandardModal = props => {
  const {modalProperty, childModalProperty, childVisible, childHandleCancel, setDirty} = props
  const [propertyList,setPropertyList] = useState([])
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})

  useEffect(() => {
    properties()
    .then(res => {
      if(res.models){
        setPropertyList(res.models)
      }
    })
    .catch(() => {
      console.log("列表数据加载失败")
    })
    if(childVisible) {
      if(childModalProperty.type === "edit") {
        configObjectTemplate.unitPropStdDetail(childModalProperty.id)
        .then(res=> {
          setInitValues(res)
          form.resetFields()
        })
      } else {
        configObjectTemplate.unitPropStdNew()
        .then(res=> {
          setInitValues(res)
          form.resetFields()
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childModalProperty, form])

  const handleOk = () => {
    form.validateFields()
    .then(values=>{
      childModalProperty.type === "add" ?
      configObjectTemplate.unitPropStdAdd({
        ...values,
        unitSn: modalProperty.unitSn,
        unitTemplate:modalProperty.unitTemplate,
         _method: 'PUT'
        })
      .then(()=>{
        message.success("新建成功")
        childHandleCancel()
        setDirty(dirty=> dirty+1)
      })
      :
      configObjectTemplate.unitPropStdUpdate(childModalProperty.id, {
        ...values,
        unitTemplate: modalProperty.unitTemplate,
        unitSn:modalProperty.unitSn,
        _method: 'PUT'
      })
      .then(()=>{
        message.success("编辑成功")
        childHandleCancel()
        setDirty(dirty=> dirty+1)
      })
    })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={childModalProperty.title}
      okText="确认"
      cancelText="取消"
      visible={childVisible}
      onCancel={childHandleCancel}
      onOk={handleOk}
    >
      <Form form={form} {...formItemLayout} initialValues={initValues}>
        <Form.Item label="属性" name="property">
          <Select placeholder="请输入属性" allowClear showSearch>
            {
              propertyList && propertyList.length>0 && propertyList.map(item => (
                <Select.Option key={item.code} value={item.code}>{item.desc}</Select.Option>
              ))
            }
          </Select>
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

export default React.memo(PropStdModal)
