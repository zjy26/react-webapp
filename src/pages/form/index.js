import React, { useState, useEffect } from 'react'
import {
  Radio,
  Checkbox,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
  Cascader,
  Upload,
  Tree,
  Table,
  Modal,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: (
              <span
                style={{
                  color: '#1890ff',
                }}
              >
                sss
              </span>
            ),
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
]
const dataSource = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]

const Index = (props) => {
  const [visible, setVisible] = useState(false)
  const handleCancel = () => setVisible(false)

  useEffect(() => {
    // console.log(props.location.query.value)
    document.getElementById("componment").innerHTML = props.location.query ? props.location.query.value : "暂无数据"
  })

  const queryVals = props.location.query ? props.location.query.value : []
  let comp = null
  queryVals.map(item => {
    switch(item) {
      case "Button":
        comp = <>{comp}<Button>Button</Button></>
      break;
      case "Radio":
        comp = <>{comp}<Radio>Radio</Radio></>
      break;
      case "Checkbox":
        comp = <>{comp}<Checkbox>Checkbox</Checkbox></>
      break;
      case "Input":
        comp = <>{comp}<Input /></>
      break;
      case "InputNumber":
        comp = <>{comp}<InputNumber /></>
      break;
      case "DatePicker":
        comp = <>{comp}<DatePicker /></>
      break;
      case "Select":
        comp = <>{comp}<Select /></>
      break;
      case "Cascader":
        comp = <>{comp}<Cascader /></>
      break;
      case "Upload":
        comp = <>
                {comp}
                <Upload>
                  <Button>
                    <UploadOutlined /> Click to Upload
                  </Button>
                </Upload>
              </>
      break;
      case "Tree":
        comp =<>
              {comp}
                <Tree
                  checkable
                  defaultExpandedKeys={['0-0-0', '0-0-1']}
                  defaultSelectedKeys={['0-0-0', '0-0-1']}
                  defaultCheckedKeys={['0-0-0', '0-0-1']}
                  treeData={treeData}
                />
              </>
      break;
      case "Table":
        comp = <>
                {comp}
                <Table dataSource={dataSource} columns={columns} />
              </>
      break;
      case "Modal":
        comp =<>
                {comp}
                <Button onClick={()=>setVisible(true)}>Open Modal</Button>
              </>
      break;
      default:
        comp = null
    }
    return item
  })

  return (
    <React.Fragment>
      <div id="componment"></div>

      {comp}

      <Modal
        title="Basic Modal"
        visible={visible}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </React.Fragment>
  )
}

export default React.memo(Index)
