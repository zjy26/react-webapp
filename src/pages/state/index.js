import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Tabs,
  Table,
  Divider,
} from 'antd'

const store = {
  disabled: {
    input: {
      name: 'input',
      type: 1,
      state: 'disabled'
    },
    select: {
      name: 'select',
      type: 1,
      state: 'disabled'
    },
    button1: {
      name: 'button1',
      type: 2,
      state: 'disabled'
    },
    button2: {
      name: 'button2',
      type: 2,
      state: 'disabled'
    },
    tab2: {
      name: 'tab2',
      type: 4,
      state: 'disabled'
    },
  },
  required: {
    input: {
      name: 'input',
      type: 1,
      state: 'required'
    },
    treeSelect: {
      name: 'treeSelect',
      type: 1,
      state: 'required'
    }
  },
  hidden: {
    input: {
      name: 'input',
      type: 1,
      state: 'hidden'
    },
    select: {
      name: 'select',
      type: 1,
      state: 'hidden'
    },
    age: {
      name: 'age',
      type: 5,
      state: 'hidden'
    },
    address: {
      name: 'address',
      type: 5,
      state: 'hidden'
    },
    button1: {
      name: 'button1',
      type: 2,
      state: 'hidden'
    },
    button3: {
      name: 'button3',
      type: 2,
      state: 'hidden'
    }
  },
  default: {
    input: {
      name: 'input',
      type: 1,
      state: 'default'
    },
    select: {
      name: 'select',
      type: 1,
      state: 'default'
    },
    treeSelect: {
      name: 'treeSelect',
      type: 1,
      state: 'required'
    }
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    hidden: true
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const tableData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
]

const Index = () => {
  const [form] = Form.useForm()
  const [componentState, setComponentState] = useState('default')
  const [tableCols, setTableCols] = useState(columns)

  const [state, setState] = useState({
    required: false,
    disabled: false,
    hidden: false
  })

  const onStateChange = ({ state }) => {
    setComponentState(state)
    switch(state) {
      case "required":
        setState(state => {
            return {...state, required: true}
          }
        );
        break;
      case "disabled":
        setState(state => {
            return {...state, disabled: true}
          }
        );
        break;
      case "hidden":
        setState(state => {
            return {...state, hidden: true}
          }
        );
        var copyCols = JSON.parse(JSON.stringify(columns))
        for(var i in store.hidden) {
          if(store.hidden[i].type === 5) {  //table column
            const name = i
            copyCols.map((item, index) => {
              if(item.dataIndex === name) {
                copyCols.splice(index, 1)
              }
              return copyCols
            })
            setTableCols(copyCols)
          }
        }
        break;
      default:
        setState({
          required: false,
          disabled: false,
          hidden: false
        });
        setTableCols(columns)
        form.resetFields()
    }
  }

  const onFinish = () => {
    form.validateFields()
    .then(values => {
      console.log(values)
    })
  }

  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        form={form}
        initialValues={{
          state: componentState,
        }}
        onValuesChange={onStateChange}
        onFinish={onFinish}
      >
        <Form.Item label="State" name="state">
          <Radio.Group>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="required">Required</Radio.Button>
            <Radio.Button value="disabled">Disabled</Radio.Button>
            <Radio.Button value="hidden">Hidden</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Input" name="input" hidden={store.hidden.input && state.hidden} rules={[{required: store.required.input && state.required}]}>
          <Input disabled={store.disabled.input && state.disabled} />
        </Form.Item>
        <Form.Item label="Selsect" name="select" hidden={store.hidden.select && state.hidden} rules={[{required: store.required.select && state.required}]}>
          <Select disabled={store.disabled.select && state.disabled}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect" name="treeSelect" hidden={store.hidden.treeSelect && state.hidden} rules={[{required: store.required.treeSelect && state.required}]}>
          <TreeSelect
            treeData={[
              {
                title: 'Light',
                value: 'light',
                children: [
                  {
                    title: 'Bamboo',
                    value: 'bamboo',
                  },
                ],
              },
            ]}
            disabled={store.disabled.treeSelect && state.disabled}
          />
        </Form.Item>
        <Form.Item label="Cascader" name="cascader" hidden={store.hidden.cascader && state.hidden} rules={[{required: store.required.cascader && state.required}]}>
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [
                  {
                    value: 'hangzhou',
                    label: 'Hangzhou',
                  },
                ],
              },
            ]}
            disabled={store.disabled.cascader && state.disabled}
          />
        </Form.Item>
        <Form.Item label="DatePicker" name="datePicker" hidden={store.hidden.datePicker && state.hidden} rules={[{required: store.required.datePicker && state.required}]}>
          <DatePicker disabled={store.disabled.datePicker && state.disabled} />
        </Form.Item>
        <Form.Item label="InputNumber" name="inputNumber" hidden={store.hidden.inputNumber && state.hidden} rules={[{required: store.required.inputNumber && state.required}]}>
          <InputNumber disabled={store.disabled.inputNumber && state.disabled} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 10,
            span: 14,
          }}
        >
          <Button htmlType={'submit'}>Submit</Button>
        </Form.Item>
      </Form>

      <Divider />

      <Button name="button1" disabled={store.disabled.button1 && state.disabled} hidden={store.hidden.button1 && state.hidden}>button1</Button>
      <Button name="button2" disabled={store.disabled.button2 && state.disabled} hidden={store.hidden.button2 && state.hidden}>button2</Button>
      <Button name="button3" disabled={store.disabled.button3 && state.disabled} hidden={store.hidden.button3 && state.hidden}>button3</Button>

      <Divider />

      <Table columns={tableCols} dataSource={tableData} />

      <Divider />

      <Tabs type="card" defaultActiveKey="tab1">
        <Tabs.TabPane tab="Tab 1" key="tab1" disabled={store.disabled.tab1 && state.disabled}>
          Content of Tab Pane 1
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 2" key="tab2" disabled={store.disabled.tab2 && state.disabled}>
          Content of Tab Pane 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 3" key="tab3" disabled={store.disabled.tab3 && state.disabled}>
          Content of Tab Pane 3
        </Tabs.TabPane>
      </Tabs>

    </>
  );
};


export default React.memo(Index)
