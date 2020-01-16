import React from 'react';
import { Button, Result } from 'antd';

function Error(props) {
  if (props.status === 500) {
    //加载出错或找不到页面
    return (
      <Result
        status="500" 
        title="500"
        subTitle="Sorry, the server is wrong."
        extra={<Button type="primary"><a href="/home">Back Home</a></Button>}
      />
    )
  } else if (props.status === 404) {
    return (
      <Result
        status="404" 
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary"><a href="/home">Back Home</a></Button>}
      />
    )
  }
}

export default Error;
