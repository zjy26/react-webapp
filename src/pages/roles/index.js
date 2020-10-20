import React, { useState } from 'react'
import { Divider, message, Tooltip, Popconfirm, Table, Drawer, Checkbox, Button, Input, Row, Col } from 'antd'
import { FormOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'
import styles from './Roles.module.scss'

const Index = props => {
  const [selectKey, setSelectKey] = useState([])
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)

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
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <>
            <Tooltip title="授权" placement="bottom"><LockOutlined onClick={() =>{ showDrawer(record.id) }} /></Tooltip>
            <Divider type="vertical" />
            <Tooltip title="编辑" placement="bottom"><FormOutlined /></Tooltip>
            <Divider type="vertical" />
            <Popconfirm title="是否删除此配置，删除后数据不能恢复？"
              onConfirm={() => { deleteItem(record.id) }}
            >
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
      roles: "管理员",
    },
    {
      id: 2,
      roles: "测试",
    }
  ]

  const permissionColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Option',
      dataIndex: 'option',
      width: '50%',
      key: 'option',
      render: (text, record) => {
        return (
          <Checkbox.Group style={{ width: '100%' }} onChange={(checkedValues) => selectPermission(record.key, checkedValues)}>
            <Row>
              {
                text.map(item => {
                  return (
                    <Col span={8} key={item.value}>
                      <Checkbox value={item.value}>{item.name}</Checkbox>
                    </Col>
                  )
                })
              }
            </Row>
          </Checkbox.Group>
        )
      }
    },
  ];

  const permissionData = [
    {
      key: 1,
      name: 'A',
      option: [{name:'新增', value: 'add'}, {name:'修改', value: 'edit'}, {name:'删除', value: 'delete'}],
      children: [
        {
          key: 11,
          name: 'A1',
          option: [{name:'新增', value: 'add'}, {name:'修改', value: 'edit'}],
        },
        {
          key: 12,
          name: 'A2',
          option: [{name:'修改', value: 'edit'}, {name:'删除', value: 'delete'}],
          children: [
            {
              key: 121,
              name: 'A2-1',
              option: [{name:'修改', value: 'edit'}],
            },
          ],
        },
        {
          key: 13,
          name: 'A3',
          option: [],
          children: [
            {
              key: 131,
              name: 'A3-1',
              option: [],
              children: [
                {
                  key: 1311,
                  name: 'A3-1-1',
                  option: [],
                },
                {
                  key: 1312,
                  name: 'A3-1-2',
                  option: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: 'B',
      option: [],
    },
    {
      key: 3,
      name: 'C',
      option: [{name:'新增', value: 'add'}, {name:'修改', value: 'edit'}, {name:'删除', value: 'delete'}],
      children: [
        {
          key: 31,
          name: 'C1',
          option: [{name:'新增', value: 'add'}, {name:'修改', value: 'edit'}],
        },
        {
          key: 32,
          name: 'C2',
          option: [{name:'修改', value: 'edit'}, {name:'删除', value: 'delete'}],
          children: [
            {
              key: 321,
              name: 'C2-1',
              option: [{name:'修改', value: 'edit'}],
            },
          ],
        },
        {
          key: 33,
          name: 'C3',
          option: [],
          children: [
            {
              key: 331,
              name: 'C3-1',
              option: [],
              children: [
                {
                  key: 3311,
                  name: 'C3-1-1',
                  option: [],
                },
                {
                  key: 3312,
                  name: 'C3-1-2',
                  option: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  //权限勾选操作
  const selectPermission = (record, values) => {
    console.log(record, values)
  }

  //搜索
  const search = (value) => {
    if(value) {
      const targetKeys = [], parentKeysArr=[];
      function deepSearch(tree, value){
        for(var i = 0; i<tree.length; i++) {
          if (tree[i].name.indexOf(value) > -1) {
            targetKeys.push(tree[i].key)
          }
          if(tree[i].children && tree[i].children.length>0) {
            deepSearch(tree[i].children, value)
          }
        }
      }
      deepSearch(permissionData, value)

      for(let i = 0; i<targetKeys.length; i++) {
        const arr = treeFindPath(permissionData, permissionData => permissionData.key === targetKeys[i])
        parentKeysArr.push(...arr)
        for(let j = 0; j < parentKeysArr.length; j++){
          if(parentKeysArr.indexOf(arr[i]) < 0){    //parentKeysArr中插入不重复的父节点key值
            parentKeysArr.push(arr[i])
          }
        }

      }

      setExpandedRowKeys(parentKeysArr)    //展开目标节点（目标节点为子节点时数组中必须包含父节点才能展开）
      setSelectKey(targetKeys)    //目标节点赋予样式
    }
  }

  //根据某条记录获取当前所有父级key值
  const treeFindPath = (tree, func, path = []) => {
    if (!tree) return []
    for (var data of tree) {
      path.push(data.key)
      if (func(data)) return path
      if (data.children) {
        const findChildren = treeFindPath(data.children, func, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }

  const onExpand = (expanded, record) => {
    if(expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.key])
    } else {
      expandedRowKeys.splice(expandedRowKeys.findIndex(item => item === record.key), 1)
      setExpandedRowKeys(expandedRowKeys)
    }
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
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={onClose} type="primary">
              确定
            </Button>
          </div>
        }
      >

      <Input.Search style={{ marginBottom: 8 }} enterButton="搜索" onSearch={value => search(value)} />

      <Table
        columns={permissionColumns}
        dataSource={permissionData}
        expandedRowKeys={expandedRowKeys}
        onExpand={onExpand}
        rowClassName={(record) => {
          for(var i in selectKey) {
            if(record.key === selectKey[i]) {
              return styles.rowStyle
            }
          }
        }}
        pagination={false}
        scroll={{y: document.body.clientHeight - 260}}
      />
      </Drawer>
    </React.Fragment>
  )
}

export default React.memo(Index)
