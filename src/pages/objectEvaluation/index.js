import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import Main from './main'
import Detail from './detail'

const ObjectEvaluation = props => {

  useEffect(() => {
    document.title = "设备评价"

  }, [])

  return (
    <Tabs type="card">
      <Tabs.TabPane tab="设备评价" key="1">
        <Main />
      </Tabs.TabPane>
      <Tabs.TabPane tab="设备评价详情" key="2">
        <Detail />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default React.memo(ObjectEvaluation)
