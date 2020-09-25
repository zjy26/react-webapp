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
    }
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

const Index = () => {
  const [form] = Form.useForm()
  const [componentState, setComponentState] = useState('default')
  const [required, setRequired] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [hidden, setHidden] = useState(false)

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

  const onStateChange = ({ state }) => {
    setComponentState(state)
    switch(state) {
      case "required":
        setRequired(true);
        break;
      case "disabled":
        setDisabled(true);
        break;
      case "hidden":
        setHidden(true);
        break;
      default:
        setHidden(false);
        setRequired(false);
        setDisabled(false);
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
        <Form.Item label="Input" name="input" hidden={hidden} rules={[{required: required}]}>
          <Input disabled={disabled} />
        </Form.Item>
        <Form.Item label="Selsect" name="selsect" hidden={hidden}>
          <Select disabled={disabled}>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect" name="treeSelect" hidden={hidden}>
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
          />
        </Form.Item>
        <Form.Item label="Cascader" name="cascader">
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
          />
        </Form.Item>
        <Form.Item label="DatePicker" name="datePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="InputNumber" name="inputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Button">
          <Button htmlType={'submit'}>Button</Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={tableData} />

      <Tabs type="card" defaultActiveKey="tab1" disabled={disabled}>
        <Tabs.TabPane tab="Tab 1" key="tab1">
          Content of Tab Pane 1
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 2" key="tab2" disabled={disabled}>
          Content of Tab Pane 2
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tab 3" key="tab3">
          Content of Tab Pane 3
        </Tabs.TabPane>
      </Tabs>

    </>
  );
};


export default React.memo(Index)
