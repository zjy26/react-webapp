import React, { useState, useEffect, useRef } from 'react'
import {
  Divider,
  message,
  Tooltip,
  Popconfirm,
  Table,
  Drawer,
  Checkbox,
  Button,
  Input,
  Row,
  Col
} from 'antd'
import { FormOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'

const permissionsJson = {
  "id": "root",
  "i18n": "text.key",
  "name": "root",
  "resources": ["eap.user", "user.role"],
  "functions": [{
    "code": "create",
    "i18n": "label.function.create",
    "name": "新建",
    "value": true
  }, {
    "code": "delete",
    "name": "删除",
    "value": true
  }, {
    "code": "update",
    "name": "更新",
    "value": true
  }, {
    "code": "read",
    "name": "只读",
    "value": true
  }],
  "children": [{
    "id": "menu1",
    "i18n": "label.menu1",
    "name": "test",
    "resources": ["eap.site"],
    "functions": [{
      "code": "delete",
      "name": "删除",
      "value": false
    }, {
      "code": "update",
      "name": "更新",
      "value": true
    }, {
      "code": "read",
      "name": "只读",
      "value": true
    }]
  }, {
    "id": "menu2",
    "i18n": "label.menu2",
    "name": "test2",
    "resources": ["eap.unit"],
    "functions": [{
      "code": "delete",
      "name": "删除",
      "value": false
    }, {
      "code": "read",
      "name": "只读",
      "value": true
    }],
    "children" : [{
      "id": "menu2-1",
      "i18n": "label.Menu2-1",
      "name": "test2-1",
      "resources": ["eap.org"],
      "functions": [{
        "code": "delete",
        "name": "删除",
        "value": false
      }, {
        "code": "read",
        "name": "只读",
        "value": false
      }]
    }]
  }]
}

const initPermissionData = [permissionsJson];

const Index = props => {
  const searchRef = useRef()
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [permissionData, setPermissionData] = useState()
  const functionData = {}

  useEffect(() => {
    setPermissionData(initPermissionData)
  }, [])

  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }

  const deleteItem = (id) => {
    message.success("删除成功")
  }

  const columns = [
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles'
    }, {
      title: '操作',
      render: (_, record) => {
        return (
          <> < Tooltip title="授权" placement="bottom" > <LockOutlined
            onClick={() => {
              showDrawer(record.id)
              setExpandedRowKeys([permissionsJson.id])
            }} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="编辑" placement="bottom"><FormOutlined /></Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              title="是否删除此配置，删除后数据不能恢复？"
              onConfirm={() => {
                deleteItem(record.id)
              }}>
              <Tooltip title="删除" placement="bottom"><DeleteOutlined /></Tooltip>
            </Popconfirm>
          </>
        )
      }
    }
  ]

  const data = [
    {
      id: 1,
      roles: "管理员"
    }, {
      id: 2,
      roles: "测试"
    }
  ]

  const permissionColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => {
        const searchValue = searchRef && searchRef.current && searchRef.current.input && searchRef.current.input.state.value
        const str = text.indexOf(searchValue) !== -1
          ? <span style={{color: '#1890ff'}}>{text}</span>
          : text
        return str
      }
    }, {
      title: 'Functions',
      dataIndex: 'functions',
      width: '50%',
      key: 'functions',
      render: (text, record) => {
        const defaultValue = []
        return (
          <Checkbox.Group
            style={{
              width: '100%'
            }}
            defaultValue={defaultValue}
            onChange={(checkedValues) => selectPermission(record.id, checkedValues)}
          >
            <Row>
              {
                text.map((item, index) => {
                  if(item.value){
                    defaultValue.push(item.code)
                  }
                  return (
                    <Col span={8} key={index}>
                      <Checkbox value={item.code}>{item.name}</Checkbox>
                    </Col>
                  )
                })
              }
            </Row>
          </Checkbox.Group>
        )
      }
    }
  ]

  const hasProp = (string, prop) => {
    return string.indexOf(prop) > -1
  }

  //模糊查询获取目标数据且保留树形结构
  const recursiveFn = (data, val, arr = []) => {
    data.forEach(item => {
      const obj = { ...item }
      if (item.children && item.children.length > 0) {
        obj.children = recursiveFn(item.children, val)
        if (hasProp(item.name, val) || (obj.children && obj.children.length > 0)) {
          arr.push(obj)
        }
      } else {
        if (hasProp(item.name, val)) {
          arr.push(obj)
        }
      }
    })
    return arr
  }

  //获取目标数据所有key值
  const findKeys = (data, keysArr = []) => {
    data.forEach(item => {
      if(item.children && item.children.length > 0) {
        const childData  = findKeys(item.children)
        keysArr.push(...childData)
      }
      keysArr.push(item.id)
    })
    return keysArr
  }

  //搜索
  const search = (value) => {
    if (value) {
      let filterData = recursiveFn(initPermissionData, value)
      setPermissionData(filterData)
      setExpandedRowKeys(findKeys(filterData)) //展开目标节点（目标节点为子节点时数组中必须包含父节点才能展开）
    } else {
      setPermissionData(initPermissionData)
    }
  }

  const onExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([
        ...expandedRowKeys,
        record.id
      ])
    } else {
      expandedRowKeys.splice(
        expandedRowKeys.findIndex(item => item === record.id),
        1
      )
      setExpandedRowKeys(expandedRowKeys)
    }
  }

  //获取所有操作数据
  const getFunctionData = (data) => {
    data.forEach(item => {
      if(item.children && item.children.length > 0) {
        getFunctionData(item.children)
      }
      let funArr = []
      for(let i = 0; i<item.functions.length; i++) {
        if(item.functions[i].value) {
          funArr.push(item.functions[i].code)
        }
      }
      functionData[item.id] = funArr
    })
  }
  getFunctionData(initPermissionData)

  //权限勾选操作
  const selectPermission = (recordId, values) => {
    functionData[recordId] = values
  }

  //确定
  const onSubmit = () => {
    console.log(functionData)
  }

  return (
    <React.Fragment>
      <Table rowKey="id" columns={columns} dataSource={data} />
      <Drawer
        title="权限设置"
        placement="right"
        closable={false}
        maskClosable={false}
        onClose={onClose}
        visible={visible}
        width={720}
        footer={<div
          style={{
            textAlign: 'right',
          }} > <Button
            onClick={onClose}
            style={{
              marginRight: 8
            }}>
            取消
                </Button>
          <Button onClick={onSubmit} type="primary">
            确定
          </Button>
        </div>}>

        <Input.Search
          style={{
            marginBottom: 8
          }}
          enterButton="搜索"
          onSearch={value => search(value)}
          ref={searchRef} />

        <Table
          rowKey="id"
          columns={permissionColumns}
          dataSource={permissionData}
          expandedRowKeys={expandedRowKeys}
          onExpand={onExpand}
          pagination={false}
          scroll={{
            y: document.body.clientHeight - 260
          }} />
      </Drawer>
    </React.Fragment>
  )
}

export default React.memo(Index)
