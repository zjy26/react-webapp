import React, { useState, useEffect } from 'react'
import { Modal, Input, message, Tag, Form, Radio, Select, Row, Col, InputNumber } from 'antd'
import { connect } from 'react-redux'
import { configLocation } from '../../../api/config/lineInfo'
import { upload, overheadLine, anchorSections, stationTracks, VEHICLE_ROUTE, CATENARY_TYPE, CATENARY_LOCATION_TYPE } from '../../../api/index'
import styles from './onePoleAndOneGear.module.scss'
import { PlusOutlined } from '@ant-design/icons'
import { EditUpload } from '../../common/upload'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const NewModal = props => {
  const locationTree = props.location.toJS()
  const [form] = Form.useForm()
  const [tags, setTags] = useState([])
  const [inputVisible, setInputVisible] = useState(false)
  const [vahicleRoute, setVahicleRoute] = useState([])
  const [catenaryType, setTatenaryType] = useState([])
  const [stationTrackList, setStationTrackList] = useState([])
  const [anchorSectionList, setAnchorSectionList] = useState([])
  const [intervals, setIntervals] = useState([])
  const [configLocations, setConfigLocations] = useState([])
  const [inputValue, setInputValue] = useState('')

  const [catenaryLocationTyoe, setCatenaryLocationTyoe] = useState([])
  const [siteOption, setSiteOption] = useState([])  //站点选择
  const [line, setLine] = useState('')  //线路
  const [okLoading, setOkLoading] = useState(false)

  //定位点图片
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (props.visible) {
      setOkLoading(false)
      form.resetFields()
      setFileList([])
      configLocation.configLocationList({ level: '4' })
        .then(res => {
          if (res) {
            setConfigLocations(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      VEHICLE_ROUTE()
        .then(res => {
          if (res) {
            setVahicleRoute(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      CATENARY_TYPE()
        .then(res => {
          if (res.models) {
            setTatenaryType(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
      CATENARY_LOCATION_TYPE()
        .then(res => {
          if (res.models) {
            setCatenaryLocationTyoe(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  useEffect(() => {
    if (line) {
      anchorSections({ line: line })
        .then(res => {
          if (res) {
            setAnchorSectionList(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })

      configLocation.configIntervalList({ line: line })
        .then(res => {
          if (res.models) {
            setIntervals(res.models)
          }
        })
        .catch(() => {
          console.log("列表数据加载失败")
        })
    }

  }, [line])

  const handleSubmit = async () => {
    try {
      form.validateFields()
        .then(values => {
          const { siteLine, ...data } = values
          const params = { ...data, _method: 'PUT', org: props.user.org, etag: tags.join(',') }
          setOkLoading(true)
          overheadLine.overHeadLineNew(params)
            .then((res) => {
              props.handleCancel()
              props.setDirty((dirty) => dirty + 1)
              form.resetFields()
              return res
            })
            .then((data) => {
              if (data && data.id) {
                const ids = []
                fileList.forEach(item => {
                  if (item.status === "done") {
                    ids.push(item.uid)
                  }
                })
                upload({
                  ids: ids.toString(),
                  record: data.id
                })
              }
            })
        })
    } catch (errorInfo) {
      return
    }
  }

  const showInput = () => {
    if (tags.length < 5) {
      setInputVisible(true)
    } else {
      message.info("最多输入5个标签")
    }

  }
  const handleClose = item => {
    const tagList = tags.filter(tag => tag !== item.item);
    setTags(tagList)
  };

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    if (inputValue) {
      if (tags.indexOf(inputValue) === -1) {
        tags.push(inputValue)
        setInputValue('')
        setInputVisible(false)
      } else {
        message.success("标签已存在")
      }
    } else {
      message.success("标签不能为空")
    }
  }

  const changeInterval = (value, option) => {
    configLocation.configIntervalDetail(option.id)
      .then(res => {
        if (res) {
          form.setFieldsValue({ site1: res.site1, site2: res.site2, catenaryType: res.catenaryType, vehicleRoute: res.vehicleRoute })
          const item = configLocations.find(obj => obj.code === res.site1)
          const item2 = configLocations.find(obj => obj.code === res.site2)
          if (item && item2 && item.siteFunction === '03' && item2.siteFunction === '03') {
            stationTracks()
              .then(res => {
                if (res) {
                  setStationTrackList(res.models)
                }
              })
          } else {
            setStationTrackList([])
          }

        }
      })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title="新建定位点"
      okText="确认"
      cancelText="取消"
      width="800px"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      okButtonProps={{ loading: okLoading }}
    >
      <Form {...formItemLayout} form={form} name="newOneForm">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="定位点描述" name="descr" rules={[{ required: true, message: '请输入定位点描述' }]}>
              <Input placeholder="请输入定位点描述" maxLength={20} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="状态" name="enable">
              <Radio.Group>
                <Radio value={1} checked>启用</Radio>
                <Radio value={2}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="线路" name="line" rules={[{ required: true, message: '请选择线路' }]}>
              <Select placeholder="请选择线路"
                onChange={
                  (value) => {
                    locationTree.lineSite && locationTree.lineSite.forEach(item => {
                      if (item.value === value) {
                        setLine(value)
                        setSiteOption(item.children)
                        form.setFieldsValue({ interval: null, site1: null, site2: null, catenaryType: null, vehicleRoute: null })
                      }
                    })
                  }
                }
              >
                {locationTree.line && locationTree.line.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                )
                )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="区间信息" name="interval" rules={[{ required: true, message: '请选择区间信息' }]}>
              <Select placeholder="请选择区间信息" onChange=

                {changeInterval}>
                {
                  intervals && intervals.map(item => (
                    <Select.Option key={item.code} value={item.code} id={item.id}>
                      {item.descr}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点1" name="site1">
              <Select disabled>
                {
                  siteOption && siteOption.length > 0 && siteOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  )
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="站点2" name="site2">
              <Select disabled>
                {
                  siteOption && siteOption.length > 0 && siteOption.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  )
                  )
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="行车路线" name="vehicleRoute">
              <Select disabled>
                {
                  vahicleRoute && vahicleRoute.length > 0 && vahicleRoute.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型" name="catenaryType">
              <Select disabled>
                {
                  catenaryType && catenaryType.length > 0 && catenaryType.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="锚段号" name="anchorSection">
              <Select placeholder="请选择锚段号">
                {
                  anchorSectionList && anchorSectionList.length > 0 && anchorSectionList.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.descr}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="股道号" name="stationTrack">
              <Select placeholder="请选择接触网位置类型">
                {
                  stationTrackList && stationTrackList.length > 0 && stationTrackList.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.descr}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="定位点号" name="anchorPoint" rules={[{ required: true, message: '请输入定位点号' }]}>
              <Input placeholder="请输入定位点号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="百米标" name="logo">
              <Input placeholder="请输入百米标" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="电子标签">
              {inputVisible && (
                <Input
                  type="text"
                  size="small"
                  className={styles.tag}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput}>
                  <PlusOutlined />新标签
                </Tag>
              )}
              {tags.map((item, index) =>
                <Tag key={item} closable onClose={() => handleClose({ item })}>{item}</Tag>
              )
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="悬挂形式" name="hangingForm">
              <Input placeholder="请输入悬挂形式" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="链式悬挂" name="chainSuspension">
              <Select placeholder="请选择链式悬挂" disabled={form.getFieldValue("catenaryType") === "0101" ? false : true}>
                <Select.Option value="正">正</Select.Option>
                <Select.Option value="反">反</Select.Option>
                <Select.Option value="无">无</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="布置位置" name="locationType">
              <Select placeholder="请选择接触网位置类型">
                {
                  catenaryLocationTyoe.length > 0 && catenaryLocationTyoe.map(item => (
                    <Select.Option key={item.code} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="顺序" name="sn">
              <InputNumber placeholder="请输入顺序" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公里标(m)" name="kmTable">
              <InputNumber placeholder="请输入公里标" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="曲面半径(m)" name="surfaceRadius">
              <InputNumber placeholder="请输入曲面半径(m)" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="定位点图片" {...{ labelCol: { span: 4 } }}>
              <EditUpload
                accept="image/*"
                listType="picture-card"
                model='d9OverheadLine-img'
                fileList={fileList}
                setFileList={setFileList}
                type={2}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location']),
    user: state.getIn(['common', 'user'])
  }
}

export default connect(mapStateToProps, null)(React.memo(NewModal))
