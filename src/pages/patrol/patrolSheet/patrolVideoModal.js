import React, { useState, useEffect, useRef } from 'react';
import { Modal, Row, Col, Carousel, Button, Form, Select } from 'antd';
import { CaretUpOutlined, SyncOutlined, ZoomInOutlined, ZoomOutOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { patrolSheet } from '../../../api'

const PatrolVideoModal = props => {
  const [form] = Form.useForm()
  const welcome = useRef(null)
  const [site, setSite] = useState([])
  const [room, setRoom] = useState([])
  const [object, setObject] = useState([])
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  }

  const handleSiteChange = value => {
    patrolSheet.patrolLocList({site:value})
    .then(res => {
      if(res.robotLocs && res.robotLocs.length) {
        setRoom(res.robotLocs)
        setObject(res.robotLocs[0].objMap)
        form.setFieldsValue({
          "site1": value,
          "room1": res.robotLocs[0].patrolLocCode,
          "object1": res.robotLocs[0].objMap[0].OBJ_CODE
        })
        patrolSheet.patrolRegisterAccess({site:res.robotLocs[0].site,robotId:res.robotLocs[0].robotId,timestamp:(new Date().getTime())})
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
        })
      }else{
        setRoom([])
        setObject([])
        form.setFieldsValue({
          "site1": value,
          "room1": '',
          "object1": ''
        })
      }
    })
    .catch(() => {
    })
  }

  const handleRoomChange = value => {
    const selectedRoom = room.find(item => item.patrolLocCode === value)
    if(selectedRoom){
      form.setFieldsValue({
        "room1": value,
        "object1": selectedRoom.objMap[0].OBJ_CODE
      })
      setObject(selectedRoom.objMap)
    }else{
      form.setFieldsValue({
        "room1": value,
        "object1": ''
      })
      setObject([])
    }
  }

  const handleObjChange = value => {
    form.setFieldsValue({
      "object1": value
    })
  }
  const next = () => {
    welcome.current.next()
  }
  const prev = () => {
    welcome.current.prev()
  }
  //获取列表数据
  useEffect(() => {
    const currentId = props.currentId
    if(currentId){
      patrolSheet.patrolOrderSiteList()
      .then(res => {
        setSite(res.models)
      })
      .catch(() => {
      })

      patrolSheet.patrolLocList({id:currentId.id})
      .then(res => {
        if(res.robotLocs && res.robotLocs.length){
          setRoom(res.robotLocs)
          setObject(res.robotLocs[0].objMap)
          form.setFieldsValue({
            "site1": res.robotLocs[0].site,
            "room1": res.robotLocs[0].patrolLocCode,
            "object1": res.robotLocs[0].objMap[0].OBJ_CODE
          })
          patrolSheet.patrolRegisterAccess({site:res.robotLocs[0].site,robotId:res.robotLocs[0].robotId,timestamp:(new Date().getTime())})
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
          })
        }
      })
      .catch(() => {
      })
    }
  },[props.currentId, form])

  return (
    <Modal
      getContainer={false}
      title="查看视频"
      okText="确认"
      cancelText="取消"
      width = "1080px"
      visible={props.visible}
      onCancel={props.handleCancel}
    >
      <Row>
        <Col span={18}>
        </Col>
        <Col span={6}>
          <Carousel style={{width:"100%",height:"500px",borderLeft:"1px solid"}} autoplay={false} dots={false} ref={welcome}>

            <div style={{width:"100%",height:"100%"}}>
              <Row justify="center" style={{marginBottom:"32px"}}>
                <DoubleRightOutlined rotate={90} style={{fontSize:"40px"}} onClick={next}/>
              </Row>
              <Form colon={false} form={form} {...formItemLayout} >
                <Form.Item label="巡检站点" name="site1">
                  <Select placeholder="请选择站点" onChange={handleSiteChange}>
                    {
                      site.map(item => (
                        <Select.Option key={item.locCode}>
                          {item.locDesc}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="巡检房间" name="room1" >
                  <Select placeholder="请选择房间" onChange={handleRoomChange}>
                    {
                      room.map(item => (
                        <Select.Option key={item.patrolLocCode}>
                          {item.patrolLocDesc}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="巡检设备" name="object1">
                  <Select placeholder="请选择设备" onChange={handleObjChange}>
                    {
                      object.map(item => (
                        <Select.Option key={item.OBJ_CODE}>
                          {item.OBJ_DESC}
                        </Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Form>
            </div>
            <div style={{width:"100%",height:"100%"}}>
              {/* <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;控制台（机器人）</h3>
              <Row>
                <Col span={12} style={{borderRight:"1px solid"}}>
                  <Row style={{margin:"24px"}}>
                    <Col span={8}/>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined/>} size="large" />
                    </Col>
                    <Col span={8}/>
                  </Row>
                  <Row style={{margin:"24px"}}>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={-90}/>} size="large" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<SyncOutlined />} size="large" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={90}/>} size="large" />
                    </Col>
                  </Row>
                  <Row style={{margin:"24px"}}>
                    <Col span={8}/>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={180}/>} size="large" />
                    </Col>
                    <Col span={8}/>
                  </Row>
                </Col>
                <Col span={12} style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                  <Row style={{margin:"24px"}}>
                    <Button danger ghost block>暂停巡检</Button>
                  </Row>
                  <Row style={{margin:"24px"}}>
                    <Button danger ghost block>停止任务</Button>
                  </Row>
                  <Row style={{margin:"24px"}}>
                    <Button danger ghost block>添加临时巡检</Button>
                  </Row>
                </Col>
              </Row> */}
              <h3>控制台（摄像机）</h3>
              <Row>
                <Col span={12} style={{borderRight:"1px solid"}}>
                  <Row gutter={[8,8]} style={{margin:"8px"}}>
                    <Col span={8}><Button style={{margin:"auto 0"}} type="primary" icon={<CaretUpOutlined rotate={-45} />} size="middle" /></Col>
                    <Col span={8}><Button type="primary" icon={<CaretUpOutlined rotate={-45}/>} size="middle"/></Col>
                    <Col span={8}><Button type="primary" icon={<CaretUpOutlined rotate={45}/>} size="middle"/></Col>
                    <Col span={8}><Button type="primary" icon={<CaretUpOutlined rotate={-90}/>} size="middle"/></Col>
                    <Col span={8}><Button type="primary" icon={<SyncOutlined />} size="middle"/></Col>
                    <Col span={8}><Button type="primary" icon={<CaretUpOutlined rotate={90}/>} size="middle" /></Col>
                    <Col span={8}><Button style={{margin:"auto 0"}} type="primary" icon={<CaretUpOutlined rotate={-135}/>} size="middle"/></Col>
                    <Col span={8}><Button style={{margin:"auto 0"}} type="primary" icon={<CaretUpOutlined rotate={180}/>} size="middle"/></Col>
                    <Col span={8}><Button style={{margin:"auto 0"}} type="primary" icon={<CaretUpOutlined rotate={135}/>} size="middle"/></Col>
                  </Row>
                  {/* <Row style={{margin:"6px"}} justify="space-around">
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={-45} />} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined/>} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={45}/>} size="middle" />
                    </Col>
                  </Row>
                  <Row style={{margin:"6px"}} justify="space-around">
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={-90}/>} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<SyncOutlined />} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={90}/>} size="middle" />
                    </Col>
                  </Row>
                  <Row style={{margin:"6px"}}>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={-135} />} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={180}/>} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<CaretUpOutlined rotate={135} />} size="middle" />
                    </Col>
                  </Row> */}
                </Col>
                <Col span={12}>
                  <Row gutter={[8,8]} style={{margin:"8px"}} justify="space-around">
                    <Col span={8}>
                      <Button type="primary" icon={<ZoomOutOutlined />} size="middle" />
                    </Col>
                    <Col span={8}>
                      <Button type="primary" icon={<ZoomInOutlined />} size="middle" />
                    </Col>
                  </Row>
                  <Row style={{margin:"0 16px"}}>
                    <Button danger ghost block>上传图片</Button>
                  </Row>
                </Col>
              </Row>
              <Row justify="center" align="center" style={{height:"64px"}}>
                <DoubleRightOutlined rotate={-90} style={{fontSize:"40px"}} onClick={prev}/>
              </Row>
            </div>
          </Carousel>
        </Col>
      </Row>
    </Modal>
  )
}

export default PatrolVideoModal;
