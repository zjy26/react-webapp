import React from 'react';
import { Cascader, Input } from 'antd';

const Demo = ({
  match: {
    params: { lang }
  }
}) => {
  const { TextArea } = Input;

  const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou'
        },
        {
          value: 'jinhua',
          label: 'jinhua'
        },
      ],
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing'
        },
        {
          value: 'suzhou',
          label: 'suzhou'
        },
        {
          value: 'yangzhou',
          label: 'yangzhou'
        },
      ],
    },
  ];
  
  function onChange(value) {
    console.log(value);
  }

  function filter(inputValue, path) {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  return (
    <div>
      <div>{lang}</div>
      <Cascader
        expandTrigger="hover"
        options={options}
        onChange={onChange}
        showSearch={{ filter }}
      
      />
    <br />
    <br />
    <Input placeholder="input with clear icon" allowClear onChange={onChange} />
    <br />
    <br />
    <TextArea placeholder="textarea with clear icon" allowClear onChange={onChange} />
    </div>
  )
}

export default Demo;