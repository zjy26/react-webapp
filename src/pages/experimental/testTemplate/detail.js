import React, { useEffect, useState } from 'react'
import { Row, Tabs, message } from 'antd'
import { Link } from 'react-router-dom'
import Basic from './detailTabs/basic/index'
import TestingProperty from './detailTabs/testingProperty/index'

const Detail = props => {
  const id = props.match.params.id

  const [activeKey, setActiveKey] = useState("bascInfo")  //默认显示基础信息tab
  const [editStatus, setEditStatus] = useState()  //基础信息编辑状态

  useEffect(() => {
    document.title = "试验模板详情"
  }, [])

  return (
    <React.Fragment>
      <Row>
        <Link to="/test-template"><img src={window.publicUrl + "/images/back.svg"} alt="返回" /></Link>
        <h2 style={{ margin: '-5px 0 10px 20px' }}>试验模板详情</h2>
      </Row>

      <Tabs
        tabPosition="left"
        activeKey={activeKey}
        onChange={
          (key) => {
            if (editStatus) {
              message.info('基础信息处于编辑状态，请先保存或取消')
            } else {
              setActiveKey(key)
            }
          }
        }
      >
        <Tabs.TabPane tab="基础信息" key="bascInfo">
          <Basic {...{ id, setEditStatus }} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="试验属性" key="testingProperty">
          <TestingProperty {...{ id }} />
        </Tabs.TabPane>
      </Tabs>

    </React.Fragment>
  )
}

export default React.memo(Detail)
